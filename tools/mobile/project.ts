import {MobileProject, MobileProjectConfig} from '@trapezedev/project';

export const config: MobileProjectConfig = {
  ios: {
    path: 'ios/App',
  },
  android: {
    path: 'android',
  },
};

export const project = new MobileProject('./', config);
