import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page) {
    // Inject __test global to prevent ReferenceError during test execution
    await page.evaluate(() => {
      (window as any).__test = true;
    });
  },
};

export default config;
