import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RosterDB, UniStructure, Vessel } from 'src/app/_models/business';
import { RosterService } from 'src/app/_services/roster.service';
import { UnistructureService } from 'src/app/_services/unistructure.service';
import { RateComponent } from '../dialogs/rate/rate.component';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit{

  public rosterId: number;
  public roster: RosterDB;
  public uniStructure: Observable<Vessel>;

  constructor(
    private route: ActivatedRoute,
    private rosterService: RosterService,
    private uniStructureService: UnistructureService,
    private dialog: MatDialog,
  ) {}

  get fullName(): string {
    return `${this.roster?.teacherName} ${this.roster?.teacherLastname1} ${this.roster?.teacherLastname2}`;
  }

  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.rosterService.getRosterInfoByRecordId(recordId).subscribe({
      next: (res: RosterDB) => {
        this.roster = res;
        this.uniStructure = this.uniStructureService.getUniStructure(this.roster.uniStructureId);
      }
    });
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
