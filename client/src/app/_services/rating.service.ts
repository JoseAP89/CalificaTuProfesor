import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, firstValueFrom, iif, map, mergeMap, of, scheduled, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentContentDTO, CommentDTO, CampusTeacherList, RosterRating, SortPaginator, TableData } from '../_models/business';
import { roundNumber } from '../_helpers/miscelaneous';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private baseUrl = environment.API_URL_DOT_NET + "/api/rating";
  constructor(
    private http: HttpClient,
  ) {}

  // HTTP SERVICES

  public canComment(userId: string, teacherId: number): Observable<boolean> {
    const url = `${this.baseUrl}/can-comment`;
    let params = new HttpParams()
      .set("userId", userId)
      .set("teacherId", teacherId);
    return this.http.get<boolean>(url, {params});
  }

  public getComment(commentId: number): Observable<CommentDTO> {
    const url = `${this.baseUrl}/comment/${commentId}`;
    return this.http.get<CommentDTO>(url);
  }

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

  public getRankingTopTeacherList(pageSize: number, pageNumber: number = 0, campusRecordIdStr: string = "" ,sortByRank: boolean = false, search: string = null): Observable<TableData<CampusTeacherList>> {
    const url = `${this.baseUrl}/teacher/ranking`;
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber)
      .set("campusRecordIdStr", campusRecordIdStr? campusRecordIdStr: '')
      .set("sortByRank", sortByRank)
      .set("search", search ?? '');
    return this.http.get<TableData<CampusTeacherList>>(url, {params}).pipe(
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
