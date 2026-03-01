/// <reference types="vitest" />
import { vi } from 'vitest';
import { ErrorInterceptor } from './error.interceptor';
import { LoggerService } from '../logging/logger.service';
import { ApiError } from '../errors/api-error.model';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

// simple “mocked” helper – you can also just use `any` if you prefer
type Mocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? ReturnType<typeof vi.fn> : T[K];
};

let loggerSpy: Mocked<LoggerService>;
let httpHandler: Mocked<HttpHandler>;

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;

  beforeEach(() => {
    loggerSpy = {
      error: vi.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [ErrorInterceptor, { provide: LoggerService, useValue: loggerSpy }],
    });
    interceptor = TestBed.inject(ErrorInterceptor);
    httpHandler = { handle: vi.fn() } as any;
  });

  it('should pass through successful responses', async () => {
    const req = new HttpRequest('GET', '/api/success');
    const body = { data: 'ok' };
    httpHandler.handle.mockReturnValue(of(body as unknown as HttpEvent<any>));

    return new Promise((resolve, reject) => {
      interceptor.intercept(req, httpHandler as any).subscribe({
        next: (ev) => {
          expect(ev).toBe(body as any);
          expect(loggerSpy.error).not.toHaveBeenCalled();
          resolve(undefined);
        },
        error: () => {
          reject(new Error('should not emit error'));
        },
      });
    });
  });

  it('should log and normalize API errors', async () => {
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      status: 404,
      error: { message: 'Not Found', errors: ['Resource missing'] },
      url: '/api/test',
      statusText: 'Not Found',
    });
    httpHandler.handle.mockReturnValue(throwError(() => errorResponse));

    return new Promise((resolve, reject) => {
      interceptor.intercept(req, httpHandler as any).subscribe({
        next: () => {},
        error: (err: ApiError) => {
          try {
            expect(err.statusCode).toBe(404);
            expect(err.message).toBe('Not Found');
            expect(err.errors).toEqual(['Resource missing']);
            expect(err.path).toBe('/api/test');
            expect(loggerSpy.error).toHaveBeenCalledWith(
              'HTTP Error Occurred',
              expect.objectContaining({ statusCode: 404 }),
            );
            resolve(undefined);
          } catch (e) {
            reject(e);
          }
        },
      });
    });
  });

  it('should handle unknown error shape', async () => {
    const req = new HttpRequest('GET', '/api/other');
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: null,
      url: '/api/other',
      statusText: 'Server Error',
    });
    httpHandler.handle.mockReturnValue(throwError(() => errorResponse));

    return new Promise((resolve, reject) => {
      interceptor.intercept(req, httpHandler as any).subscribe({
        next: () => {},
        error: (err: ApiError) => {
          try {
            expect(err.statusCode).toBe(500);
            expect(err.message).toBe('Server Error');
            expect(err.errors).toEqual([]);
            expect(err.path).toBe('/api/other');
            expect(loggerSpy.error).toHaveBeenCalledWith(
              'HTTP Error Occurred',
              expect.objectContaining({ statusCode: 500 }),
            );
            resolve(undefined);
          } catch (e) {
            reject(e);
          }
        },
      });
    });
  });

  it('should normalize message when error body is a string', async () => {
    const req = new HttpRequest('GET', '/api/string-error');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: 'bad things',
      url: '/api/string-error',
      statusText: 'Bad Request',
    });
    httpHandler.handle.mockReturnValue(throwError(() => errorResponse));

    return new Promise((resolve, reject) => {
      interceptor.intercept(req, httpHandler as any).subscribe({
        next: () => {},
        error: (err: ApiError) => {
          try {
            expect(err.statusCode).toBe(400);
            expect(err.message).toBe('Bad Request');
            expect(err.errors).toEqual([]);
            expect(err.path).toBe('/api/string-error');
            expect(loggerSpy.error).toHaveBeenCalledWith(
              'HTTP Error Occurred',
              expect.objectContaining({ statusCode: 400 }),
            );
            resolve(undefined);
          } catch (e) {
            reject(e);
          }
        },
      });
    });
  });

  it('should call next.handle with the original request', () => {
    const req = new HttpRequest('DELETE', '/api/foo');
    httpHandler.handle.mockReturnValue(of({} as HttpEvent<any>));
    interceptor.intercept(req, httpHandler as any);
    expect(httpHandler.handle).toHaveBeenCalledWith(req);
  });
});
