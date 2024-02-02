import {CapacitorConfig} from '@capacitor/cli';
import {networkInterfaces} from 'os';
import {env} from './env';

const config: CapacitorConfig = {
  appId: 'mt.sign.translate',
  appName: 'sign',
  webDir: 'dist/sign-translate/browser',
  server: getServer(),
  plugins: {
    SplashScreen: {
      androidScaleType: 'CENTER_CROP',
      launchAutoHide: false,
    },
  },
  ios: {
    path: 'ios',
    webContentsDebuggingEnabled: true,
  },
  android: {
    path: 'android',
    useLegacyBridge: false,
  },
};

function getServer(): CapacitorConfig['server'] {
  if (!env.ENABLE_CAPACITOR_SERVER) {
    return undefined;
  }

  const ip = (() => {
    if (env.OVERRIDE_CAPACITOR_SERVER) {
      return env.OVERRIDE_CAPACITOR_SERVER;
    }

    const networks = networkInterfaces()['en0'] ?? networkInterfaces()['eth0'];
    return networks.find(ip => ip.family === 'IPv4')?.address;
  })();

  return {
    url: `http://${ip}:${env.CAPACITOR_SERVER_PORT}`,
    cleartext: true,
  };
}

export default config;
