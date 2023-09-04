import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VoteDTO } from '../_models/business';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private baseUrl = environment.api_url + "/api/vote";

  constructor(
    private http: HttpClient,
  ) {
  }

  public addVote(vote: VoteDTO): Observable<VoteDTO> {
    const url = `${this.baseUrl}`;
    return this.http.post<VoteDTO>(url, vote);
  }

}
