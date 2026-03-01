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

        let message = error.statusText || 'Unknown Error';
        let errors: string[] = [];

        // If backend returned something
        if (error.error) {

          // Case 1: Backend returned JSON object
          if (typeof error.error === 'object') {
            message = error.error.message ?? error.statusText;
            errors = error.error.errors ?? [];
          }

          // Case 2: Backend returned string body
          else if (typeof error.error === 'string') {
            message = error.statusText;
          }
        }

        const normalizedError: ApiError = {
          statusCode: error.status,
          message,
          errors,
          timestamp: new Date().toISOString(),
          path: req.url
        };

        this.logger.error('HTTP Error Occurred', normalizedError);

        return throwError(() => normalizedError);
      })
    );
  }
}