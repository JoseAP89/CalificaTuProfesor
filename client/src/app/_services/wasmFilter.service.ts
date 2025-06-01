import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResponseAxum {
    message: string,
    is_inappropiate?: boolean,
}

export interface FilterRequest {
    words: Array<string>,
}

@Injectable({ providedIn: 'root' })
export class WasmFilterService {
  private baseUrl = environment.API_URL_AXUM + "/api/filter";

  constructor(
    private http: HttpClient,
  ) {}

  public analyze_words(data: FilterRequest): Observable<ApiResponseAxum>{
    const url = `${this.baseUrl}`;
    return this.http.post<ApiResponseAxum>(url, data);
  }

}