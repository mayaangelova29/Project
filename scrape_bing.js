import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.bing.com/images/search?q=Next+Level+NDK+Sofia');
  
  const imgSrc = await page.evaluate(() => {
    const img = document.querySelector('.mimg');
    return img ? img.src || img.getAttribute('data-src') : null;
  });
  
  console.log('Result:', imgSrc);
  await browser.close();
}

run();
