import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, switchMap} from 'rxjs';
import {AppCheck} from '../../helpers/app-check/app-check';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      req.url.includes('/api/') ||
      req.url.includes('cloudfunctions.net') ||
      req.url.includes('sign-mt/us-central1')
    ) {
      const appCheckToken$ = from(AppCheck.getToken());

      return appCheckToken$.pipe(
        switchMap(token =>
          next.handle(
            req.clone({
              headers: req.headers
                .set('X-Firebase-AppCheck', token) // Python Cloud Functions
                .set('X-AppCheck-Token', token), // Node.js Cloud Functions
            })
          )
        )
      );
    }

    return next.handle(req);
  }
}
