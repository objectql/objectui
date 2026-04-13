import { chromium } from 'playwright';

async function debugCSSSelectors() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('http://localhost:5174/console/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const debug = await page.evaluate(() => {
      const button = document.querySelector('[data-sidebar="menu-button"]');
      if (!button) return { error: 'Button not found' };

      const classes = button.className;
      const classList = Array.from(button.classList);
      const parent = button.closest('[data-collapsible]');

      // Check which CSS rules match
      const matchedRules = [];
      const allRules = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules ||[]);
          } catch (e) {
            return [];
          }
        })
        .filter(rule => rule.selectorText && rule.selectorText.includes('group-data'))
        .map(rule => ({
          selector: rule.selectorText,
          styles: rule.style.cssText
        }));

      return {
        buttonClasses: classList,
        parentDataState: parent?.getAttribute('data-state'),
        parentDataCollapsible: parent?.getAttribute('data-collapsible'),
        parentHasGroupClass: parent?.classList.contains('group'),
        computedWidth: window.getComputedStyle(button).width,
        computedHeight: window.getComputedStyle(button).height,
        allGroupDataRules: allRules.slice(0, 20)
      };
    });

    console.log(JSON.stringify(debug, null, 2));
  } finally {
    await browser.close();
  }
}

debugCSSSelectors().catch(console.error);
