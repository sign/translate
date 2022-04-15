import * as express from 'express';
import * as functions from 'firebase-functions';
import {errorMiddleware} from '../middlewares/error.middleware';


const app = express();

app.get('/opensearch.xml', async (req, res) => {
  // TODO support language selection - opensearch.xml?lang=he

  const body = `
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Sign Translate</ShortName>
  <Description>Get translations from Sign Translate.</Description>
  <Url type="text/html" method="get" template="https://sign.mt/?text={searchTerms}"/>
  <Image width="32" height="32" alt="">https://sign.mt/assets/icons/favicon.svg</Image>
</OpenSearchDescription>`;

  res.set('Content-Type', 'text/xml');
  res.set('Cache-Control', 'public, max-age=86400'); // one day
  res.send(body);
});

app.get('/robots.txt', async (req, res) => {
  // TODO make the URL dynamically?
  functions.logger.log({
    url: req.url,
    baseUrl: req.baseUrl
  });

  const body = `
User-agent: *
Allow: /

Sitemap: https://sign.mt/sitemap-index.xml
`;

  res.set('Content-Type', 'text/plain');
  res.set('Cache-Control', 'public, max-age=86400'); // one day
  res.send(body);
});


app.use(errorMiddleware);

export const prerenderFunctions = functions.https.onRequest(app);
