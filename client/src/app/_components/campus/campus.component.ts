import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Campus, CampusTeacherList, RankingTopTeacher } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RatingService } from 'src/app/_services/rating.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private campusRecordId: string;
  public search: string;
  public campusInfo: Campus;
  public teacherList: Array<CampusTeacherList> = [];
  public rankTeacherList: Array<RankingTopTeacher> = [];

  public pageSizeOptions = [3,5,10,20];
  public totalLength = 0;
  public pageSize = 0;
  public pageNumber = 0;

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
    private ratingService: RatingService,
    private router: Router
  ) {
    this.search = "";
    this.pageSize = this.pageSizeOptions[0];
  }

  ngOnInit(): void {
    this.campusRecordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.getTeacherList();
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginator._intl.itemsPerPageLabel = 'Tamaño de página:';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.lastPageLabel = 'Ultima página';
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.changes.next(); // Trigger update
    }, 100);
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
    this.getTeacherList();
  }

  onRowDoubleClick(row: CampusTeacherList){
    if(row?.teacherRecordId)
      this.router.navigate([`/maestro/${row.teacherRecordId}`]); 
  }

  getTeacherList(){
    this.ratingService.getRankingTopTeacherList(this.pageSize, this.pageNumber, this.campusRecordId, false, this.search).subscribe({
      next: res => {
        this.teacherList = res.data;
        this.totalLength = res.totalElements;
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex;
    this.getTeacherList();
  }

}
