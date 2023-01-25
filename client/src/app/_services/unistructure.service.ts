import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UniStructure, Vessel } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class UnistructureService {

  private baseUrl = environment.api_url + "/api/unistructure";

  constructor(
    private http: HttpClient,
  ) { }

  public getUniStructure(uniStructureId: number): Observable<Vessel>{
    const url = `${this.baseUrl}/${uniStructureId}`;
    return this.http.get<Vessel>(url);
  }

  public getUniStructures(): Observable<Vessel[]>{
    const url = `${this.baseUrl}`;
    return this.http.get<Vessel[]>(url);
  }

}
