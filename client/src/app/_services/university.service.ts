import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewUniversity, University } from '../_models/business';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  private baseUrl = environment.api_url + "/api/university";

  constructor(
    private http: HttpClient,
  ) { }

  public AddUniversity(uni: University): Observable<NewUniversity>{
    const url = `${this.baseUrl}`;
    return this.http.post<NewUniversity>(url, uni);
  }

}
