import {Injectable} from '@angular/core';
import {onCLS, onINP, onLCP} from 'web-vitals';

import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {FirebasePerformance} from '@capacitor-firebase/performance';
import {environment} from '../../../../environments/environment';

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

  get isSupported() {
    return environment.firebase.measurementId && 'window' in globalThis && 'document' in globalThis;
  }

  async setCurrentScreen(screenName: string) {
    if (!this.isSupported) {
      return;
    }
    await FirebaseAnalytics.setCurrentScreen({screenName});
  }

  logPerformanceMetrics() {
    if (!this.isSupported) {
      return;
    }

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

    onCLS(sendToGoogleAnalytics);
    onINP(sendToGoogleAnalytics);
    onLCP(sendToGoogleAnalytics);
  }

  async trace<T>(timingCategory: string, timingVar: string, callable: () => T): Promise<T> {
    if (!this.isSupported) {
      return callable();
    }

    const startTime = performance.now();
    const traceName = `${timingCategory}:${timingVar}`;
    await FirebasePerformance.startTrace({traceName});
    const stopTrace = () => {
      this.traces.push({name: traceName, time: performance.now() - startTime});
      FirebasePerformance.stopTrace({traceName}).catch().then();
    };

    let call = callable();
    if (isPromise(call)) {
      call = (call as any).then(async res => {
        stopTrace();
        return res;
      }) as any;
    } else {
      stopTrace();
    }

    return call;
  }
}
