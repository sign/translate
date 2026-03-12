import {Injectable} from '@angular/core';
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
    this.initGtag();
    this.logPerformanceMetrics();
  }

  get isSupported() {
    return environment.measurementId && 'window' in globalThis && 'document' in globalThis;
  }

  private initGtag() {
    if (!this.isSupported) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.measurementId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function () {
      (window as any).dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', environment.measurementId);
  }

  async setCurrentScreen(screenName: string) {
    if (!this.isSupported) {
      return;
    }
    gtag('event', 'screen_view', {firebase_screen: screenName, firebase_screen_class: screenName});
  }

  logPerformanceMetrics() {
    if (!this.isSupported) {
      return;
    }

    const sendToGoogleAnalytics = ({name, delta, value, id}) => {
      gtag('event', name, {
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
    const stopTrace = () => {
      const duration = performance.now() - startTime;
      this.traces.push({name: traceName, time: duration});
      gtag('event', 'timing_complete', {
        name: traceName,
        value: Math.round(duration),
        event_category: timingCategory,
        event_label: timingVar,
      });
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
