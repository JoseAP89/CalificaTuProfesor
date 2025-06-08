import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Campus, CampusTeacherList, RankingTopTeacher } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RatingService } from 'src/app/_services/rating.service';

@Component({
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.scss']
})
export class TeachersListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public search: string;
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
    private router: Router,
    private renderer: Renderer2
  ) {
    this.search = "";
    this.pageSize = this.pageSizeOptions[0];
  }

  ngOnInit(): void {
    this.getTeacherList();
    this.ratingService.getRankingTopTeacherList(10, 0, null, true)
      .pipe(
        finalize( ()=> {
          setTimeout(() => {
            this.updateStylingTeacherRankList();  
          });
        })
      )
    .subscribe({
      next: res => {
        this.rankTeacherList = res.data;
      }
    }) ;

  }

  updateStylingTeacherRankList(){
    const rankingContainer = document.querySelector(".campus-main-grid");
    if (rankingContainer) {
      const gridTemplateColumns = this.rankTeacherList && this.rankTeacherList.length > 0 ?
        '2fr 1fr':
        '1fr'
      this.renderer.setStyle(rankingContainer, 'grid-template-columns', gridTemplateColumns);
    }
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
    this.ratingService.getRankingTopTeacherList(20, 0, null, false, search).subscribe({
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
    this.ratingService.getRankingTopTeacherList(this.pageSize, this.pageNumber, null, false, this.search).subscribe({
      next: res => {
        this.teacherList = res.data;
        this.totalLength = res.totalElements;
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    if(!e) return;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex;
    this.getTeacherList();
  }

}