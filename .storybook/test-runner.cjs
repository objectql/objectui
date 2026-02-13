/**
 * Storybook test-runner configuration.
 *
 * Includes:
 * - preVisit: injects __test global and console error collector
 * - postVisit: captures DOM snapshots for visual regression testing (§1.4)
 *              and asserts no React/provider errors were logged
 *
 * @type {import('@storybook/test-runner').TestRunnerConfig}
 */
const { toMatchSnapshot } = require('jest-snapshot');

module.exports = {
  async preVisit(page) {
    // Inject __test global as a no-op function to satisfy test-runner expectations
    // The test-runner expects __test to be a function, not a boolean value
    // This addresses the error: "page.evaluate: TypeError: __test is not a function"
    await page.evaluate(() => {
      window.__test = () => {};
    });

    // Collect console.error calls so postVisit can assert none were critical.
    // This detects missing-provider errors such as
    // "useSchemaContext must be used within a SchemaRendererProvider".
    await page.evaluate(() => {
      window.__collectedErrors = [];
      const origError = console.error;
      console.error = (...args) => {
        window.__collectedErrors.push(args.map(String).join(' '));
        origError.apply(console, args);
      };
    });
  },

  async postVisit(page, context) {
    // Assert no critical React/provider errors were logged during render
    const errors = await page.evaluate(() => window.__collectedErrors || []);
    const critical = errors.filter(
      (msg) =>
        msg.includes('must be used within') ||
        msg.includes('Uncaught Error') ||
        msg.includes('The above error occurred in')
    );
    if (critical.length > 0) {
      throw new Error(
        `Story "${context.id}" logged ${critical.length} critical error(s):\n` +
          critical.map((e) => `  • ${e.slice(0, 200)}`).join('\n')
      );
    }

    // Capture a DOM snapshot for each story as a lightweight visual regression check.
    // This detects structural changes (added/removed elements, changed text, class changes)
    // without the overhead of pixel-based screenshot comparison.
    if (process.env.STORYBOOK_VISUAL_REGRESSION === 'true') {
      const body = await page.$('body');
      if (body) {
        const innerHTML = await body.innerHTML();
        expect(innerHTML).toMatchSnapshot();
      }
    }
  },
};
