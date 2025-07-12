import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, firstValueFrom, iif, takeUntil, timer } from 'rxjs';
import { CommentContentDTO, CommentDTO, FullCommentDTO, NotificationDTO, RosterDB, RosterRating, Scale, SortPaginator, UniversityArea, UserCommentNotification, Vessel, VoteDTO } from 'src/app/_models/business';
import { RosterService } from 'src/app/_services/roster.service';
import { RateComponent } from '../dialogs/rate/rate.component';
import { RatingService } from 'src/app/_services/rating.service';
import { ScaleService } from 'src/app/_services/scale.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VoteService } from 'src/app/_services/vote.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { EditCommentComponent } from '../dialogs/edit-comment/edit-comment.component';
import { AcceptCancelData } from '../dialogs/cancel-accept/cancel-accept.component';
import { getHttpErrorMessage } from 'src/app/_helpers/miscelaneous';
import { AddNotificationComponent, NotificationDialogData } from '../dialogs/add-notification/add-notification.component';
import { NotificationService } from 'src/app/_services/notification.service';
import { UseridService } from 'src/app/_services/userid.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, AfterViewInit, OnDestroy{

  public averageGradeStarSize: number = 70;
  private destroy$ = new Subject<void>();

  private screenWidth: number = window?.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!event) {
      return;
    }
    this.updateAverageStarSize();
  }
  public currentUserId: string;
  public readonly sortPaginatorValues: Vessel[];
  public roster: RosterDB;
  public rosterRating: RosterRating;
  public scales: Scale[];
  public comments: FullCommentDTO[] = [];
  public userCommentNotificationIds: Set<number> = new Set()
  public canComment: boolean = false;

  private pageEvent: PageEvent;
  private _recordId: string;
  public totalLength: number;
  public pageSize: number;
  public sortPage: SortPaginator;
  public pageNumber: number; // page 0-index based
  public pageSizeOptions = [5, 10, 25, 50];
  public globalAverageGrade = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private rosterService: RosterService,
    private ratingService: RatingService,
    private scaleService: ScaleService,
    private voteService: VoteService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private renderer: Renderer2,
    private notificationService: NotificationService,
    private useridService: UseridService,
  ) {
    this.scales = [];
    this.comments = [];
    this.pageNumber = 0;
    this.pageSize = this.pageSizeOptions[0];
    this.sortPaginatorValues = [];
    this.getOrderSelect();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get fullName(): string {
    return `${this.roster?.teacherName} ${this.roster?.teacherLastname1} ${this.roster?.teacherLastname2}`;
  }

  ngOnInit(): void {
    this.getCurrentUserId();
    this.paginator._intl.itemsPerPageLabel="Comentarios por página - ";
    this.paginator._intl.nextPageLabel="página siguiente";
    this.paginator._intl.previousPageLabel="página anterior";
    this._recordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.buildRoster();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginator._intl.itemsPerPageLabel = 'Tamaño de página:';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.lastPageLabel = 'Ultima página';
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.changes.next(); // Trigger update
      this.updateAverageStarSize();
    }, 100);
  }

  buildRoster(){
    this.rosterService.getRosterInfoByRecordId(this._recordId).subscribe({
      next: (res: RosterDB) => {
        this.roster = res;
        this.getRosterRating();
        this.getComments();
        this.getScales();
        this.ratingService.canComment(this.currentUserId, this.roster.rosterId).subscribe({
          next: value => { this.canComment = value;}
        });
      }
    });
  }

  getCurrentUserId(){
    this.useridService.currentUserId
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: r => {
          this.currentUserId = r;
          return r;
        }
      });
  }

  isOwner(comment: CommentDTO): boolean {
    // You can edit only your own comments
    return !!this.currentUserId && comment.userId == this.currentUserId;
  }

  paintThumbBtns(comment: CommentDTO, approval?: boolean){
    const thumbsUpElement = document.querySelector(`#thumbs-up-icon-${comment.commentId}`);
    const thumbsDownElement = document.querySelector(`#thumbs-down-icon-${comment.commentId}`);
    if (approval == null) {
      this.renderer.removeClass(thumbsUpElement, 'thumbs-up-icon');
      this.renderer.removeClass(thumbsDownElement, 'thumbs-down-icon');
      return;
    }
    // chose right color
    if (approval) {
      if (thumbsUpElement && thumbsDownElement) {
        this.renderer.removeClass(thumbsUpElement, 'disable-btn');
        this.renderer.addClass(thumbsUpElement, 'thumbs-up-icon');
        this.renderer.removeClass(thumbsDownElement, 'thumbs-down-icon');
      }
    } else {
      if (thumbsDownElement && thumbsUpElement) {
        this.renderer.removeClass(thumbsDownElement, 'disable-btn');
        this.renderer.addClass(thumbsDownElement, 'thumbs-down-icon');
        this.renderer.removeClass(thumbsUpElement, 'thumbs-up-icon');
      }
    }
  }


  async voteComment(comment: CommentDTO, approval: boolean){
    if (!!this.currentUserId && comment.userId == this.currentUserId) {
      this.snackbarService.showErrorMessage("No puedes votar tu propio comentario.");
      return;
    }
    let vote = new VoteDTO();
    vote.approval = approval;
    vote.commentId = comment.commentId;
    vote.userId = this.currentUserId;
    this.voteService.addVote(vote).subscribe({
      next: async res => {
        let userId = await firstValueFrom(this.useridService.checkCurrentUserIdFromLocalStorage());
        if (!!!userId || !(typeof userId === 'string')) {
          this.useridService.setCurrentUserId(res.userId);
          this.currentUserId = res.userId;
        }
        this.ratingService.getComment(comment.commentId).subscribe({
          next: updatedComment => {
            for (let i = 0; i < this.comments.length; i++) {
              const cmt = this.comments[i];
              if (cmt.commentId === updatedComment.commentId) {
                approval = cmt.likes + cmt.dislikes > updatedComment.likes + updatedComment.dislikes?
                  null: // user removed his vote
                  approval; 
                this.comments[i].likes = updatedComment.likes; 
                this.comments[i].dislikes = updatedComment.dislikes; 
                this.paintThumbBtns(this.comments[i], approval);
              }
            }
            
          }
        })
      }
    });
  }

  /** Determines if the current user has voted or not in an specified comment, either a like or a dislike.*/
  hasVoted(comment: CommentDTO): boolean{
    return comment.currentUserVote;
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

  updateGlobalAverageGrade(){
    this.globalAverageGrade = this?.rosterRating?.averageGrade;
  }

  getRosterRating() {
    this.ratingService.getRosterRating(this.roster.rosterId).subscribe({
      next: res => {
        this.rosterRating = res;
        this.updateGlobalAverageGrade();
      }
    })
  }

  async getComments(){
    if (this.currentUserId) {
      this.getFullComments();
    } else {
      timer(2_000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async () => {
          this.currentUserId = await firstValueFrom(this.useridService.currentUserId);
          this.getFullComments(this.currentUserId);
        })
    }
  }

  getFullComments(userId: string = null) {
    this.ratingService.getFullComments(this.roster.rosterId, this.pageSize, this.sortPage, this.pageNumber, userId || this.currentUserId).subscribe({
      next: async res => {
        this.comments = res.data;
        this.pageNumber = res.pageNumber;
        this.pageSize = res.pageSize;
        this.totalLength = res.totalElements;
        this.comments.forEach(comment => {
          comment.averageGrade = this.getAverageCommentGrade(comment);
        });
        setTimeout(() => {
          this.comments.forEach(comment => {
            this.paintThumbBtns(comment, comment.currentUserVote);
          });
        });
      }
    })
  }

  transformDate(dateString: string): string {
    const date = new Date(dateString);
    return new DatePipe('es-MX').transform(date, 'dd-MMM-YY') || '';
  }

  getTeacherScaleGrade(scaleId: number): number{
    return this.rosterRating?.grades?.find(g => g.scaleId === scaleId)?.stars ?? 0;
  }

  getScales(){
    this.scaleService.getScales().subscribe({
      next: res => {
        this.scales = res;
      }
    })
  }

  openAcceptCancelDialogWindow(commentId: number){
    let data: AcceptCancelData = {
      title: "Borrar comentario",
      message: "¿Desea borrar el comentario? Este no podrá ser recuperado.",
      okBtnName: "Borrar",
      cancelBtnName: "Cancelar"
    }
    this.snackbarService.openCancelAcceptDialog(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (res) {
            this.ratingService.deleteComment(commentId).subscribe({ 
              next: res => {
                if (res>0) {
                  this.buildRoster();
                  this.snackbarService.showSuccessMessage(`El comentario fue borrado exitosamente.`);
                }
              }
            });
          }
        }
      });
  }

  openRateTeacherDialog(enterAnimationDuration: string = '100ms', exitAnimationDuration: string= '100ms'): void {
    setTimeout(() => {
      this.updateAverageStarSize();
    }, 100);
    const refOpenRateTeacherDialog = this.dialog.open<RateComponent, RosterDB, CommentDTO>(RateComponent, {
      data: this.roster,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "90vw",
      maxWidth: "850px",
      height: "621px",
      panelClass: 'dialog-box'
    });
    refOpenRateTeacherDialog.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CommentDTO) => {
          if(res == null) return;
          setTimeout(() => {
            this.buildRoster();
            // if a comment was created, then the backend creates an uuid for the user (userId), which will be used for future references
            if (res.userId) {
              this.useridService.setCurrentUserId(res.userId);
            }
          }, 500);
        }
      });
  }

  openEditCommentDialog(comment: CommentDTO, enterAnimationDuration: string = '100ms', exitAnimationDuration: string= '100ms'): void {
    let ref = this.dialog.open<EditCommentComponent, CommentDTO, CommentContentDTO>(EditCommentComponent, {
      data: comment,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "90vw",
      maxWidth: "600px",
      height: "273px",
      panelClass: 'dialog-box'
    });
    ref.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (res!=null && res.content != comment.content) {
            for (let i = 0; i < this.comments.length; i++) {
              const element = this.comments[i];
              if (element.commentId === res.commentId) {
                this.comments[i].content = res.content;
                return;
              }
              
            }
          } 
        }
      })
  }

  hasUserRaisedANotification(comment: CommentDTO): boolean {
    return comment?.notifications?.some(n => n.userId === this.currentUserId) ?? false ;
  }

  openAddNotificationDialog(comment: CommentDTO, enterAnimationDuration: string = '100ms', exitAnimationDuration: string= '100ms'): void {
    if (this.hasUserRaisedANotification(comment)) { // user has raised a notification already in this comment
      return;
    }
    let ref = this.dialog.open<AddNotificationComponent, NotificationDialogData, NotificationDTO>(AddNotificationComponent, {
      data: {
        commentId: comment.commentId, 
        userRecordId: this.currentUserId
      },
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width:'700px',
      panelClass: 'dialog-box'
    });
    ref.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (res!=null && res.notificationId) { // notification was created successfully
            if (!this.useridService.exist()) {
              this.useridService.setCurrentUserId(res.userId);
            }
            this.getComments();
          } 
        }
      });
  }

  handlePageEvent(e: PageEvent) {
    if(!e) return;
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex;
    this.getComments();
  }

  onFilterChange() {
    this.getComments();
  }

  private getAverageCommentGrade(comment: CommentDTO): number{
    let numerator = 0;
    if(!comment?.grades) return 0;
    const difficultyScale = this.scales?.filter(s => s.code == "DI")[0];
    if(!difficultyScale) return 0;
    const grades = comment.grades.filter(g => g.scaleId !== difficultyScale.scaleId);
    for (const grade of grades) {
      numerator+= grade.stars;
    }
    return numerator / grades.length;
  }

  getStarkRank(num: number): number {
    return Math.ceil(num);
  }

  updateAverageStarSize(){
    this.screenWidth = window?.innerWidth;
    if (this.screenWidth <= 400) {
      this.averageGradeStarSize = 40;
    } else {
      this.averageGradeStarSize = 70;
    }
  }

}
