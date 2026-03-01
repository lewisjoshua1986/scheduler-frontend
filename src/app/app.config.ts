import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { TaskApiMock } from './core/api/implementations/task-api.mock';
import { TASK_API } from './core/api/api.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { 
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler 
    },
    provideRouter(routes),
    { 
      provide: TASK_API, 
      useClass: TaskApiMock 
    }
  ]
};
