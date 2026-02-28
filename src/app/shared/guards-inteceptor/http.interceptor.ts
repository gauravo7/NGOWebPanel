import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { UserDataService } from '../service/userData/user-data.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from the service.
  const authToken = inject(UserDataService);
  if (authToken.isLogin() == true) {
    let token = authToken.getData().token ?? ""


    let tokenReq = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(tokenReq).pipe(tap(event => {
      if (event.type === HttpEventType.Response) {
      }
    }));
  } else {
    let tokenReq = req.clone({});
    return next(tokenReq)
  }
};
