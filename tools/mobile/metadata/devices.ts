// https://help.apple.com/app-store-connect/#/devd274dd925
import {devices} from '@playwright/test';

// export const iosDevices = ['iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 8 Plus', 'iPhone 8'];
export const iosDevices = ['iPhone 13 Pro'];
const iPhone8Plus = devices['iPhone 8 Plus'];
(iPhone8Plus as any).screen = {
  width: 414,
  height: 736,
};
(iPhone8Plus as any).deviceScaleFactor = 3;
(iPhone8Plus as any).safeAreaInsets = {
  top: 20,
  trailing: 0,
  bottom: 0,
  leading: 0,
};
// iPhone8
const iPhone8 = devices['iPhone 8'];
(iPhone8 as any).screen = {
  width: 375,
  height: 667,
};
(iPhone8 as any).deviceScaleFactor = 2;
(iPhone8 as any).safeAreaInsets = {
  top: 20,
  trailing: 0,
  bottom: 0,
  leading: 0,
};

(devices['iPhone 13 Pro'] as any).safeAreaInsets = (devices['iPhone 13 Pro Max'] as any).safeAreaInsets = {
  top: 59,
  bottom: 34,
  trailing: 0,
  leading: 0,
};

export const androidDevices = ['Pixel 5'];
