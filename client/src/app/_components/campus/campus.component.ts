import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, fromEvent, Subject, Subscription, takeUntil } from 'rxjs';
import { Campus, CampusTeacherList } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RatingService } from 'src/app/_services/rating.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private keyupSubscription: Subscription;
  private destroy$ = new Subject<void>();
  private campusRecordId: string;
  public search: string;
  public campusInfo: Campus;
  public teacherList: Array<CampusTeacherList> = [];
  public rankTeacherList: Array<CampusTeacherList> = [];

  public pageSizeOptions = [3,5,10,20];
  public totalLength = 0;
  public pageSize = 0;
  public pageNumber = 0;

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
    private ratingService: RatingService,
    private router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
    this.search = "";
    this.pageSize = this.pageSizeOptions[0];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.keyupSubscription) {
      this.keyupSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    let searchValueInput = this.elRef.nativeElement.querySelector("#search-value");
    const keyup$ = fromEvent(searchValueInput, 'keyup');
    this.keyupSubscription = keyup$.pipe(
      debounceTime(400),
      takeUntil(this.destroy$)
    ).subscribe( (event: any) => {
      this.onSearch(event);
    });
    this.campusRecordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.getTeacherList();
    this.ratingService.getRankingTopTeacherList(10, 0, this.campusRecordId, true)
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
    this.campusService.getCampusByRecordId(this.campusRecordId).subscribe({
      next: res => {
        this.campusInfo = res;
      }
    });

  }

  updateStylingTeacherRankList(){
    const rankingContainer = this.elRef.nativeElement.querySelector(".campus-main-grid");
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

  onSearch(input: any){
    this.search = input.target.value;
    this.pageNumber = 0;
    this.getTeacherList();
  }

  onDeleteSearch(){
    this.search = "";
    this.pageNumber = 0;
    this.getTeacherList();
  }

  onRowDoubleClick(row: CampusTeacherList){
    if(row?.rosterRecordId)
      this.router.navigate([`/maestro/${row.rosterRecordId}`]); 
  }

  getTeacherList(){
    this.ratingService.getRankingTopTeacherList(this.pageSize, this.pageNumber, this.campusRecordId, false, this.search).subscribe({
      next: res => {
        this.teacherList = res.data;
        this.totalLength = res.totalElements;
        this.pageSize = res.pageSize;
        this.pageNumber = res.pageNumber;
        if (this.paginator) {
          this.paginator.pageIndex = this.pageNumber;
          this.paginator.pageSize = this.pageSize;
        }
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
