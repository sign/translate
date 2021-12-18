import {Injectable} from '@angular/core';
import {GoogleAnalyticsService} from 'ngx-google-analytics';
import {getCLS, getFID, getLCP} from 'web-vitals';

declare var gtag;

function isPromise(promise) {
  return !!promise && typeof promise.then === 'function';
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsTimingService {
  constructor(private ga: GoogleAnalyticsService) {
    this.logPerformanceMetrics();
  }

  logPerformanceMetrics() {
    const sendToGoogleAnalytics = ({name, delta, value, id}) => {
      this.ga.gtag('event', name, {
        value: delta,
        metric_id: id,
        metric_value: value,
        metric_delta: delta,
      });
    };

    getCLS(sendToGoogleAnalytics);
    getFID(sendToGoogleAnalytics);
    getLCP(sendToGoogleAnalytics);
  }

  time<T>(timingCategory: string, timingVar: string, callable: () => T): T {
    const start = performance.now();
    const done = () => {
      const time = performance.now() - start;
      if (gtag) {
        this.ga.gtag('event', {
          hitType: 'timing',
          timingCategory,
          timingVar,
          timingValue: Math.round(time)
        });
      }
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
