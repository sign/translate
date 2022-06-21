import {Injectable} from '@angular/core';
import {getCLS, getFID, getLCP} from 'web-vitals';
import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {FirebasePerformance} from '@capacitor-firebase/performance';
import {SetCurrentScreenOptions} from '@capacitor-firebase/analytics/dist/esm/definitions';

function isPromise(promise) {
  return !!promise && typeof promise.then === 'function';
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  traces: {name: string; time: number}[] = [];

  constructor() {
    this.logPerformanceMetrics();
  }

  setCurrentScreen(screenName: string) {
    return FirebaseAnalytics.setCurrentScreen({screenName});
  }

  logPerformanceMetrics() {
    const sendToGoogleAnalytics = ({name, delta, value, id}) => {
      return FirebaseAnalytics.logEvent({
        name,
        params: {
          value: delta,
          metric_id: id,
          metric_value: value,
          metric_delta: delta,
        },
      });
    };

    getCLS(sendToGoogleAnalytics);
    getFID(sendToGoogleAnalytics);
    getLCP(sendToGoogleAnalytics);
  }

  async trace<T>(timingCategory: string, timingVar: string, callable: () => T): Promise<T> {
    const startTime = performance.now();
    const traceName = `${timingCategory}:${timingVar}`;
    await FirebasePerformance.startTrace({traceName});
    const stopTrace = () => {
      this.traces.push({name: traceName, time: performance.now() - startTime});
      return FirebasePerformance.stopTrace({traceName});
    };

    let call = callable();
    if (isPromise(call)) {
      call = (call as any).then(async res => {
        await stopTrace();
        return res;
      }) as any;
    } else {
      await stopTrace();
    }

    return call;
  }
}
