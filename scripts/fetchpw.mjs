import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

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

console.log(`Found ${venues.length} venues.`);

(async () => {
  console.log("Launching Playwright...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  for (const venue of venues) {
    try {
      console.log(`Fetching photo for ${venue.name}...`);
      const q = encodeURIComponent(`${venue.name} Sofia interior gym exterior`);
      
      await page.goto(`https://www.google.bg/search?tbm=isch&q=${q}`, { waitUntil: 'load', timeout: 30000 });
      
      // Attempt to click reject cookies if it appears in Europe
      try {
         const rejectButton = await page.locator('button:has-text("Reject all"), button:has-text("Отхвърляне")').first();
         if (await rejectButton.isVisible({ timeout: 2000 })) {
             await rejectButton.click();
             await page.waitForTimeout(1000);
         }
      } catch(e) {}
      
      await page.waitForTimeout(1500); // Give images time to populate

      // Grab the first valid thumbnail
      const src = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        for (let i = 0; i < imgs.length; i++) {
            const s = imgs[i].src || '';
            // We want a decent sized base64 or a real tbn0 link
            if ((s.includes('encrypted-tbn0') || s.startsWith('data:image/jpeg')) && s.length > 500) {
               return s;
            }
        }
        return null;
      });

      if (!src) {
        console.log(`No image found for ${venue.name}`);
        continue;
      }
      
      const safeName = venue.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${venue.id}_${safeName}.jpg`;
      const filePath = path.resolve(__dirname, '../public/images', fileName);

      if (src.startsWith('data:image')) {
        const base64Data = src.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(filePath, base64Data, 'base64');
      } else {
        const response = await fetch(src);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
      }
      
      console.log(`Saved ${fileName}`);
      
      const blockRegex = new RegExp(`(id:\\s*"${venue.id}"[\\s\\S]*?imageUrl:\\s*)"([^"]+)"`);
      venuesContent = venuesContent.replace(blockRegex, `$1"/images/${fileName}"`);

      await page.waitForTimeout(1500);
      
    } catch (e) {
      console.error(`Error with ${venue.name}: ${e.message}`);
    }
  }
  
  fs.writeFileSync(venuesDbPath, venuesContent);
  console.log('Finished updating venues.ts!');

  await browser.close();
})();
