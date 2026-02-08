
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewport({ width: 375, height: 812 });
  
  // Home page
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'shot_home.png' });
  
  // Divination page
  await page.goto('http://localhost:3000/divination', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'shot_divination.png' });

  // Dashboard
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'shot_dashboard.png' });

  await browser.close();
})();
