import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const venuesDbPath = path.resolve(__dirname, '../src/data/venues.ts');
let venuesContent = fs.readFileSync(venuesDbPath, 'utf8');

const regex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
const venues = [];
while ((match = regex.exec(venuesContent)) !== null) {
  venues.push({ id: match[1], name: match[2] });
}

console.log(`Found ${venues.length} venues to process.`);

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download, status: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

(async () => {
  for (const venue of venues) {
    try {
      console.log(`Fetching photo for ${venue.name}...`);
      const query = encodeURIComponent(`${venue.name} Sofia interior gym exterior fb`);
      // Use Safari user agent
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15'
      };
      
      const response = await fetch(`https://www.google.com/search?tbm=isch&q=${query}`, { headers });
      const text = await response.text();

      // Look for Google Image encrypted thumbnail URLs embedded inside raw HTML.
      // E.g. https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc...
      const imgRegex = /"(https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[^"]+)"/g;
      const matches = [...text.matchAll(imgRegex)];
      
      // Filter unique urls
      const uniqueUrls = [...new Set(matches.map(m => m[1]))];

      if (uniqueUrls.length === 0) {
        console.log(`No image found for ${venue.name}`);
        continue;
      }

      const safeName = venue.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${venue.id}_real_${safeName}.jpg`;
      const filePath = path.resolve(__dirname, '../public/images', fileName);

      let downloaded = false;
      for (let i = 0; i < Math.min(5, uniqueUrls.length); i++) {
        try {
          const imgUrl = uniqueUrls[i].replace(/\\u0026/g, '&'); // Fix hex encoding in html strings
          await downloadImage(imgUrl, filePath);
          downloaded = true;
          break;
        } catch (e) {
           console.log(`Failed img ${i}, trying next...`);
        }
      }

      if (!downloaded) {
        console.log(`Could not download any image for ${venue.name}`);
        continue;
      }
      
      console.log(`Saved ${fileName}`);
      
      // Update venues.ts mapping directly
      const blockRegex = new RegExp(`(id:\\s*"${venue.id}"[\\s\\S]*?imageUrl:\\s*)"([^"]+)"`);
      venuesContent = venuesContent.replace(blockRegex, `$1"/images/${fileName}"`);
      
      // Keep rate limit low
      await new Promise(r => setTimeout(r, 600));
      
    } catch (e) {
      console.error(`Error with ${venue.name}: ${e.message}`);
    }
  }
  
  fs.writeFileSync(venuesDbPath, venuesContent);
  console.log('Finished downloading all photos and dynamically updating venues.ts!');
})();
