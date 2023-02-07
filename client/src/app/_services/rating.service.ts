import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDB } from '../_models/business';

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

}
