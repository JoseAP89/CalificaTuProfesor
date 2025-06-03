import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, debounceTime, delay, fromEvent, map, of } from 'rxjs';
import { RankingTopTeacher, Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RatingService } from 'src/app/_services/rating.service';
import { RosterService } from 'src/app/_services/roster.service';

export enum TypeOfSearch {
  Profesor = 1,
  Campus = 2,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public searchValue: string;
  public selectedOption: Vessel;
  public options: Observable<Vessel[][]>;
  public showOptions: boolean = false;
  public typeOfSearch: TypeOfSearch = TypeOfSearch.Profesor;
  public rankTeacherList: Array<RankingTopTeacher> = [];

  /**
   *
   */
  constructor(
    private compusService: CampusService,
    private rosterService: RosterService,
    private router: Router,
    private ratingService: RatingService,
  ) {
    this.options = of([]);
    this.searchValue = '';
  }

  ngOnInit(): void {
    let searchValueInput = document.querySelector("#search-value");
    const keyup$ = fromEvent(searchValueInput, 'keyup');
    keyup$.pipe(
      debounceTime(400)
    ).subscribe( (event: any) => {
      this.onSearch(event);
    });
    this.ratingService.getRankingTopTeacherList(10, 0, null, true).subscribe({
      next: res => {
        this.rankTeacherList = res.data;
      }
    }) ;
  }


  onSearch(input: any) {
    this.searchValue = input.target.value;
    //this.searchValue = input;
    this.showOptions = true;
    if (this.typeOfSearch == TypeOfSearch.Profesor) {
      this.options = this.rosterService.getTeacherCampus(this.searchValue).pipe(
        map( res => {
          return res.map( r => {
            // [roster , universidad]
            let fullName = `${r.teacherName} ${r.teacherLastname1} ${r.teacherLastname2}`;
            return [new Vessel(r.rosterId,fullName, r.signature), new Vessel(r.campus.campusId, `${r.campus.name}`)];
          });
        })
      );

    } else { // Campus
      this.options = this.compusService.getCampusWithUniversity(this.searchValue).pipe(
        map( res => {
          return res.map( r => {
            // [campus , universidad]
            return [new Vessel(r.campusId,r.name, r.recordId), new Vessel(r.university.universityId, r.university.name)];
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

    if (this.selectedOption?.id!=null && this.selectedOption.id != 0 && this.typeOfSearch == TypeOfSearch.Profesor) {
      this.router.navigate([`/maestro/${this.selectedOption.signature}`]);
    } else if (this.selectedOption?.id!=null && this.selectedOption.id != 0 && this.typeOfSearch == TypeOfSearch.Campus) {
      this.router.navigate([`/campus/${this.selectedOption.signature}`]);
    }
  }
}
