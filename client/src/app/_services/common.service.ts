import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private baseUrl = environment.api_url + "/api/Common";

  constructor(
    private http: HttpClient,
  ) {
  }

  public generateUserId(): Observable<string> {
    const url = `${this.baseUrl}/GenerateUserId`;
    return this.http.get<string>(url);
  }
}
