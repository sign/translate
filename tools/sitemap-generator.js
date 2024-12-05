const {simpleSitemapAndIndex} = require('sitemap');
const path = require('path');
const fs = require('fs');

// Get list of supported languages
const baseDir = __dirname + `${path.sep}..${path.sep}`;
const langsDir = `${baseDir}src${path.sep}assets${path.sep}i18n`;
const languages = [];
for (const file of fs.readdirSync(langsDir)) {
  const [lang] = file.split('.');
  languages.push(lang);
}

const lastmod = new Date();
const baseUrls = [
  '/',
  // '/legal/terms/', '/legal/privacy/',
];

const additionalUrls = [
  '/about/', // TODO move to baseUrls once translated
  '/about/contribute/',
  '/legal/licenses/',
  '/legal/terms/',
  '/legal/privacy/',
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
  const buildDir = `${baseDir}dist/sign-translate/browser/`;

  // writes sitemaps and index out to the destination you provide.
  await simpleSitemapAndIndex({
    hostname: 'https://sign.mt',
    destinationDir: buildDir,
    sourceData,
    gzip: false,
  });

  // Now we add the docs sitemap to the sitemap index
  const sitemapIndex = `${buildDir}sitemap-index.xml`;
  // Read the sitemap index, parse the xml, under sitemapindex add a new sitemap to https://sign.mt/docs/sitemap.xml
  const sitemapIndexContent = String(fs.readFileSync(sitemapIndex, 'utf8'));
  const tagIndex = sitemapIndexContent.indexOf('</sitemapindex>');
  const preText = sitemapIndexContent.slice(0, tagIndex);
  const postText = sitemapIndexContent.slice(tagIndex);

  // Combine and write new sitemap index
  const newSitemap = `${preText}<sitemap><loc>https://sign.mt/docs/sitemap.xml</loc></sitemap>${postText}`;
  fs.writeFileSync(sitemapIndex, newSitemap, 'utf8');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
