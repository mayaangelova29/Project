import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.google.bg/maps/search/Fight+club+Bulgaria+Sofia/?hl=en');
  
  try {
    await page.waitForSelector('button[aria-label="Reject all"]', { timeout: 3000 });
    await page.click('button[aria-label="Reject all"]');
  } catch(e) {
    console.log("No reject all button");
  }

  try {
    await page.waitForSelector('.hfpxzc', { timeout: 5000 }); // click first result if it's a list
    await page.click('.hfpxzc');
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    // maybe it opened directly
  }

  const imageUrl = await page.evaluate(() => {
    // Try to find the image inside the place panel
    const img = document.querySelector('button[aria-label*="Photo of"] img') || 
                document.querySelector('.ZfOQUc img') ||
                document.querySelector('img[decoding="async"][src^="https://lh5.googleusercontent.com/"]');
    return img ? img.src : null;
  });

  console.log("Image URL:", imageUrl);
  await browser.close();
})();
