import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDTO, RosterRating, SortPaginator, TableData } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class RatingService implements OnDestroy {

  private _userId : BehaviorSubject<string>;
  private _name = "userId";

  private baseUrl = environment.api_url + "/api/rating";
  constructor(
    private http: HttpClient,
  ) {
    this._userId = new BehaviorSubject<string>(localStorage.getItem(this._name) ?? "");
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

  // HTTP SERVICES

  public addComment(comment: CommentDTO): Observable<CommentDTO> {
    const url = `${this.baseUrl}/comment`;
    return this.http.post<CommentDTO>(url, comment);
  }

  public getRosterRating(rosterId: number): Observable<RosterRating> {
    const url = `${this.baseUrl}/getRosterRating/${rosterId}`;
    return this.http.get<RosterRating>(url);
  }

  public GetFullComments(rosterId: number, pageSize: number, sortPage: SortPaginator, pageNumber: number = 0): Observable<TableData<CommentDTO>> {
    const url = `${this.baseUrl}/roster/fullComments/${rosterId}`;
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("sortPage", sortPage)
      .set("pageNumber", pageNumber);
    return this.http.get<TableData<CommentDTO>>(url, {params});
  }

}
