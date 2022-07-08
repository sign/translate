import {devices, Page, webkit} from '@playwright/test';
import asyncPool from 'tiny-async-pool';
import * as fs from 'fs';
import {promisify} from 'util';

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
// TODO pt-BR works, pt-PT doesn't

async function asyncPoolAll(...args) {
  const results = [];
  for await (const result of asyncPool(...args)) {
    results.push(result);
  }
  return results;
}

async function makeAndroid(locale: string, page: Page, title: string, description: string) {
  const filePath = (locale, file) => `android/fastlane/metadata/android/${locale}/${file}`;
  const imgPath = (locale, {width, height}, name) =>
    filePath(locale, `images/phoneScreenshots/${name}_${width}x${height}.png`);

  for (const device of ['Pixel 5', 'Galaxy S9+']) {
    const viewport = devices[device].viewport;
    await page.setViewportSize(viewport);
    await page.screenshot({path: imgPath(locale, viewport, 'main')});
  }

  await Promise.all([
    promisify(fs.writeFile)(filePath(locale, 'title.txt'), title),
    promisify(fs.writeFile)(filePath(locale, 'short_description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'full_description.txt'), description),
    promisify(fs.writeFile)(filePath(locale, 'video.txt'), ''),
  ]);
}

async function makeIOS(locale: string, page: Page, title: string, description: string) {
  const dirs = [`ios/App/fastlane/metadata/${locale}`, `ios/App/fastlane/screenshots/${locale}`];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
  }
  const filePath = (locale, file, base = 'metadata') => `ios/App/fastlane/${base}/${locale}/${file}`;
  const imgPath = (locale, {width, height}, name) => filePath(locale, `${name}_${width}x${height}.png`, 'screenshots');

  for (const device of ['iPhone 13', 'iPhone 13 Pro Max', 'iPhone 13 Mini']) {
    const viewport = devices[device].viewport;
    await page.setViewportSize(viewport);
    await page.screenshot({path: imgPath(locale, viewport, 'main')});
  }

  await Promise.all([
    promisify(fs.writeFile)(filePath(locale, 'name.txt'), title),
    promisify(fs.writeFile)(filePath(locale, 'description.txt'), description),
    // TODO apple_tv_privacy_policy
    // TODO keywords
    // TODO marketing_url
    // TODO privacy_url
    // TODO promotional_text
    // TODO release_notes
    // TODO support_url
  ]);
}

async function main() {
  const browser = await webkit.launch({headless: false});

  const allLocales = Array.from(new Set(googlePlayLocales.concat(iOSLocales)));
  const contexts = allLocales.map(l => ({locale: l, ...devices['Pixel 5']}));
  const screenCapture = async contextOptions => {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    await page.route('https://**/*', route => route.abort()); // disallow external traffic
    await Promise.all([
      page.goto('http://localhost:4200/', {waitUntil: 'networkidle'}),
      page.waitForSelector('mat-tab-group', {state: 'attached'}), // Wait until language file is loaded
    ]);

    const title = await page.title();
    const description = await (await page.$('meta[name="description"]')).getAttribute('content');
    if (googlePlayLocales.includes(contextOptions.locale)) {
      await makeAndroid(contextOptions.locale, page, title, description);
    }
    if (iOSLocales.includes(contextOptions.locale)) {
      // TODO copyright.txt
      // TODO primary_category.txt
      // TODO primary_first_sub_category.txt
      // TODO primary_second_sub_category.txt
      // TODO secondary_category.txt
      // TODO secondary_first_sub_category.txt
      // TODO secondary_second_sub_category.txt
      await makeIOS(contextOptions.locale, page, title, description);
    }

    await page.close();
    await context.close();
  };

  const concurrency = 20;
  await asyncPoolAll(concurrency, contexts, screenCapture);

  // TODO: take screenshots in light and dark mode
  // TODO: generate a video, typing "What is your name"
  // TODO: generate a video, uploaded file to "What is your name" example, about page
  //
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
