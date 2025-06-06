import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UseridService implements OnDestroy {

  private _name = "userId";
  private _userId : BehaviorSubject<string> ;

  constructor(
  ) {
    this._userId = new BehaviorSubject<string>(null);
    let userId = localStorage.getItem(this._name);
    if (!!userId) {
      this.setCurrentUserId(userId);
    } else { // it generates a new userId if there is none
      this.setCurrentUserId(crypto.randomUUID());
    }
  }

  ngOnDestroy(): void {
    this._userId.unsubscribe();
  }

  // TOKEN SERVICES

  public get currentUserId(): Observable<string> {
    return this._userId.asObservable();
  }

  public exist(): boolean{
    let userId = localStorage.getItem(this._name);
    return userId && userId === this._userId.value;
  }

  public setCurrentUserId(value: string){
    localStorage.setItem(this._name, value);
    this._userId.next(value);
  }

  public checkSetAndGetCurrentUserID(): Observable<string>{
    let userId = localStorage.getItem(this._name);
    this._userId.next(userId);
    return this.currentUserId;
  }

}
