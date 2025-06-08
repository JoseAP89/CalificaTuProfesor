import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UseridService implements OnDestroy {

  private _name = "userId";
  private _userId : BehaviorSubject<string> ;

  constructor(
    private commonService: CommonService
  ) {
    this._userId = new BehaviorSubject<string>(null);
    this.setUserIdIfNotFound();
  }

  public setUserIdIfNotFound() {
    let userId = localStorage.getItem(this._name);
    if (!!userId) {
      this.setCurrentUserId(userId);
    } else { // it generates a new userId if there is none
      this.generateNewUserId();
    }

  }

  generateNewUserId() {
    if (!!window?.crypto?.randomUUID) {
      this.setCurrentUserId(crypto.randomUUID());
    } else {
      this.commonService.generateUserId().subscribe({
        next: res => {
          this.setCurrentUserId(res);
        }
      })
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

  public checkCurrentUserIdFromLocalStorage(): Observable<string>{
    let userId = localStorage.getItem(this._name);
    this._userId.next(userId);
    return this.currentUserId;
  }

}
