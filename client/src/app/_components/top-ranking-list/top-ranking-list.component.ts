import { Component, Input } from '@angular/core';
import { RankingTopTeacherList } from 'src/app/_models/business';

@Component({
  selector: 'app-top-ranking-list',
  templateUrl: './top-ranking-list.component.html',
  styleUrls: ['./top-ranking-list.component.scss']
})
export class TopRankingListComponent {
  @Input() title: string= "Top Ranking";
  @Input() showCampusName = true;
  @Input() rankTeacherList: Array<RankingTopTeacherList> = [];


  getFullName(name: string, lastname1: string, lastname2: string): string {
    if(!name || !lastname1) return "";
    return (`${name} ${lastname1} ${lastname2}`).trim();
  }
}
