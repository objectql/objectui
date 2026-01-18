#!/usr/bin/env node

/**
 * Script to add MIT license headers to all source code files
 * 
 * Requirements:
 * - Recursively traverse .ts, .tsx, .js, .jsx, .vue files
 * - Exclude node_modules, dist, build, .git, coverage directories
 * - Skip files that already have "Copyright" or "License" in first 10 lines
 * - Insert license header at the very top of the file
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

// License header template
const LICENSE_HEADER = `/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

`;

// Directories to exclude
const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '.changeset',
  '.turbo',
  '.vscode',
  '.idea'
]);

// File extensions to process
const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue']);

/**
 * Check if a file already has a license header
 */
function hasLicenseHeader(content) {
  const lines = content.split('\n').slice(0, 10);
  const first10Lines = lines.join('\n').toLowerCase();
  return first10Lines.includes('copyright') || first10Lines.includes('license');
}

/**
 * Recursively find all target files in a directory
 */
async function findTargetFiles(dir, files = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDED_DIRS.has(entry.name)) {
          await findTargetFiles(fullPath, files);
        }
      } else if (entry.isFile()) {
        // Check if file has target extension
        const ext = extname(entry.name);
        if (TARGET_EXTENSIONS.has(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Add license header to a file
 */
async function addLicenseHeader(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Check if already has license header
    if (hasLicenseHeader(content)) {
      return { status: 'skipped', reason: 'already has license' };
    }
    
    // Add license header at the top
    const newContent = LICENSE_HEADER + content;
    await writeFile(filePath, newContent, 'utf-8');
    
    return { status: 'added' };
  } catch (error) {
    return { status: 'error', reason: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  const startTime = Date.now();
  console.log('🔍 Finding target files...\n');
  
  // Start from project root
  const projectRoot = process.cwd();
  const files = await findTargetFiles(projectRoot);
  
  console.log(`📁 Found ${files.length} files to process\n`);
  
  let added = 0;
  let skipped = 0;
  let errors = 0;
  
  // Process each file
  for (const file of files) {
    const relativePath = file.replace(projectRoot + '/', '');
    const result = await addLicenseHeader(file);
    
    if (result.status === 'added') {
      console.log(`✅ Added: ${relativePath}`);
      added++;
    } else if (result.status === 'skipped') {
      console.log(`⏭️  Skipped: ${relativePath} (${result.reason})`);
      skipped++;
    } else if (result.status === 'error') {
      console.log(`❌ Error: ${relativePath} (${result.reason})`);
      errors++;
    }
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Added: ${added}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   ⏱️  Time: ${duration}s`);
  console.log('='.repeat(60));
}

main().catch(console.error);
