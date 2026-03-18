import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';

declare const grecaptcha: {
  enterprise: {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, options: {action: string}) => Promise<string>;
  };
};

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private loaded = false;
  private loadPromise: Promise<void> | null = null;

  private get siteKey(): string {
    return environment.recaptchaSiteKey;
  }

  private load(): Promise<void> {
    if (this.loaded) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;

    if (!this.siteKey || !('document' in globalThis)) {
      this.loaded = true;
      return Promise.resolve();
    }

    this.loadPromise = new Promise<void>(resolve => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
      script.async = true;
      script.onload = () => {
        grecaptcha.enterprise.ready(() => {
          this.loaded = true;
          resolve();
        });
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  async getToken(action: string): Promise<string | null> {
    if (!this.siteKey) return null;

    await this.load();
    return grecaptcha.enterprise.execute(this.siteKey, {action});
  }
}
