import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewNotificationDTO, NotificationDTO, NotificationTypeDTO } from '../_models/business';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = environment.API_URL_DOT_NET + "/api/notification";

  constructor(
    private http: HttpClient,
  ) { }

  public getNotificationTypes(): Observable<NotificationTypeDTO[]> {
    const url = `${this.baseUrl}/type`;
    return this.http.get<NotificationTypeDTO[]>(url);
  }

  public getNotificationByUserRecordId(userRecordId: string): Observable<NotificationDTO> {
    const url = `${this.baseUrl}`;
    let params = new HttpParams()
      .set("userRecordId", userRecordId);
    return this.http.get<NotificationDTO>(url, {params});
  }

  public postNotification(body: NewNotificationDTO): Observable<NotificationDTO> {
    const url = `${this.baseUrl}`;
    return this.http.post<NotificationDTO>(url, body);
  }

}
