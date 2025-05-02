/**
 * core.js - Core utilities for Library Interfaces script system
 * 
 * This module provides fundamental operations for working with interfaces:
 * - File operations
 * - Version parsing and comparison
 * - Interface loading and processing
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Default configuration
export const config = {
  interfacesDir: './interfaces',
  outputDir: './docs/api',
  docsDir: './docs/api/html',
};

/**
 * Get interface files matching the specified filters
 */
export async function getInterfaceFiles({ domain, version, concept } = {}) {
  let pattern = path.join(config.interfacesDir, '**/*.js');
  
  if (domain) {
    pattern = path.join(config.interfacesDir, domain, '**/*.js');
  }
  
  if (version) {
    pattern = path.join(config.interfacesDir, domain || '*', version, '**/*.js');
  }
  
  if (concept) {
    pattern = path.join(config.interfacesDir, domain || '*', version || '*', concept, '*.js');
  }
  
  return globSync(pattern);
}

/**
 * Parse domain, version, and concept from file path
 */
export function parseFilePath(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  
  // Find interfaces dir index
  const interfacesDirIndex = parts.findIndex(part => part === 'interfaces');
  
  if (interfacesDirIndex === -1 || parts.length < interfacesDirIndex + 4) {
    throw new Error(`Invalid file path: ${filePath}`);
  }
  
  return {
    domain: parts[interfacesDirIndex + 1],
    version: parts[interfacesDirIndex + 2],
    concept: parts[interfacesDirIndex + 3],
    filename: parts[parts.length - 1],
  };
}

/**
 * Load and parse an interface file
 */
export async function loadInterface(filePath) {
  try {
    // Get metadata from path
    const pathInfo = parseFilePath(filePath);
    
    // Import the module
    const fileUrl = new URL(`file://${path.resolve(filePath)}`);
    const module = await import(fileUrl.href);
    const definition = module.default;
    
    // Validate basic structure
    if (!definition || !definition.components || !definition.version) {
      throw new Error(`Invalid interface definition in ${filePath}`);
    }
    
    return {
      path: filePath,
      pathInfo,
      definition,
    };
  } catch (error) {
    throw new Error(`Failed to load interface ${filePath}: ${error.message}`);
  }
}

/**
 * Load multiple interfaces
 */
export async function loadInterfaces(filePaths) {
  const results = [];
  const errors = [];
  
  for (const filePath of filePaths) {
    try {
      const interface_ = await loadInterface(filePath);
      results.push(interface_);
    } catch (error) {
      errors.push({ path: filePath, error: error.message });
    }
  }
  
  return { results, errors };
}

/**
 * Group interfaces by domain and version
 */
export function groupInterfaces(interfaces) {
  const grouped = {};
  
  for (const interface_ of interfaces) {
    const { domain, version } = interface_.pathInfo;
    
    if (!grouped[domain]) {
      grouped[domain] = {};
    }
    
    if (!grouped[domain][version]) {
      grouped[domain][version] = [];
    }
    
    grouped[domain][version].push(interface_);
  }
  
  return grouped;
}

/**
 * Compare versions semantically
 */
export function compareVersions(a, b) {
  // Parse versions
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  
  // Compare major version
  if (partsA[0] !== partsB[0]) {
    return partsA[0] - partsB[0];
  }
  
  // Compare minor version
  if (partsA[1] !== partsB[1]) {
    return partsA[1] - partsB[1];
  }
  
  // Compare patch version
  return partsA[2] - partsB[2];
}

/**
 * Extract components from an interface
 */
export function getComponents(interface_) {
  return Object.entries(interface_.definition.components).map(([name, component]) => ({
    name,
    description: component.description,
    category: component.category,
    presets: Object.entries(component.presets).map(([name, description]) => ({
      name,
      description,
    })),
  }));
}

/**
 * Create directory if it doesn't exist
 */
export async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Write JSON file
 */
export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
