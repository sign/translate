import {environment} from '../../../../environments/environment';
import {initializeAppCheck, ReCaptchaV3Provider, getToken} from 'firebase/app-check';
import {getApp} from 'firebase/app';

let appCheck;

export class AppCheck {
  static async getToken(): Promise<string> {
    if (!appCheck) {
      if (!environment.production) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
      appCheck = initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider(environment.reCAPTCHAKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
    const {token} = await getToken(appCheck, false);
    return token;
  }
}
