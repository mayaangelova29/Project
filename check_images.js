import fs from 'fs';

async function checkImages() {
  const fileContent = fs.readFileSync('./src/data/venues.ts', 'utf-8');
  const venues = [...fileContent.matchAll(/name:\s*"([^"]+)"[\s\S]*?imageUrl:\s*"([^"]+)"/g)].map(m => ({name: m[1], url: m[2]}));
  
  console.log(`Checking ${venues.length} images...`);
  
  for (const v of venues) {
    if (!v.url || v.url === 'null') {
      console.log(`[MISSING] ${v.name}`);
      continue;
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(v.url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        console.log(`[BROKEN] ${v.name}: ${res.status} ${res.statusText}`);
      } else {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
           console.log(`[NOT IMAGE] ${v.name}: ${contentType}`);
        } else {
           console.log(`[OK] ${v.name}`);
        }
      }
    } catch(e) {
      console.log(`[ERROR] ${v.name}: ${e.message}`);
    }
  }
}

checkImages();
