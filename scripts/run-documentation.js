#!/usr/bin/env node

/**
 * Library Interfaces Documentation Generator Runner
 * 
 * This script sets up the environment, installs dependencies if needed,
 * and runs the documentation generator.
 * 
 * Usage:
 *   node run-documentation.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  scriptsDir: path.join(__dirname, 'scripts'),
  outputDir: path.join(__dirname, 'docs', 'api'),
  interfacesDir: path.join(__dirname, 'interfaces'),
  dependencies: [
    'ajv',
    'ajv-formats',
    'glob',
    'semver',
    'prettier'
  ]
};

/**
 * Check if all required dependencies are installed
 */
function checkDependencies() {
  console.log('Checking dependencies...');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  let packageJson;
  
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    process.exit(1);
  }
  
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  const missingDependencies = CONFIG.dependencies.filter(dep => {
    return !dependencies[dep] && !devDependencies[dep];
  });
  
  if (missingDependencies.length > 0) {
    console.log(`Installing missing dependencies: ${missingDependencies.join(', ')}`);
    
    try {
      execSync(`npm install --save-dev ${missingDependencies.join(' ')}`, {
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('Error installing dependencies:', error.message);
      process.exit(1);
    }
  } else {
    console.log('All dependencies are installed.');
  }
}

/**
 * Create required directories if they don't exist
 */
function createDirectories() {
  console.log('Creating required directories...');
  
  const directories = [
    CONFIG.outputDir,
    path.join(CONFIG.outputDir, 'html')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

/**
 * Run the documentation generator
 */
function runDocumentationGenerator() {
  console.log('Running documentation generator...');
  
  try {
    execSync('node scripts/generate-docs.js', {
      stdio: 'inherit'
    });
    
    console.log('Documentation generation completed successfully!');
    console.log(`Documentation is available in: ${CONFIG.outputDir}`);
    console.log(`HTML documentation: ${path.join(CONFIG.outputDir, 'html', 'index.html')}`);
  } catch (error) {
    console.error('Error generating documentation:', error.message);
    process.exit(1);
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('=== Library Interfaces Documentation Generator ===');
  
  // Check if interfaces directory exists
  if (!fs.existsSync(CONFIG.interfacesDir)) {
    console.error(`Error: Interfaces directory not found: ${CONFIG.interfacesDir}`);
    console.log('Make sure you are running this script from the root of the repository.');
    process.exit(1);
  }
  
  // Check if scripts directory exists
  if (!fs.existsSync(CONFIG.scriptsDir)) {
    console.error(`Error: Scripts directory not found: ${CONFIG.scriptsDir}`);
    console.log('Make sure you have the documentation generator scripts installed.');
    process.exit(1);
  }
  
  // Run the steps
  checkDependencies();
  createDirectories();
  runDocumentationGenerator();
}

// Run the main function
main();