import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../logging/logger.service';
import { ApiError } from '../errors/api-error.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private logger: LoggerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        const normalizedError: ApiError = {
          statusCode: error.status,
          message: error.error?.message || error.message || 'Unknown error',
          errors: error.error?.errors || [],
          timestamp: new Date().toISOString(),
          path: req.url
        };

        this.logger.error('HTTP Error Occurred', normalizedError);

        return throwError(() => normalizedError);
      })
    );
  }
}