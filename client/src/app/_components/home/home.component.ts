import { Component } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RosterService } from 'src/app/_services/roster.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public searchValue: string;
  public selectedOption: Vessel;
  public options: Observable<Vessel[][]>;
  public showOptions: boolean = false;
  public typeOfSearch: string = "P";

  /**
   *
   */
  constructor(
    private compusService: CampusService,
    private rosterService: RosterService,
  ) {
    this.options = of([]);
    this.searchValue = '';
  }

  onSearch(input: string) {
    this.showOptions = true;
    if (this.typeOfSearch == "P") { // Profesor
      this.options = this.rosterService.getTeacherCampus(input).pipe(
        map( res => {
          return res.map( r => {
            // [campus , universidad]
            let fullName = `${r.teacher_name} ${r.teacher_lastname1} ${r.teacher_lastname2}`;
            return [new Vessel(r.roster_id,fullName), new Vessel(r.campus.campus_id, r.campus.name)];
          });
        })
      );

    } else { // Campus
      this.options = this.compusService.getCampusWithUniversity(input).pipe(
        map( res => {
          return res.map( r => {
            // [campus , universidad]
            return [new Vessel(r.campus_id,r.name), new Vessel(r.university.university_id, r.university.name)];
          });
        })
      );
    }
  }

  onSelectedOption(row: Vessel){
    this.searchValue = row.value;
    this.selectedOption = row;
    this.showOptions = false;
  }

  changeShowOptions(value: boolean){
    this.showOptions = value;
  }

  clearSearchValue(){
    this.searchValue = "";
  }

}
