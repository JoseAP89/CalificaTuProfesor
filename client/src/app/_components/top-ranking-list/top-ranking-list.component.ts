import { Component, Input } from '@angular/core';
import { RankingTopTeacher } from 'src/app/_models/business';

@Component({
  selector: 'app-top-ranking-list',
  templateUrl: './top-ranking-list.component.html',
  styleUrls: ['./top-ranking-list.component.scss']
})
export class TopRankingListComponent {
  @Input() title: string= "Top Ranking";
  @Input() showCampusName = true;
  @Input() rankTeacherList: Array<RankingTopTeacher> = [];


  getFullName(name: string, lastname1: string, lastname2: string): string {
    if(!name || !lastname1) return "";
    return (`${lastname1} ${lastname2} ${name}`).trim();
  }
}
