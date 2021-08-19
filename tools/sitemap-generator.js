const {simpleSitemapAndIndex} = require('sitemap')
const path = require("path")
const fs = require("fs")

const now = new Date();
const urls = ['/'];

// Add language urls
const langsDir = __dirname + `${path.sep}..${path.sep}src${path.sep}assets${path.sep}i18n`;
for (const file of fs.readdirSync(langsDir)) {
  const [lang] = file.split('.');
  urls.push(`/?lang=${lang}`)
}

// writes sitemaps and index out to the destination you provide.
simpleSitemapAndIndex({
  hostname: 'https://sign.mt',
  destinationDir: '../dist/sign-language-playground/',
  sourceData: urls.map(url => ({url, lastmod: now})),
  gzip: false
}).then(() => process.exit(0)).catch(() => process.exit(1));
