import {Injectable} from '@angular/core';
import {getAnalytics, logEvent} from 'firebase/analytics';
import {getPerformance, trace} from 'firebase/performance';
import {onCLS, onINP, onLCP} from 'web-vitals';
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
    logEvent(getAnalytics(), 'screen_view', {firebase_screen: screenName, firebase_screen_class: screenName});
  }

  logPerformanceMetrics() {
    if (!this.isSupported) {
      return;
    }

    const sendToGoogleAnalytics = ({name, delta, value, id}) => {
      return logEvent(getAnalytics(), name, {
        value: delta,
        metric_id: id,
        metric_value: value,
        metric_delta: delta,
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
    const t = trace(getPerformance(), traceName);
    t.start();
    const stopTrace = () => {
      this.traces.push({name: traceName, time: performance.now() - startTime});
      t.stop();
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
