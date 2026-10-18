const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple .env parser without external dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];

  // API endpoints
  if (cleanUrl === '/api/supabase-config') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store'
    });
    res.end(JSON.stringify({
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || ''
    }));
    return;
  }

  if (cleanUrl === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Ziproo Corporate Backend',
      timestamp: new Date().toISOString(),
      supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    }));
    return;
  }


  // Clean URL routing & aliases
  const ROUTE_ALIASES = {
    '/': '/index.html',
    '/home': '/index.html',
    '/branches': '/branches.html',
    '/updates': '/updates.html',
    '/leadership': '/leaders.html',
    '/leaders': '/leaders.html',
    '/connect': '/portal.html',
    '/portal': '/portal.html',
    '/projects': '/projects.html'
  };

  if (ROUTE_ALIASES[cleanUrl]) {
    cleanUrl = ROUTE_ALIASES[cleanUrl];
  } else if (!path.extname(cleanUrl)) {
    cleanUrl += '.html';
  }

  const filePath = path.join(__dirname, cleanUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>Requested resource does not exist.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Ziproo Corporate Web UI running at http://localhost:${PORT}`);
  if (process.env.SUPABASE_URL) {
    console.log(`Connected to Supabase URL: ${process.env.SUPABASE_URL}`);
  } else {
    console.log(`Supabase backend ready for configuration (via browser settings or .env)`);
  }
});
