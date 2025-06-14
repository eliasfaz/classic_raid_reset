const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/chromium/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 2000 });

  await page.goto('https://classicraidreset.com/US/Classic', { waitUntil: 'networkidle2' });

  // Accept cookies if the button is present
  try {
    await page.waitForFunction(() => {
      return [...document.querySelectorAll('button')]
        .some(btn => btn.textContent.trim() === 'Accept');
    }, { timeout: 5000 });

    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')];
      const acceptBtn = buttons.find(btn => btn.textContent.trim() === 'Accept');
      if (acceptBtn) acceptBtn.click();
    });
    console.log('Clicked Accept button on cookie banner');
  } catch (e) {
    console.log('Accept button not found or already accepted');
  }

  // Wait for the banner to disappear
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check "Edge of Madness" checkbox if not already checked
  await page.evaluate(() => {
    const checkbox = document.querySelector('input[name="typeEdgeOfMadness"]');
    if (checkbox && !checkbox.checked) {
      checkbox.checked = true;

      // Trigger change event so the site reacts to the update
      const event = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(event);
    }
  });

  // Wait a bit for the checkbox change to take effect
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get page height for cropping
  const clipHeight = await page.evaluate(() => {
    const elements = [...document.querySelectorAll('body *')];
    const target = elements.find(el => el.textContent.includes('Support my work - Buy me a coffee'));
    if (!target) return null;

    const rect = target.getBoundingClientRect();
    return Math.ceil(rect.bottom + window.scrollY);
  });

  if (!clipHeight) {
    console.log('Text "Support my work - Buy me a coffee" not found. Taking full-page screenshot.');
    await page.screenshot({ path: 'raidreset.png', fullPage: true });
  } else {
    console.log(`Capturing screenshot up to height: ${clipHeight}px`);

    await page.screenshot({
      path: 'raidreset.png',
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: clipHeight
      }
    });
  }

  console.log('Screenshot saved as raidreset.png');

  await browser.close();
})();
