import {environment} from '../../../../environments/environment';

export class AppCheck {
  static isInitialized = false;

  static async getToken(): Promise<string> {
    const {FirebaseAppCheck} = await import(
      /* webpackChunkName: "@capacitor-firebase/app-check" */ '@capacitor-firebase/app-check'
    );
    if (!AppCheck.isInitialized) {
      await FirebaseAppCheck.initialize({siteKey: environment.reCAPTCHAKey, debug: !environment.production});
    }
    const {token} = await FirebaseAppCheck.getToken({forceRefresh: false});
    return token;
  }
}
