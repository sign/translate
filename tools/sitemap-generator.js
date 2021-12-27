const {simpleSitemapAndIndex} = require('sitemap')
const path = require("path")
const fs = require("fs")

const now = new Date();
const baseUrls = [
  '/',
  '/about', '/about/languages', '/about/contribute', '/about/tools',
  // '/legal/terms', '/legal/privacy', '/legal/licenses'
]

const baseDir = __dirname + `${path.sep}..${path.sep}`;

const urls = [];

// Add language urls
const langsDir = `${baseDir}src${path.sep}assets${path.sep}i18n`;
for (const file of fs.readdirSync(langsDir)) {
  const [lang] = file.split('.');
  for (const url of baseUrls) {
    urls.push(url + `?lang=${lang}`)
  }
}

// writes sitemaps and index out to the destination you provide.
simpleSitemapAndIndex({
  hostname: 'https://sign.mt',
  destinationDir: `${baseDir}dist/sign-translate/`,
  sourceData: urls.map(url => ({url, lastmod: now})),
  gzip: false
}).then(() => process.exit(0)).catch(() => process.exit(1));
