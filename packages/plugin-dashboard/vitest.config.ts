import { mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.mts';
import viteConfig from './vite.config';

export default mergeConfig(rootConfig, mergeConfig(viteConfig, {
  test: {
    environment: 'jsdom',
  },
}));
