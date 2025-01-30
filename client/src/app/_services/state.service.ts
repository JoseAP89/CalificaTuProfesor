import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vessel } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private baseUrl = environment.API_URL + "/api/state";

  constructor(
    private http: HttpClient,
  ) {}

  public getStates(): Observable<Array<Vessel>>{
    const url = `${this.baseUrl}`;
    return this.http.get<Array<Vessel>>(url);
  }

}
