// https://help.apple.com/app-store-connect/#/devd274dd925
import {devices} from '@playwright/test';

export const iosDevices = ['iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 8 Plus', 'iPhone 8'];
// export const iosDevices = ['iPhone 13 Pro'];
const iPhone8Plus = devices['iPhone 8 Plus'];
(iPhone8Plus as any).screen = {
  width: 1242 / iPhone8Plus.deviceScaleFactor,
  height: 2208 / iPhone8Plus.deviceScaleFactor,
};
const iPhone8 = devices['iPhone 8'];
(iPhone8 as any).screen = {
  width: 750 / iPhone8.deviceScaleFactor,
  height: 1334 / iPhone8.deviceScaleFactor,
};

export const androidDevices = ['Pixel 5'];
