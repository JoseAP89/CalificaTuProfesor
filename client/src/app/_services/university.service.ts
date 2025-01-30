import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewUniversity, University, Vessel } from '../_models/business';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  private baseUrl = environment.API_URL + "/api/university";

  constructor(
    private http: HttpClient,
  ) { }

  public addUniversity(uni: University): Observable<NewUniversity>{
    const url = `${this.baseUrl}`;
    return this.http.post<NewUniversity>(url, uni);
  }

  public searchUniversity(target: string): Observable<Vessel[]>{
    target = target.replaceAll(/\s+/g,"+");
    const url = `${this.baseUrl}/search/${target}`;
    return this.http.get<Vessel[]>(url);
  }


}
