import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, map, of } from 'rxjs';
import { Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RosterService } from 'src/app/_services/roster.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

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
    private snackbarService: SnackbarService,
    private router: Router,
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
            // [roster , universidad]
            let fullName = `${r.teacherName} ${r.teacherLastname1} ${r.teacherLastname2}`;
            return [new Vessel(r.rosterId,fullName, r.signature), new Vessel(r.campus.campusId, `${r.subjectName} * ${r.campus.name}`)];
          });
        })
      );

    } else { // Campus
      this.options = this.compusService.getCampusWithUniversity(input).pipe(
        map( res => {
          return res.map( r => {
            // [campus , universidad]
            return [new Vessel(r.campusId,r.name), new Vessel(r.university.universityId, r.university.name)];
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

  onSubmit(){
    if (this.selectedOption?.id!=null && this.selectedOption.id != 0) {
      this.router.navigate([`/maestro/${this.selectedOption.signature}`]);
    }
  }
}
