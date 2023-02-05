import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Scale } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  private baseUrl = environment.api_url + "/api/scale";
  constructor(
    private http: HttpClient,
  ) { }

  public getScales(): Observable<Scale[]> {
    const url = `${this.baseUrl}`;
    return this.http.get<Scale[]>(url);
  }

}
