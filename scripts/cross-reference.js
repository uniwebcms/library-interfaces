/**
 * Cross Reference Documentation Files
 * 
 * This script validates and fixes cross-references between documentation files
 * to ensure consistency and help maintain proper linking between concepts.
 * 
 * Usage: node cross-reference.js [--fix]
 */

import fs from "fs".promises;
import path from "path";
import chalk from "chalk";

// Configuration
const config = {
  rootDocs: [
    'README.md',
    'README.md',
    'GLOSSARY.md',
    'REPOSITORY_STRUCTURE.md',
    'INTERFACE_SPECIFICATION.md',
    'GOVERNANCE.md',
    'NAMING_CONVENTIONS.md',
    'CONTRIBUTING.md',
  ],
  docsDirs: [
    'docs/guidelines',
    'docs/governance',
    'docs/concepts',
  ],
  // Expected cross-references between documents
  references: {
    'README.md': [
      'GLOSSARY.md',
      'REPOSITORY_STRUCTURE.md',
      'INTERFACE_SPECIFICATION.md',
      'VERSION_STRATEGY.md',
      'NAMING_CONVENTIONS.md',
      'CONTRIBUTING.md',
    ],
    'GLOSSARY.md': [
      'REPOSITORY_STRUCTURE.md',
      'VERSION_STRATEGY.md',
      'GOVERNANCE.md',
    ],
    'REPOSITORY_STRUCTURE.md': [
      'GLOSSARY.md',
      'VERSION_STRATEGY.md',
      'GOVERNANCE.md',
    ],
    'INTERFACE_SPECIFICATION.md': [
      'GLOSSARY.md',
      'REPOSITORY_STRUCTURE.md',
      'VERSION_STRATEGY.md',
    ],
    'GOVERNANCE.md': [
      'GLOSSARY.md',
      'CONTRIBUTING.md',
      'VERSION_STRATEGY.md',
    ],
    'NAMING_CONVENTIONS.md': [
      'GLOSSARY.md',
      'CONTRIBUTING.md',
      'docs/blog/beyond-ui-patterns.md',
    ],
    'CONTRIBUTING.md': [
      'GLOSSARY.md',
      'REPOSITORY_STRUCTURE.md',
      'GOVERNANCE.md',
      'VERSION_STRATEGY.md',
      'NAMING_CONVENTIONS.md',
    ],
    'VERSION_STRATEGY.md': [
      'GLOSSARY.md',
      'REPOSITORY_STRUCTURE.md',
      'GOVERNANCE.md',
      'INTERFACE_SPECIFICATION.md',
    ],
  }
};

// Main function
async function checkCrossReferences(fix = false) {
  console.log(chalk.blue('Checking cross-references in documentation files...'));
  
  let allValid = true;
  const fileCache = new Map();
  
  // Check each file for expected references
  for (const [file, expectedRefs] of Object.entries(config.references)) {
    console.log(chalk.blue(`Checking ${file}...`));
    
    try {
      // Read file content
      const filePath = path.resolve(file);
      let content = await readFile(filePath, fileCache);
      let modified = false;
      
      // Check each expected reference
      for (const refFile of expectedRefs) {
        const refPath = getRelativePath(file, refFile);
        const linkPattern = new RegExp(`\\[.*?\\]\\(${escapeRegExp(refPath)}\\)`, 'i');
        
        if (!linkPattern.test(content)) {
          allValid = false;
          console.log(chalk.red(`  Missing reference to '${refFile}' in '${file}'`));
          
          if (fix) {
            // Add reference to See Also section
            const seeAlsoSection = /## See Also\n\n/i;
            if (seeAlsoSection.test(content)) {
              // Add to existing See Also section
              content = content.replace(
                seeAlsoSection,
                `## See Also\n\n- [${getDocumentTitle(refFile, fileCache)}](${refPath})\n`
              );
              modified = true;
            } else {
              // Create new See Also section at the end
              const seeAlsoContent = `\n\n## See Also\n\n- [${getDocumentTitle(refFile, fileCache)}](${refPath})\n`;
              
              // Check if there's already a horizontal line at the end
              if (/---\s*$/.test(content)) {
                content = content.replace(/---\s*$/, `${seeAlsoContent}\n\n---\n`);
              } else {
                content += seeAlsoContent;
              }
              modified = true;
            }
          }
        }
      }
      
      // Save changes if modified
      if (fix && modified) {
        await fs.writeFile(filePath, content, 'utf8');
        console.log(chalk.green(`  Fixed references in '${file}'`));
      }
    } catch (err) {
      console.error(chalk.red(`  Error processing '${file}': ${err.message}`));
      allValid = false;
    }
  }
  
  return allValid;
}

// Helper functions
async function readFile(filePath, cache) {
  if (cache.has(filePath)) {
    return cache.get(filePath);
  }
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    cache.set(filePath, content);
    return content;
  } catch (err) {
    console.error(chalk.yellow(`Warning: Could not read file '${filePath}': ${err.message}`));
    return '';
  }
}

function getRelativePath(sourceFile, targetFile) {
  const sourceDir = path.dirname(sourceFile);
  const targetPath = path.relative(sourceDir, targetFile);
  return targetPath.replace(/\\/g, '/'); // Normalize path separators for consistency
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getDocumentTitle(filePath, cache) {
  const content = await readFile(filePath, cache);
  
  // Try to extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1];
  }
  
  // Fallback to filename without extension
  return path.basename(filePath, path.extname(filePath));
}

// Run the script
const args = process.argv.slice(2);
const fix = args.includes('--fix');

checkCrossReferences(fix).then(valid => {
  if (valid) {
    console.log(chalk.green('✅ All cross-references are valid!'));
    process.exit(0);
  } else {
    console.log(chalk.yellow(
      `❌ Some cross-references are missing. ${fix ? 'Fixes applied.' : 'Run with --fix to automatically add them.'}`
    ));
    process.exit(fix ? 0 : 1);
  }
}).catch(err => {
  console.error(chalk.red(`Error checking cross-references: ${err.message}`));
  process.exit(1);
});
