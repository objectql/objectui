import { chromium } from 'playwright';

async function findSizeClass() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('http://localhost:5174/console/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const analysis = await page.evaluate(() => {
      const button = document.querySelector('[data-sidebar="menu-button"]');

      // Check for rules that set width or size to 32px or 2rem
      const sizeRules = [];
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            const cssText = rule.cssText || '';
            if (cssText.includes('2rem') || cssText.includes('32px') || cssText.includes('size-8')) {
              const selector = rule.selectorText || '';
              // Check if this could apply to our button
              if (selector.includes('size-8') || selector.includes('menu-button') || selector === '.h-12') {
                sizeRules.push({
                  selector,
                  cssText: cssText.substring(0, 150)
                });
              }
            }
          });
        } catch (e) {}
      });

      return {
        buttonWidth: window.getComputedStyle(button).width,
        buttonHeight: window.getComputedStyle(button).height,
        rulesWithSize: sizeRules.slice(0, 10)
      };
    });

    console.log(JSON.stringify(analysis, null, 2));
  } finally {
    await browser.close();
  }
}

findSizeClass().catch(console.error);
