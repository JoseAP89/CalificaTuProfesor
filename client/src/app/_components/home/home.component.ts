import { Component } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public searchValue: string = "";
  public options: any[];
  public showOptions: boolean = false;

  /**
   *
   */
  constructor() {
    this.options = ["Option 1","Option 2","Option 3","Option 4","Option 5","Option 6"]
  }

  onSearch(input: string) {
    this.showOptions = true;
    console.log(input)

  }

  onSelectedOption(value: string){
    this.searchValue = value;
    this.showOptions = false;
  }


}
