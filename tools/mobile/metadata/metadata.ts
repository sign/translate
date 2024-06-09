import {chromium, devices, Page, webkit} from '@playwright/test';
import asyncPool from 'tiny-async-pool';
import * as fs from 'fs';
import {promisify} from 'util';
import {execSync} from 'child_process';
import {aboutScreenshotsWebp, frameScreenshots, screenshotFrameLocales} from './framefile';
import {googlePlayLocales} from './locales.android';
import {iOSLocales} from './locales.ios';
import {androidDevices, iosDevices} from './devices';

const assetsDir = `src/assets/promotional/about`;
mkdir(`${assetsDir}/iphone`);
mkdir(`${assetsDir}/android`);

async function asyncPoolAll(...args) {
  const results = [];
  for await (const result of asyncPool(...args)) {
    results.push(result);
  }
  return results;
}

async function screenshot(page: Page, viewport, path: string, background = 'white') {
  // Apply safe area insets
  let styles = '';
  for (const [key, value] of Object.entries(viewport.safeAreaInsets)) {
    styles += `--ion-safe-area-${key}: ${value}px;`;
  }
  const htmlEl = await page.$('html');
  await htmlEl.evaluate((el, styles) => el.setAttribute('style', styles), styles);

  await page.screenshot({path, fullPage: false});

  // Resize screenshot to required size (including zoom)
  const res = `${viewport.width}x${viewport.height}`;
  const cmd = `magick ${path} -resize ${res} -background ${background} -gravity center -extent ${res} ${path}`;
  console.log(execSync(cmd, {encoding: 'utf8'}).toString());
}

function mkdir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
}

async function makeAndroid(
  locale: string,
  device: string,
  page: Page,
  title: string,
  description: string,
  pageLang: string
) {
  const filePath = (locale, file) => `android/fastlane/metadata/android/${locale}/${file}`;
  const imgPath = (locale, {width, height}, name) =>
    filePath(locale, `images/phoneScreenshots/${name}_${width}x${height}.png`);

  const {deviceScaleFactor, screen} = devices[device] as any;
  const cViewport = {
    height: Math.floor(screen.height * deviceScaleFactor),
    width: Math.floor(screen.width * deviceScaleFactor),
    safeAreaInsets: {},
  };
  await screenshot(page, cViewport, imgPath(locale, cViewport, 'main'));

  // Copy main page for the about page
  if (device === 'Pixel 5') {
    fs.copyFileSync(imgPath(locale, cViewport, 'main'), `${assetsDir}/android/${pageLang}.png`);
  }

  mkdir(filePath(locale, 'changelogs'));
  const defaultChangelog = 'New release!';

  await Promise.all([
    screenshotFrameLocales(f => filePath(locale, f)),
    promisify(fs.writeFile)(filePath(locale, 'changelogs/default.txt'), defaultChangelog),
    promisify(fs.writeFile)(filePath(locale, 'title.txt'), title),
    promisify(fs.writeFile)(filePath(locale, 'short_description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'full_description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'video.txt'), ''),
  ]);
}

async function makeIOS(
  locale: string,
  device: string,
  page: Page,
  title: string,
  description: string,
  pageLang: string
) {
  const dirs = [`ios/App/fastlane/metadata/${locale}`, `ios/App/fastlane/screenshots/${locale}`];
  for (const dir of dirs) {
    mkdir(dir);
  }
  const filePath = (locale, file, base = 'metadata') => `ios/App/fastlane/${base}/${locale}/${file}`;
  const imgPath = (locale, {width, height}, name) => filePath(locale, `${name}_${width}x${height}.png`, 'screenshots');

  const {deviceScaleFactor, screen, safeAreaInsets} = devices[device] as any;
  const ionSafeAreaInsets = !safeAreaInsets
    ? {}
    : {
        top: safeAreaInsets.top,
        bottom: safeAreaInsets.bottom,
        left: safeAreaInsets.trailing,
        right: safeAreaInsets.leading,
      };
  const cViewport = {
    height: Math.floor(screen.height * deviceScaleFactor),
    width: Math.floor(screen.width * deviceScaleFactor),
    safeAreaInsets: ionSafeAreaInsets,
  };
  await screenshot(page, cViewport, imgPath(locale, cViewport, 'main'));
  // Copy main page for the about page
  if (device === 'iPhone 13 Pro') {
    fs.copyFileSync(imgPath(locale, cViewport, 'main'), `${assetsDir}/iphone/${pageLang}.png`);
  }

  await Promise.all([
    screenshotFrameLocales(f => filePath(locale, f, 'screenshots')),
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

async function iOSMetadata() {
  const IOS_META = 'ios/App/fastlane/metadata';
  await Promise.all([
    promisify(fs.writeFile)(`${IOS_META}/copyright.txt`, `${new Date().getFullYear()} sign.mt ltd`),
    promisify(fs.writeFile)(`${IOS_META}/primary_category.txt`, 'UTILITIES'),
    promisify(fs.writeFile)(`${IOS_META}/primary_first_sub_category.txt`, ''),
    promisify(fs.writeFile)(`${IOS_META}/primary_second_sub_category.txt`, ''),
    promisify(fs.writeFile)(`${IOS_META}/secondary_category.txt`, 'EDUCATION'),
    promisify(fs.writeFile)(`${IOS_META}/secondary_first_sub_category.txt`, ''),
    promisify(fs.writeFile)(`${IOS_META}/secondary_second_sub_category.txt`, ''),
  ]);
}

async function main() {
  const webkitBrowser = await webkit.launch({headless: false});
  const chromiumBrowser = await chromium.launch({headless: false});

  for (const device of androidDevices.concat(iosDevices)) {
    if (!(device in devices)) {
      console.log(devices);
      throw new Error(`Device ${device} is unknown`);
    }
    if (!('screen' in devices[device])) {
      console.log(devices[device]);
      throw new Error(`Device ${device} is missing screen values`);
    }
  }

  // One optimization can be to group these contexts by deviceScaleFactor
  const androidContexts = googlePlayLocales
    .map(locale => androidDevices.map(device => ({locale, device, makePlatform: makeAndroid})))
    .reduce((a, b) => a.concat(b), []);

  const iosContexts = iOSLocales
    .map(locale => iosDevices.map(device => ({locale, device, makePlatform: makeIOS})))
    .reduce((a, b) => a.concat(b), []);

  const screenCapture = async ({locale, device, makePlatform}) => {
    const options = {
      locale,
      ...devices[device],
    };
    options.viewport = (options as any).screen; // Now that we support safeAreaInsets, we can use the screen size
    const browser = options.defaultBrowserType === 'webkit' ? webkitBrowser : chromiumBrowser;
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.route('https://**/*', route => route.abort()); // disallow external traffic
    await Promise.all([
      page.goto('http://localhost:4200/', {waitUntil: 'networkidle'}),
      page.waitForSelector('mat-tab-group', {state: 'attached'}), // Wait until language file is loaded
    ] as Promise<any>[]);

    const title = await page.title();
    const description = await (await page.$('meta[name="description"]')).getAttribute('content');
    const pageLang = await (await page.$('html')).getAttribute('lang');
    await makePlatform(locale, device, page, title, description, pageLang);

    await page.close();
    await context.close();
  };

  const concurrency = 20;
  const allContexts = androidContexts.concat(iosContexts).sort(() => (Math.random() > 0.5 ? 1 : -1));
  await asyncPoolAll(concurrency, allContexts, screenCapture);
  await webkitBrowser.close();
  await chromiumBrowser.close();

  await iOSMetadata();

  // TODO: take screenshots in light and dark mode    // await page.emulateMedia({ colorScheme: 'dark' });
  // TODO: generate a video, typing "What is your name"
  // TODO: generate a video, uploaded file to "What is your name" example, about page
  //
  await frameScreenshots();

  await aboutScreenshotsWebp(`${assetsDir}/iphone`);
  await aboutScreenshotsWebp(`${assetsDir}/android`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
