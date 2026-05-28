const {simpleSitemapAndIndex} = require('sitemap');
const path = require('path');
const fs = require('fs');
const {basePath, canonicalOrigin} = require('../base-path.json');

// Get list of supported languages
const baseDir = path.resolve(__dirname, '..');
const langsDir = `${baseDir}${path.sep}src${path.sep}assets${path.sep}i18n`;
const languages = [];
for (const file of fs.readdirSync(langsDir)) {
  const [lang] = file.split('.');
  languages.push(lang);
}

const withBase = relPath => basePath + relPath.replace(/^\/+/, '');

const lastmod = new Date();
const baseUrls = [
  withBase('/'),
  // withBase('/legal/terms/'), withBase('/legal/privacy/'),
];

const additionalUrls = [
  withBase('/about/'), // TODO move to baseUrls once translated
  withBase('/about/contribute/'),
  withBase('/legal/licenses/'),
  withBase('/legal/terms/'),
  withBase('/legal/privacy/'),
];

const sourceData = [];

for (const url of baseUrls) {
  sourceData.push({
    url,
    lastmod,
    links: languages.map(lang => ({lang, url: `${url}?lang=${lang}`})),
  });
}

for (const url of additionalUrls) {
  sourceData.push({url, lastmod});
}

async function main() {
  const buildDir = `${baseDir}${path.sep}dist${path.sep}sign-translate${path.sep}browser${path.sep}`;

  // writes sitemaps and index out to the destination you provide.
  await simpleSitemapAndIndex({
    hostname: canonicalOrigin,
    publicBasePath: basePath,
    destinationDir: buildDir,
    sourceData,
    gzip: false,
  });

  // Append the docs sitemap to the sitemap index.
  const sitemapIndex = `${buildDir}sitemap-index.xml`;
  const sitemapIndexContent = String(fs.readFileSync(sitemapIndex, 'utf8'));
  const tagIndex = sitemapIndexContent.indexOf('</sitemapindex>');
  const preText = sitemapIndexContent.slice(0, tagIndex);
  const postText = sitemapIndexContent.slice(tagIndex);
  const docsSitemap = `${canonicalOrigin}${withBase('/docs/sitemap.xml')}`;

  const newSitemap = `${preText}<sitemap><loc>${docsSitemap}</loc></sitemap>${postText}`;
  fs.writeFileSync(sitemapIndex, newSitemap, 'utf8');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
