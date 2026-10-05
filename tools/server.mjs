import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.webp':'image/webp', '.jpg':'image/jpeg', '.JPG':'image/jpeg', '.mp4':'video/mp4', '.ttf':'font/ttf', '.woff2':'font/woff2', '.svg':'image/svg+xml' };
const pages = new Set(['index.html', 'editor.html', 'styles.css', 'editor.css', 'app.js', 'editor.js', 'content.js', 'favicon.svg']);
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep) || (!pages.has(relative) && !relative.startsWith('assets/'))) {
      res.writeHead(404).end('Not found'); return;
    }
    const info = await stat(file);
    if (!info.isFile()) { res.writeHead(404).end('Not found'); return; }
    const headers = {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
    if (req.headers.range && file.endsWith('.mp4')) {
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!range) { res.writeHead(416).end(); return; }
      const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : info.size-1,info.size-1);
      if (start > end || start >= info.size) { res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end(); return; }
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});
      createReadStream(file,{start,end}).pipe(res);
    } else { res.writeHead(200,{...headers,'Content-Length':info.size}); createReadStream(file).pipe(res); }
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Fiona preview: http://localhost:${port}`));
