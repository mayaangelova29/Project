import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
  const fileContent = fs.readFileSync('./src/data/venues.ts', 'utf-8');
  const names = [...fileContent.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const imageUrls = {};

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    console.log(`Scraping ${name}...`);
    const query = encodeURIComponent(`${name} Sofia`);
    await page.goto(`https://www.bing.com/images/search?q=${query}`);
    
    try {
      const imgSrc = await page.evaluate(() => {
        const img = document.querySelector('.mimg');
        return img ? img.src || img.getAttribute('data-src') : null;
      });
      imageUrls[name] = imgSrc;
    } catch(e) {
      console.log('Error finding image for', name);
    }
  }

  await browser.close();
  fs.writeFileSync('images.json', JSON.stringify(imageUrls, null, 2), 'utf-8');
  console.log('Images saved to images.json');
}

run();
