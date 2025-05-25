import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, firstValueFrom, iif, map, mergeMap, of, scheduled, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentContentDTO, CommentDTO, RankingTopTeacher, RosterRating, SortPaginator, TableData } from '../_models/business';
import { CommonService } from './common.service';
import { roundNumber } from '../_helpers/miscelaneous';

@Injectable({
  providedIn: 'root'
})
export class RatingService implements OnDestroy {

  private _userId : BehaviorSubject<string> ;
  private _name = "userId";

  private baseUrl = environment.API_URL + "/api/rating";
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
  ) {
    this._userId = new BehaviorSubject<string>(null);
    let userId = localStorage.getItem(this._name);
    if (!!userId) {
      this.setCurrentUserId(userId);
    } else { // it generates a new userId if there is none
      this.commonService.generateUserId().subscribe({
        next : r => {
          this.setCurrentUserId(r);
        }
      })
    }
  }

  ngOnDestroy(): void {
    this._userId.unsubscribe();
  }

  // TOKEN SERVICES

  public get currentUserId(): Observable<string> {
    return this._userId.asObservable();
  }

  public setCurrentUserId(value: string){
    localStorage.setItem(this._name, value);
    this._userId.next(value);
  }

  public checkSetAndGetCurrentUserID(): Observable<string>{
    let userId = localStorage.getItem(this._name);
    this._userId.next(userId);
    return this.currentUserId;
  }

  // HTTP SERVICES

  public addComment(comment: CommentDTO): Observable<CommentDTO> {
    const url = `${this.baseUrl}/comment`;
    return this.http.post<CommentDTO>(url, comment);
  }

  public editComment(comment: CommentContentDTO): Observable<CommentDTO> {
    const url = `${this.baseUrl}/comment`;
    return this.http.patch<CommentDTO>(url, comment);
  }

  public deleteComment(commentId: number): Observable<number> {
    const url = `${this.baseUrl}/comment/${commentId}`;
    return this.http.delete<number>(url);
  }

  public getRosterRating(rosterId: number): Observable<RosterRating> {
    const url = `${this.baseUrl}/getRosterRating/${rosterId}`;
    return this.http.get<RosterRating>(url);
  }

  public getFullComments(rosterId: number, pageSize: number, sortPage: SortPaginator, pageNumber: number = 0, currentUserId: string = null): Observable<TableData<CommentDTO>> {
    const url = `${this.baseUrl}/roster/fullComments/${rosterId}`;
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("sortPage", sortPage)
      .set("pageNumber", pageNumber)
      .set("currentUserId", currentUserId);
    return this.http.get<TableData<CommentDTO>>(url, {params});
  }

  public getRankingTopTeacherList(pageSize: number, pageNumber: number = 0, campusRecordIdStr: string = "" ,sortByRank: boolean = false, search: string = null): Observable<TableData<RankingTopTeacher>> {
    const url = `${this.baseUrl}/teacher/ranking`;
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber)
      .set("campusRecordIdStr", campusRecordIdStr)
      .set("sortByRank", sortByRank)
      .set("search", search ?? '');
    return this.http.get<TableData<RankingTopTeacher>>(url, {params}).pipe(
      map( r => {
        let data = r.data;
        for (const element of data) {
          element.averageGrade = roundNumber(element.averageGrade, 5);
        }
        return r;
      })
    );
  }

}
