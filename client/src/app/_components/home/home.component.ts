import { Component } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';

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

  /**
   *
   */
  constructor(
    private compusService: CampusService,
  ) {
    this.options = of([]);
    this.searchValue = '';
  }

  onSearch(input: string) {
    this.showOptions = true;
    this.options = this.compusService.getCampusWithUniversity(input).pipe(
      map( res => {
        return res.map( r => {
          // [campus , universidad]
          return [new Vessel(r.campus_id,r.name), new Vessel(r.university.university_id, r.university.name)];
        });
      })
    );
    console.log(input)

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
