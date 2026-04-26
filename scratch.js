import puppeteer from 'puppeteer';

async function testBing() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bing.com/images/search?q=Next+Level+NDK+Sofia');
  
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
  console.log('High res URL:', highResUrl);
  await browser.close();
}

testBing();
