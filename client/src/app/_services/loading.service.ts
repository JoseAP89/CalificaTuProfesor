// src/app/core/services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  
  // Use distinctUntilChanged to prevent rapid toggling
  isLoading$ = this.isLoadingSubject.asObservable().pipe(
    distinctUntilChanged()
  );

  show() {
    if (!this.isLoadingSubject.value) {
      this.isLoadingSubject.next(true);
    }
  }

  hide() {
    if (this.isLoadingSubject.value) {
      this.isLoadingSubject.next(false);
    }
  }
}