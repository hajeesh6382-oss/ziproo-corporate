const fs = require('fs');

['home', 'about', 'leaders', 'locations', 'auth'].forEach(name => {
  const file = `stitch_raw_${name}.html`;
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const imgs = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  const titles = [...content.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
  const scripts = [...content.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1].trim()).filter(s => !s.startsWith('tailwind.config'));

  console.log(`=== ${name} (${content.length} bytes) ===`);
  console.log('Headings:', titles);
  console.log('Images count:', imgs.length);
  console.log('Inline script snippets:', scripts.length > 0 ? scripts[0].slice(0, 150) + '...' : 'none');
});
