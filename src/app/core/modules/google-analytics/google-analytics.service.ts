import {Injectable} from '@angular/core';
import {GoogleAnalyticsService} from 'ngx-google-analytics';

declare var gtag;

function isPromise(promise) {
  return !!promise && typeof promise.then === 'function';
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsTimingService {

  constructor(private ga: GoogleAnalyticsService) {
  }

  time<T>(timingCategory: string, timingVar: string, callable: () => T): T {
    const start = performance.now();
    const done = () => {
      const time = performance.now() - start;
      if (gtag) {
        this.ga.gtag('send', {
          hitType: 'timing',
          timingCategory,
          timingVar,
          timingValue: Math.round(time)
        });
      }
      console.log(timingCategory, timingVar, time);
    };

    let call = callable();
    if (isPromise(call)) {
      call = (call as any).then(res => {
        done();
        return res;
      }) as any;
    } else {
      done();
    }

    return call;
  }

}
