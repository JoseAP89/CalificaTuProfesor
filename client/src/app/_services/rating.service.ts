import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDB, RosterRating } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private baseUrl = environment.api_url + "/api/rating";
  constructor(
    private http: HttpClient,
  ) { }

  public addComment(comment: CommentDB): Observable<CommentDB> {
    const url = `${this.baseUrl}/comment`;
    return this.http.post<CommentDB>(url, comment);
  }

  public getRosterRating(rosterId: number): Observable<RosterRating> {
    const url = `${this.baseUrl}/getRosterRating/${rosterId}`;
    return this.http.get<RosterRating>(url);
  }

  public GetFullComments(rosterId: number): Observable<CommentDB[]> {
    const url = `${this.baseUrl}/roster/fullComments/${rosterId}`;
    return this.http.get<CommentDB[]>(url);
  }

}
