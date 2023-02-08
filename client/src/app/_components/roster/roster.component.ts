import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommentDB, RosterDB, RosterRating, Scale, UniStructure, Vessel } from 'src/app/_models/business';
import { RosterService } from 'src/app/_services/roster.service';
import { UnistructureService } from 'src/app/_services/unistructure.service';
import { RateComponent } from '../dialogs/rate/rate.component';
import { RatingService } from 'src/app/_services/rating.service';
import { ScaleService } from 'src/app/_services/scale.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit{

  public rosterId: number;
  public roster: RosterDB;
  public rosterRating: RosterRating;
  public rosterUniStructure: Vessel;
  public scales: Scale[];
  public comments: CommentDB[];

  constructor(
    private route: ActivatedRoute,
    private rosterService: RosterService,
    private ratingService: RatingService,
    private uniStructureService: UnistructureService,
    private scaleService: ScaleService,
    private dialog: MatDialog,
  ) {
    this.scales = [];
    this.comments = [];
  }

  get fullName(): string {
    return `${this.roster?.teacherName} ${this.roster?.teacherLastname1} ${this.roster?.teacherLastname2}`;
  }

  ngOnInit(): void {
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
    this.ratingService.GetFullComments(this.roster.rosterId).subscribe({
      next: res => {
        this.comments = res;
      }
    })
  }

  getScales(){
    this.scaleService.getScales().subscribe({
      next: res => {
        this.scales = res;
        setTimeout(() => {
          let scaleIds = this.scales.map( s => s.scaleId);
          for (const i of scaleIds) {
            let grade = document.querySelector(`.skill-${i}`);
            let x = this.rosterRating?.grades.find(g => g.scaleId==i);
            let y = this.scales.find(s => s.scaleId== x.scaleId);
            grade?.setAttribute("data-star",
              this.rosterRating?.grades.find(g => g.scaleId==i)?.stars.toFixed(1)
            );
          }
        }, 1_000 * 0.5);
      }
    })
  }

  openRateTeacherDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    this.dialog.open<RateComponent, RosterDB>(RateComponent, {
      data: this.roster,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "900px",
      height: "650px",
      panelClass: 'dialog-box'
    });
  }

}
