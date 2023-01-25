import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RosterDB, UniStructure, Vessel } from 'src/app/_models/business';
import { RosterService } from 'src/app/_services/roster.service';
import { UnistructureService } from 'src/app/_services/unistructure.service';

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
  ) {}

  get fullName(): string {
    return `${this.roster?.teacher_name} ${this.roster?.teacher_lastname1} ${this.roster?.teacher_lastname2}`;
  }

  ngOnInit(): void {
    const rosterId = Number(this.route.snapshot.paramMap.get('rosterId'));
    this.rosterService.getRosterInfo(rosterId).subscribe({
      next: res=>{
        this.roster = res;
        this.uniStructure = this.uniStructureService.getUniStructure(this.roster.uni_structure_id);
        console.log(this.roster);
      }
    });
    console.log("rosterId:"+rosterId);
  }

}
