import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
  const fileContent = fs.readFileSync('./src/data/venues.ts', 'utf-8');
  const names = [...fileContent.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Set User Agent to prevent blocking
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  const results = {};
  const fakeVenues = [];
  
  for (const name of names) {
    console.log(`Checking ${name}...`);
    const query = encodeURIComponent(`${name} Sofia`);
    
    try {
      await page.goto(`https://www.bing.com/images/search?q=${query}`, { waitUntil: 'networkidle2' });
      const highResUrl = await page.evaluate(() => {
        const a = document.querySelector('a.iusc');
        if (a) {
          const m = a.getAttribute('m');
          if (m) {
            try {
              return JSON.parse(m).murl;
            } catch(e) {}
          }
        }
        return null;
      });
      
      if (highResUrl) {
        results[name] = highResUrl;
        console.log(`-> High-res image found`);
      } else {
        console.log(`-> FAKE (No images found)`);
        fakeVenues.push(name);
      }
    } catch(e) {
      console.log(`-> Error getting image for ${name}: ${e.message}`);
    }
  }

  await browser.close();
  
  fs.writeFileSync('fake_venues.json', JSON.stringify(fakeVenues, null, 2));
  fs.writeFileSync('highres_images.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}

run();

