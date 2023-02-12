import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDTO, RosterRating, SortPaginator, TableData } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private baseUrl = environment.api_url + "/api/rating";
  constructor(
    private http: HttpClient,
  ) { }

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
