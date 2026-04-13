import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

try {
  mkdirSync('/tmp/playwright-logs', { recursive: true });
} catch (e) {}

async function comprehensiveTextVisibilityTest() {
  console.log('Starting comprehensive sidebar text visibility test...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    await page.goto('http://localhost:5173/console/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    console.log('\n=== EXPANDED STATE (DEFAULT) ===');
    await page.screenshot({ path: '/tmp/playwright-logs/comprehensive-expanded.png', fullPage: true });

    const expandedAnalysis = await page.evaluate(() => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      const parent = sidebar?.parentElement?.parentElement;

      // Get all text elements in sidebar
      const allText = Array.from(sidebar?.querySelectorAll('*') || [])
        .filter(el => {
          const text = el.textContent?.trim();
          return text && text.length > 0 && text.length < 100;
        })
        .map(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            text: el.textContent?.trim().substring(0, 50),
            classes: el.className,
            dataAttr: el.getAttribute('data-sidebar'),
            display: style.display,
            opacity: style.opacity,
            visibility: style.visibility,
            width: style.width,
            height: style.height,
            overflow: style.overflow,
            position: style.position,
            isVisible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && parseFloat(style.opacity) > 0
          };
        });

      // Group by visibility
      const visible = allText.filter(t => t.isVisible);
      const invisible = allText.filter(t => !t.isVisible);

      // Get specific elements
      const menuButtons = Array.from(document.querySelectorAll('[data-sidebar="menu-button"]'));
      const groupLabels = Array.from(document.querySelectorAll('[data-sidebar="group-label"]'));

      return {
        dataState: parent?.getAttribute('data-state'),
        dataCollapsible: parent?.getAttribute('data-collapsible'),
        sidebarWidth: sidebar?.parentElement ? window.getComputedStyle(sidebar.parentElement).width : null,
        totalTextElements: allText.length,
        visibleCount: visible.length,
        invisibleCount: invisible.length,
        invisibleElements: invisible.slice(0, 10),
        menuButtonsAnalysis: menuButtons.slice(0, 3).map(btn => {
          const style = window.getComputedStyle(btn);
          const spans = Array.from(btn.querySelectorAll('span'));
          return {
            text: btn.textContent?.trim().substring(0, 30),
            classes: btn.className.substring(0, 200),
            width: style.width,
            height: style.height,
            display: style.display,
            overflow: style.overflow,
            spans: spans.map(s => ({
              text: s.textContent?.trim(),
              display: window.getComputedStyle(s).display,
              opacity: window.getComputedStyle(s).opacity,
              overflow: window.getComputedStyle(s).overflow,
              width: window.getComputedStyle(s).width
            }))
          };
        }),
        groupLabelsAnalysis: groupLabels.map(label => ({
          text: label.textContent?.trim(),
          display: window.getComputedStyle(label).display,
          opacity: window.getComputedStyle(label).opacity,
          marginTop: window.getComputedStyle(label).marginTop
        }))
      };
    });

    console.log('\nExpanded State Analysis:');
    console.log('Data State:', expandedAnalysis.dataState);
    console.log('Sidebar Width:', expandedAnalysis.sidebarWidth);
    console.log('Total Text Elements:', expandedAnalysis.totalTextElements);
    console.log('Visible Elements:', expandedAnalysis.visibleCount);
    console.log('Invisible Elements:', expandedAnalysis.invisibleCount);

    if (expandedAnalysis.invisibleCount > 0) {
      console.log('\n⚠️ INVISIBLE TEXT ELEMENTS IN EXPANDED STATE:');
      expandedAnalysis.invisibleElements.forEach((el, i) => {
        console.log(`${i + 1}. "${el.text}"`);
        console.log(`   Tag: ${el.tag}, Data: ${el.dataAttr}`);
        console.log(`   Display: ${el.display}, Opacity: ${el.opacity}, Overflow: ${el.overflow}`);
        console.log(`   Width: ${el.width}, Height: ${el.height}`);
        console.log(`   Classes: ${el.classes.substring(0, 100)}...`);
      });
    }

    console.log('\nMenu Buttons Analysis:');
    expandedAnalysis.menuButtonsAnalysis.forEach((btn, i) => {
      console.log(`\nButton ${i + 1}: "${btn.text}"`);
      console.log(`  Width: ${btn.width}, Height: ${btn.height}`);
      console.log(`  Overflow: ${btn.overflow}`);
      console.log(`  Spans (${btn.spans.length}):`);
      btn.spans.forEach((span, j) => {
        console.log(`    Span ${j + 1}: "${span.text}"`);
        console.log(`      Display: ${span.display}, Opacity: ${span.opacity}, Width: ${span.width}, Overflow: ${span.overflow}`);
      });
    });

    if (expandedAnalysis.groupLabelsAnalysis.length > 0) {
      console.log('\nGroup Labels Analysis:');
      expandedAnalysis.groupLabelsAnalysis.forEach((label, i) => {
        console.log(`  ${i + 1}. "${label.text}": display=${label.display}, opacity=${label.opacity}, marginTop=${label.marginTop}`);
      });
    }

    // Now test collapsed state
    console.log('\n\n=== COLLAPSING SIDEBAR ===');
    await page.evaluate(() => {
      document.querySelector('[data-sidebar="trigger"]')?.click();
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/playwright-logs/comprehensive-collapsed.png', fullPage: true });

    const collapsedAnalysis = await page.evaluate(() => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      const parent = sidebar?.parentElement?.parentElement;
      return {
        dataState: parent?.getAttribute('data-state'),
        sidebarWidth: sidebar?.parentElement ? window.getComputedStyle(sidebar.parentElement).width : null
      };
    });

    console.log('\nCollapsed State:');
    console.log('Data State:', collapsedAnalysis.dataState);
    console.log('Sidebar Width:', collapsedAnalysis.sidebarWidth);

    // Test re-expand
    console.log('\n\n=== RE-EXPANDING SIDEBAR ===');
    await page.evaluate(() => {
      document.querySelector('[data-sidebar="trigger"]')?.click();
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/playwright-logs/comprehensive-reexpanded.png', fullPage: true });

    console.log('\n=== SUMMARY ===');
    console.log(`✅ Sidebar state changes work: ${expandedAnalysis.dataState === 'expanded' && collapsedAnalysis.dataState === 'collapsed'}`);
    console.log(`✅ Sidebar width changes work: ${expandedAnalysis.sidebarWidth === '256px' && collapsedAnalysis.sidebarWidth === '48px'}`);
    console.log(`⚠️ Text visibility issues: ${expandedAnalysis.invisibleCount} invisible elements in expanded state`);

    if (expandedAnalysis.invisibleCount > 0) {
      console.log('\n🔴 PROBLEM DETECTED: Text elements are still invisible when expanded!');
      process.exit(1);
    }

  } catch (error) {
    console.error('Error during test:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

comprehensiveTextVisibilityTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
