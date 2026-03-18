import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {from, switchMap} from 'rxjs';
import {RecaptchaService} from '../services/recaptcha/recaptcha.service';
import {environment} from '../../../environments/environment';

export const recaptchaInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.recaptchaSiteKey || !req.url.includes(`.${environment.apiDomain}`)) {
    return next(req);
  }

  const recaptcha = inject(RecaptchaService);

  return from(recaptcha.getToken('api_request')).pipe(
    switchMap(token => {
      if (!token) return next(req);

      const cloned = req.clone({
        setHeaders: {'X-Recaptcha-Token': token},
      });
      return next(cloned);
    })
  );
};
