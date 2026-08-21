import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { createAppError } from '../errors/app-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const appError = createAppError(error.status);
        return throwError(() => appError);
      }
      return throwError(() => createAppError(undefined));
    })
  );
};
