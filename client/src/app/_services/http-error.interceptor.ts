import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { getHttpErrorMessage } from '../_helpers/miscelaneous';
import { SnackbarService } from './snackbar.service';

export interface ApiError {
  message?: string;
  status?: string;
  url?: string;
  method?: string;
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private snackBarService: SnackbarService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const method = req.method;

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, method);
        return throwError(() => error); // propagate error further
      })
    );
  }

  private handleError(error: HttpErrorResponse, method: string): void {
    let apiError: ApiError = {
      status : error?.status?.toString(),
      message : getHttpErrorMessage(error),
      method,
      url: error?.url ?? undefined
    };
    // differentiate based on method
    switch (method) {
      case 'POST':
      case 'PATCH':
      case 'DELETE':
        this.snackBarService.showErrorMessage(apiError.message, 12_000);
        break;
    }

    // You can also dispatch to a global error service or UI feedback here
  }
}
