import {chromium, devices, Page, webkit} from '@playwright/test';
import asyncPool from 'tiny-async-pool';
import * as fs from 'fs';
import {promisify} from 'util';
import {execSync} from 'child_process';

// https://support.google.com/googleplay/android-developer/answer/9844778?hl=en#zippy=%2Cview-list-of-available-languages
const googlePlayLocales = [
  'af',
  'am',
  'ar',
  'hy-AM',
  'az-AZ',
  'eu-ES',
  'be',
  'bn-BD',
  'bg',
  'my-MM',
  'ca',
  'zh-HK',
  'zh-CN',
  'zh-TW',
  'hr',
  'cs-CZ',
  'da-DK',
  'nl-NL',
  'en-AU',
  'en-CA',
  'en-IN',
  'en-SG',
  'en-GB',
  'en-US',
  'et',
  'fil',
  'fi-FI',
  'fr-FR',
  'fr-CA',
  'gl-ES',
  'ka-GE',
  'de-DE',
  'el-GR',
  'iw-IL',
  'hi-IN',
  'hu-HU',
  'is-IS',
  'id',
  'it-IT',
  'ja-JP',
  'kn-IN',
  'km-KH',
  'ko-KR',
  'ky-KG',
  'lo-LA',
  'lv',
  'lt',
  'mk-MK',
  'ms',
  'ml-IN',
  'mr-IN',
  'mn-MN',
  'ne-NP',
  'no-NO',
  'fa',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'ro',
  'rm',
  'ru-RU',
  'sr',
  'si-LK',
  'sk',
  'sl',
  'es-419',
  'es-ES',
  'es-US',
  'sw',
  'sv-SE',
  'ta-IN',
  'te-IN',
  'th',
  'tr-TR',
  'uk',
  'vi',
  'zu',
];

// https://docs.fastlane.tools/actions/deliver/#available-language-codes
const iOSLocales = [
  'ar-SA',
  'ca',
  'cs',
  'da',
  'de-DE',
  'el',
  'en-AU',
  'en-CA',
  'en-GB',
  'en-US',
  'es-ES',
  'es-MX',
  'fi',
  'fr-CA',
  'fr-FR',
  'he',
  'hi',
  'hr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'nl-NL',
  'no',
  'pl',
  'pt-BR',
  'pt-PT',
  'ro',
  'ru',
  'sk',
  'sv',
  'th',
  'tr',
  'uk',
  'vi',
  'zh-Hans',
  'zh-Hant',
];

// https://help.apple.com/app-store-connect/#/devd274dd925
const iosDevices = ['iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 8 Plus', 'iPhone 8'];
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

const androidDevices = ['Pixel 5'];

async function asyncPoolAll(...args) {
  const results = [];
  for await (const result of asyncPool(...args)) {
    results.push(result);
  }
  return results;
}

async function screenshot(page: Page, viewport, path: string, background = 'white') {
  await page.screenshot({path, fullPage: false});
  const res = `${viewport.width}x${viewport.height}`;
  const cmd = `convert ${path} -resize ${res} -background ${background} -gravity center -extent ${res} ${path}`;
  console.log(execSync(cmd, {encoding: 'utf8'}).toString());
}

async function makeAndroid(locale: string, device: string, page: Page, title: string, description: string) {
  const filePath = (locale, file) => `android/fastlane/metadata/android/${locale}/${file}`;
  const imgPath = (locale, {width, height}, name) =>
    filePath(locale, `images/phoneScreenshots/${name}_${width}x${height}.png`);

  const {deviceScaleFactor, screen} = devices[device] as any;
  const cViewport = {
    height: Math.floor(screen.height * deviceScaleFactor),
    width: Math.floor(screen.width * deviceScaleFactor),
  };
  await screenshot(page, cViewport, imgPath(locale, cViewport, 'main'));

  await Promise.all([
    promisify(fs.writeFile)(filePath(locale, 'title.txt'), title),
    promisify(fs.writeFile)(filePath(locale, 'short_description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'full_description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'video.txt'), ''),
  ]);
}

async function makeIOS(locale: string, device: string, page: Page, title: string, description: string) {
  const dirs = [`ios/App/fastlane/metadata/${locale}`, `ios/App/fastlane/screenshots/${locale}`];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
  }
  const filePath = (locale, file, base = 'metadata') => `ios/App/fastlane/${base}/${locale}/${file}`;
  const imgPath = (locale, {width, height}, name) => filePath(locale, `${name}_${width}x${height}.png`, 'screenshots');

  const {deviceScaleFactor, screen} = devices[device] as any;
  const cViewport = {
    height: Math.floor(screen.height * deviceScaleFactor),
    width: Math.floor(screen.width * deviceScaleFactor),
  };
  await screenshot(page, cViewport, imgPath(locale, cViewport, 'main'));

  await Promise.all([
    promisify(fs.writeFile)(filePath(locale, 'name.txt'), title),
    promisify(fs.writeFile)(filePath(locale, 'description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'apple_tv_privacy_policy.txt'), ''),
    promisify(fs.writeFile)(filePath(locale, 'privacy_url.txt'), `https://sign.mt/legal/privacy?lang=${locale}`),
    promisify(fs.writeFile)(filePath(locale, 'marketing_url.txt'), `https://sign.mt/about?lang=${locale}`),
    promisify(fs.writeFile)(filePath(locale, 'support_url.txt'), `https://github.com/sign/translate/issues`),
    // TODO keywords
    // TODO promotional_text
    // TODO release_notes
  ]);
}

async function main() {
  const webkitBrowser = await webkit.launch({headless: false});
  const chromiumBrowser = await chromium.launch({headless: false});

  for (const device of androidDevices.concat(iosDevices)) {
    if (!('screen' in devices[device])) {
      throw new Error(`Device ${device} is missing screen values`);
    }
  }

  // One optimization can be to group these contexts by deviceScaleFactor
  const androidContexts = googlePlayLocales
    .map(locale => androidDevices.map(device => ({locale, device, platform: 'android'})))
    .reduce((a, b) => a.concat(b), []);

  const iosContexts = iOSLocales
    .map(locale => iosDevices.map(device => ({locale, device, platform: 'ios'})))
    .reduce((a, b) => a.concat(b), []);

  const screenCapture = async ({locale, device, platform}) => {
    const options = {
      locale,
      ...devices[device],
    };
    const browser = options.defaultBrowserType === 'webkit' ? webkitBrowser : chromiumBrowser;
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.route('https://**/*', route => route.abort()); // disallow external traffic
    await Promise.all([
      page.goto('http://localhost:4200/', {waitUntil: 'networkidle'}),
      page.waitForSelector('mat-tab-group', {state: 'attached'}), // Wait until language file is loaded
    ]);

    const title = await page.title();
    const description = await (await page.$('meta[name="description"]')).getAttribute('content');
    if (platform === 'android') {
      await makeAndroid(locale, device, page, title, description);
    }
    if (platform === 'ios') {
      await makeIOS(locale, device, page, title, description);
    }

    await page.close();
    await context.close();
  };

  const concurrency = 20;
  const allContexts = androidContexts.concat(iosContexts).sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
  await asyncPoolAll(concurrency, allContexts, screenCapture);

  const IOS_META = 'ios/App/fastlane/metadata';
  await Promise.all([
    promisify(fs.writeFile)(`${IOS_META}/copyright.txt`, 'https://sign.mt/legal/licenses'),
    promisify(fs.writeFile)(`${IOS_META}/primary_category.txt`, 'UTILITIES'),
    promisify(fs.writeFile)(`${IOS_META}/primary_first_sub_category.txt`, ''),
    promisify(fs.writeFile)(`${IOS_META}/primary_second_sub_category.txt`, ''),
    promisify(fs.writeFile)(`${IOS_META}/secondary_category.txt`, 'EDUCATION'),
    promisify(fs.writeFile)(`${IOS_META}/secondary_first_sub_category.txt`, ''),
    promisify(fs.writeFile)(`${IOS_META}/secondary_second_sub_category.txt`, ''),
  ]);

  // TODO: take screenshots in light and dark mode    // await page.emulateMedia({ colorScheme: 'dark' });
  // TODO: generate a video, typing "What is your name"
  // TODO: generate a video, uploaded file to "What is your name" example, about page
  //

  console.log(execSync('fastlane frameit_screenshots', {cwd: 'android', encoding: 'utf8'}).toString());
  console.log(execSync('fastlane frameit_screenshots', {cwd: 'ios/App', encoding: 'utf8'}).toString());
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
