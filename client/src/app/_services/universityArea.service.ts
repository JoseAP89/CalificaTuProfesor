import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UniversityArea, Vessel } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class UniversityAreaService {

  private baseUrl = environment.API_URL_DOT_NET + "/api/universityarea";

  constructor(
    private http: HttpClient,
  ) { }

  public getUniversityArea(universityAreaId: number): Observable<Vessel>{
    const url = `${this.baseUrl}/${universityAreaId}`;
    return this.http.get<Vessel>(url);
  }

  public getAllUniversityAreas(): Observable<UniversityArea[]>{
    const url = `${this.baseUrl}`;
    return this.http.get<UniversityArea[]>(url);
  }

}
