const fs = require('fs');
const path = require('path');
const https = require('https');

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

const urls = new Set();
['home', 'about', 'leaders', 'locations', 'auth'].forEach(name => {
  const content = fs.readFileSync(`stitch_raw_${name}.html`, 'utf8');
  const imgs = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  imgs.forEach(u => urls.add(u));
});

const urlList = [...urls];
const urlMap = {};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log(`Downloading ${urlList.length} assets...`);
  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    const filename = `asset_${i + 1}.webp`;
    const localPath = path.join('assets', filename);
    try {
      await download(url, localPath);
      console.log(`Saved [${i + 1}/${urlList.length}] -> ${localPath}`);
      urlMap[url] = `assets/${filename}`;
    } catch (e) {
      console.error(`Failed ${url}:`, e.message);
    }
  }
  fs.writeFileSync('url_mapping.json', JSON.stringify(urlMap, null, 2));
  console.log('Mapping saved to url_mapping.json');
}

run();
