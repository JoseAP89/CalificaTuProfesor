import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommentDTO, RosterDB, RosterRating, Scale, SortPaginator, UniStructure, Vessel, VoteDTO } from 'src/app/_models/business';
import { RosterService } from 'src/app/_services/roster.service';
import { UnistructureService } from 'src/app/_services/unistructure.service';
import { RateComponent } from '../dialogs/rate/rate.component';
import { RatingService } from 'src/app/_services/rating.service';
import { ScaleService } from 'src/app/_services/scale.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VoteService } from 'src/app/_services/vote.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit{

  public currentUserId: string;
  public readonly sortPaginatorValues: Vessel[];
  public rosterId: number;
  public roster: RosterDB;
  public rosterRating: RosterRating;
  public rosterUniStructure: Vessel;
  public scales: Scale[];
  public comments: CommentDTO[];

  private pageEvent: PageEvent;
  public totalLength: number;
  public pageSize: number;
  public sortPage: SortPaginator;
  public pageNumber: number; // page 0-index based
  public pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private rosterService: RosterService,
    private ratingService: RatingService,
    private uniStructureService: UnistructureService,
    private scaleService: ScaleService,
    private voteService: VoteService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) {
    this.scales = [];
    this.comments = [];
    this.pageNumber = 0;
    this.pageSize = this.pageSizeOptions[0];
    this.sortPaginatorValues = [];
    this.getOrderSelect();
  }

  get fullName(): string {
    return `${this.roster?.teacherName} ${this.roster?.teacherLastname1} ${this.roster?.teacherLastname2}`;
  }

  ngOnInit(): void {
    this.getCurrentUserId();
    this.paginator._intl.itemsPerPageLabel="Comentarios por página";
    this.paginator._intl.nextPageLabel="página siguiente";
    this.paginator._intl.previousPageLabel="página anterior";
    const recordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.rosterService.getRosterInfoByRecordId(recordId).subscribe({
      next: (res: RosterDB) => {
        this.roster = res;
        this.getUniStructures();
        this.getScales();
        this.getComments();
        this.getRosterRating();
      }
    });
  }

  getCurrentUserId(){
    this.ratingService.currentUserId.subscribe({next: r => this.currentUserId = r});
  }

  voteComment(comment: CommentDTO, approval: boolean){
    if (!!this.currentUserId && comment.userId == this.currentUserId) {
      this.snackbarService.showErrorMessage("You cannot vote your own comment.");
      return;
    }
    let vote = new VoteDTO();
    vote.approval = approval;
    vote.commentId = comment.commentId;
    vote.userId = this.currentUserId;
    this.voteService.addVote(vote).subscribe({
      next: res => {
        this.getComments();
      },
      error: e => {
        this.snackbarService.showErrorMessage(e?.message || "There was an error voting the comment.");
      }
    });
  }

  /** Determines if the current user has voted or not in an specified comment, either a like or a dislike.*/
  hasVoted(comment: CommentDTO): boolean{
    return comment.votes.find(v => v.userId == this.currentUserId)?.approval;
  }

  getOrderSelect(){
    for (let value in SortPaginator) {
      let n = Number(value);
      if (!isNaN(n)) {
        // TODO: change value to a readable name
        let id = Number(value);
        let val = "";
        switch (id) {
          case SortPaginator.DateAsc:
            val = "Fecha ascendente";
            break;
          case SortPaginator.DateDesc:
            val = "Fecha descendente";
            break;
          case SortPaginator.MostLiked:
            val = "Más Likes";
            break;
          case SortPaginator.MostDisliked:
            val = "Más Dislikes";
            break;
          case SortPaginator.SubjectAsc:
            val = "Nombre de materia ascendente";
            break;
          case SortPaginator.SubjectDesc:
            val = "Nombre de materia descendente";
            break;
          default:
            break;
        }
        let v = new Vessel(id, val);
        this.sortPaginatorValues.push(v);
      }
    }
    this.sortPage = this.sortPaginatorValues.find(s => s.id == SortPaginator.DateDesc).id;

  }

  updateRatingInfo(){
    let averageGrade = document.querySelector(".average-grade");
    averageGrade?.setAttribute("data-star", this.rosterRating?.averageGrade?.toString());
  }

  getRosterRating() {
    this.ratingService.getRosterRating(this.roster.rosterId).subscribe({
      next: res => {
        this.rosterRating = res;
        this.updateRatingInfo();
      }
    })
  }

  getUniStructures(){
    this.uniStructureService.getUniStructure(this.roster?.uniStructureId).subscribe({
      next: res => {
        this.rosterUniStructure = res;
      }
    })
  }

  getComments(){
    this.ratingService.GetFullComments(this.roster.rosterId, this.pageSize, this.sortPage, this.pageNumber).subscribe({
      next: res => {
        this.comments = res.data;
        this.pageNumber = res.pageNumber;
        this.pageSize = res.pageSize;
        this.totalLength = res.totalElements;
      }
    })
  }

  getScales(){
    this.scaleService.getScales().subscribe({
      next: res => {
        this.scales = res;
        setTimeout(() => {
          let scaleIds = this.scales.map( s => s.scaleId);
          // updates global individual skills of the teacher
          for (const i of scaleIds) {
            let grade = document.querySelector(`.skill-${i}`);
            grade?.setAttribute("data-star",
              this.rosterRating?.grades.find(g => g.scaleId==i)?.stars.toFixed(1)
            );
          }
        }, 1_000 * 0.5);
      }
    })
  }

  openRateTeacherDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    let ref = this.dialog.open<RateComponent, RosterDB, CommentDTO>(RateComponent, {
      data: this.roster,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "900px",
      height: "650px",
      panelClass: 'dialog-box'
    });
    ref.afterClosed().subscribe({
      next: res => {
        if (res!=null) {
          this.getScales();
          this.getRosterRating();
          this.getComments();
        } // if a comment was created, then the backend creates an uuid for the user (userId), which will be used for future references
        if (res.userId) {
          this.ratingService.setCurrentUserId(res.userId);
        }
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex;
    this.getComments();
  }

  onFilterChange() {
    this.getComments();
  }

  addLike(){

  }

  addDislike(){

  }

  addWarning(){

  }

}
