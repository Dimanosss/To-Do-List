import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import bootstrap from './main.server';

/**
 * Server configuration for Angular SSR
 */
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = resolve(browserDistFolder, 'index.html');

const app = express();
const commonEngine = new CommonEngine();

// Serve static files from /browser
app.get(
  '*.*',
  express.static(browserDistFolder, {
    maxAge: '1y',
  })
);

// All regular routes use the Angular engine
app.get('*', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

const port = process.env['PORT'] || 4000;
const serverInstance = app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});

export default serverInstance;

