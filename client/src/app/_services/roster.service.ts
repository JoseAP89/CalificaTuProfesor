import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Roster, RosterDB } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private baseUrl = environment.api_url + "/api/roster";

  constructor(
    private http: HttpClient,
  ) {
  }

  public addRoster(data: RosterDB): Observable<Roster> {
    const url = this.baseUrl;
    return this.http.post<Roster>(url, data);
  }

}
