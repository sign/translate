import {devices, webkit} from '@playwright/test';
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

async function asyncPoolAll(...args) {
  const results = [];
  for await (const result of asyncPool(...args)) {
    results.push(result);
  }
  return results;
}

async function main() {
  const browser = await webkit.launch({headless: false});

  const filePath = (locale, file) => `android/fastlane/metadata/android/${locale}/${file}`;
  const imgPath = (locale, name) => filePath(locale, `images/phoneScreenshots/${name}.png`);

  const contexts = googlePlayLocales.map(l => ({locale: l, ...devices['Pixel 5']}));
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
      await page.screenshot({path: imgPath(contextOptions.locale, 'main')});

      await Promise.all([
        promisify(fs.writeFile)(filePath(contextOptions.locale, 'title.txt'), title),
        promisify(fs.writeFile)(filePath(contextOptions.locale, 'short_description.txt'), description),
        promisify(fs.writeFile)(filePath(contextOptions.locale, 'full_description.txt'), description),
        promisify(fs.writeFile)(filePath(contextOptions.locale, 'video.txt'), ''),
      ]);
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
