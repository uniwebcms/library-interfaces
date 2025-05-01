#!/usr/bin/env node

/**
 * Library Interfaces Documentation Generator
 * 
 * This script is the main entry point for the documentation generation process.
 * It imports all the necessary modules and runs the main function.
 * 
 * Usage:
 *   node scripts/generate-docs.js
 */

import main from './generate-docs-part1.js';
import { writeOutputFiles, generateVersionDiffs } from './generate-docs-part2.js';
import { 
  generateIndexHtml, 
  generateDomainHtml, 
  generateInterfaceHtml, 
  generateVersionHtml 
} from './generate-docs-part3.js';
import { copyStaticAssets } from './generate-docs-part4.js';

// Make functions available to main
main.writeOutputFiles = writeOutputFiles;
main.generateVersionDiffs = generateVersionDiffs;
main.generateIndexHtml = generateIndexHtml;
main.generateDomainHtml = generateDomainHtml;
main.generateInterfaceHtml = generateInterfaceHtml;
main.generateVersionHtml = generateVersionHtml;
main.copyStaticAssets = copyStaticAssets;

// Run the main function
main().catch(err => {
  console.error('Error generating documentation:', err);
  process.exit(1);
});