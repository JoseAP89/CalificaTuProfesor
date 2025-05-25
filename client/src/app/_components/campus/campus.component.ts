import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import { Campus, CampusTeacherList, RankingTopTeacher } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RatingService } from 'src/app/_services/rating.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit {

  private campusRecordId: string;
  public search: string;
  public campusInfo: Campus;
  public teacherList: Array<CampusTeacherList> = [];
  public rankTeacherList: Array<RankingTopTeacher> = [];

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
    private ratingService: RatingService
  ) {
    this.search = "";
  }

  ngOnInit(): void {
    this.campusRecordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.ratingService.getRankingTopTeacherList(20, 0, this.campusRecordId).subscribe({
      next: res => {
        this.teacherList = res.data;
      }
    }) ;
    this.ratingService.getRankingTopTeacherList(10, 0, this.campusRecordId, true).subscribe({
      next: res => {
        this.rankTeacherList = res.data;
      }
    }) ;
    this.campusService.getCampusByRecordId(this.campusRecordId).subscribe({
      next: res => {
        this.campusInfo = res;
      }
    });

  }

  onSearchChange(search: string){
    this.ratingService.getRankingTopTeacherList(20, 0, this.campusRecordId, false, search).subscribe({
      next: res => {
        this.teacherList = res.data;
      }
    });
  }

  onDeleteSearch(){
    this.search = "";
    this.ratingService.getRankingTopTeacherList(20, 0, this.campusRecordId, false, this.search).subscribe({
      next: res => {
        this.teacherList = res.data;
      }
    });

  }

}
