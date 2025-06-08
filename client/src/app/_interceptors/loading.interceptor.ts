// src/app/core/interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, timer, empty } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
import { LoadingService } from '../_services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private readonly delayMs = 500; // if loading takes less than delayMs then loading icon will not appear

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequests++;

    // Create a timer that will show loading after delay
    const showLoader$ = timer(this.delayMs).pipe(
      mergeMap(() => {
        if (this.totalRequests > 0) {
          this.loadingService.show();
        }
        return empty(); // Return empty observable to complete
      })
    );

    // Execute the request and handle finalization
    const request$ = next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.hide();
        }
      })
    );

    // Race between the request and the loader timer
    return new Observable<HttpEvent<unknown>>(subscriber => {
      let completed = false;
      let hasLoaderShown = false;

      // Subscribe to the request
      const requestSub = request$.subscribe({
        next: (value) => {
          completed = true;
          subscriber.next(value);
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });

      // Subscribe to the timer
      const timerSub = showLoader$.subscribe({
        complete: () => {
          if (!completed) {
            hasLoaderShown = true;
          }
        }
      });

      return () => {
        requestSub.unsubscribe();
        timerSub.unsubscribe();
        if (hasLoaderShown && this.totalRequests === 0) {
          this.loadingService.hide();
        }
      };
    });
  }
}