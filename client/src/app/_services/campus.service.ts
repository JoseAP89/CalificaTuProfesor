import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Campus, CampusUniversity, NewCampus, Vessel } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  private baseUrl = environment.api_url + "/api/campus";

  constructor(
    private http: HttpClient,
  ) {
  }

  public getCampusWithUniversity(target: String): Observable<Array<CampusUniversity>>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${this.baseUrl}/university/${target}`;
    return this.http.get<CampusUniversity[]>(url);
  }

  public getShortCampusById(campusId: number): Observable<Campus>{
    const url = `${this.baseUrl}/${campusId}`;
    return this.http.get<Campus>(url);
  }

  public getShortCampusByName(campusName: string): Observable<Campus>{
    const url = `${this.baseUrl}/${campusName}`;
    return this.http.get<Campus>(url);
  }


  public getCampusInfo(campusId: number): Observable<Campus>{
    const url = `${this.baseUrl}/info/${campusId}`;
    return this.http.get<Campus>(url);
  }

  public getCampusSearch(value: string): Observable<Vessel[]>{
    const url = `${this.baseUrl}/search/${value}`;
    return this.http.get<Vessel[]>(url);
  }

  public addCampus(data: NewCampus): Observable<Campus> {
    const url = `${this.baseUrl}`;
    return this.http.post<Campus>(url, data);
  }

}
