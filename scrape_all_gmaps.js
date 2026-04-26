import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const fileContent = fs.readFileSync('./src/data/venues.ts', 'utf-8');
  const venues = [...fileContent.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
  
  const results = {};
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Try to bypass consent on google
  await page.goto('https://www.google.bg/maps?hl=en');
  try {
    await page.waitForSelector('button[aria-label="Reject all"]', { timeout: 3000 });
    await page.click('button[aria-label="Reject all"]');
    await new Promise(r => setTimeout(r, 1000));
  } catch(e) {}

  for (const name of venues) {
    console.log(`Searching for: ${name}`);
    await page.goto(`https://www.google.bg/maps/search/${encodeURIComponent(name + ' Sofia')}/?hl=en`);
    
    // Check if it says "We couldn't find"
    const notFound = await page.evaluate(() => {
      const el = document.querySelector('.Q2vNVc');
      if (el && el.innerText.includes("We could not find")) return true;
      return false;
    });

    if (notFound) {
      console.log(`[NOT FOUND] ${name}`);
      results[name] = null;
      continue;
    }

    try {
      await page.waitForSelector('.hfpxzc', { timeout: 3000 });
      await page.click('.hfpxzc');
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      // it might have opened the place directly
    }

    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector('button[aria-label*="Photo of"] img') || 
                  document.querySelector('.ZfOQUc img') ||
                  document.querySelector('img[decoding="async"][src^="https://lh5.googleusercontent.com/"]') ||
                  document.querySelector('img[decoding="async"][src^="https://lh3.googleusercontent.com/"]');
      if (img) {
         // remove size limits to get original quality
         return img.src.replace(/=w\d+-h\d+-k-no/, '=s1600');
      }
      return null;
    });

    if (imageUrl) {
      console.log(`[FOUND] ${name}: ${imageUrl.substring(0, 50)}...`);
      results[name] = imageUrl;
    } else {
      console.log(`[NO IMAGE] ${name}`);
      results[name] = false;
    }
    
    // Save continuously
    fs.writeFileSync('gmaps_data.json', JSON.stringify(results, null, 2));
  }

  await browser.close();
  console.log('Done mapping.');
})();
