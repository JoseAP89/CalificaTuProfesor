import { Component, Input, OnInit, Renderer2 } from '@angular/core';
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

  /**
   *
   */
  constructor(private renderer: Renderer2) {
  }

  getColorStar(rank: RankingTopTeacher) {
    let colorClass;
    const starGrade = rank.averageGrade;
    if (starGrade < 1.25) {
      colorClass = 'star-bad';
    } else if (starGrade < 2.5) {
      colorClass = 'star-medium';
    } else if (starGrade < 3.75) {
      colorClass = 'star-good';
    } else {
      colorClass = 'star-excellent';
    }
    return colorClass;
  }

  getFullName(name: string, lastname1: string, lastname2: string): string {
    if(!name || !lastname1) return "";
    return (`${lastname1} ${lastname2} ${name}`).trim();
  }
}
