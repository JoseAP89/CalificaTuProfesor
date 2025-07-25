import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Roster, RosterDB, TeacherCampus, Vessel } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private baseUrl = environment.API_URL_DOT_NET + "/api/roster";

  constructor(
    private http: HttpClient,
  ) {
  }

  public getRosterInfo(rosterId: number): Observable<RosterDB> {
    const url = `${this.baseUrl}/info/${rosterId}`;
    return this.http.get<RosterDB>(url);
  }

  public getRosterInfoByRecordId(recordId: string): Observable<RosterDB> {
    const url = `${this.baseUrl}/info/recordId/${recordId}`;
    return this.http.get<RosterDB>(url);
  }

  public getTeacherCampus(data: string): Observable<TeacherCampus[]> {
    const url = `${this.baseUrl}/campus/${data}`;
    return this.http.get<TeacherCampus[]>(url);
  }


  public addRoster(data: RosterDB): Observable<Roster> {
    const url = this.baseUrl;
    return this.http.post<Roster>(url, data);
  }

}
