/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// CSS Module declarations
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Process environment for React components
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Global process for browser environments
declare const process: {
  env: {
    NODE_ENV: string;
  };
};
