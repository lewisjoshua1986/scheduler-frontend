import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../logging/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private logger: LoggerService) {}

  handleError(error: any): void {
    this.logger.error('Uncaught Application Error', error);
  }
}