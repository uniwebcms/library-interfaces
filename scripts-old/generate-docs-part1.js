/**
 * Library Interfaces Documentation Generator
 * 
 * This script processes interface definition files and generates:
 * 1. A master JSON file with all interfaces and versions
 * 2. Validation reports for interface compliance
 * 3. HTML documentation for GitHub Pages
 * 
 * Designed for domain-first directory structure.
 */

import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { glob } from 'glob';
import semver from 'semver';
import prettier from 'prettier';

// Import helper functions
import { 
  generateVersionDiff,
  generateIndexHtml,
  generateDomainHtml,
  generateInterfaceHtml,
  generateVersionHtml,
  copyStaticAssets
} from './generate-docs-html.js';

// Configuration
const CONFIG = {
  interfacesDir: './interfaces',
  draftsDir: './drafts',
  outputDir: './docs/api',
  schemaFile: './schema/interface-schema.json',
};

/**
 * Main execution function
 */
async function main() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Load schema
    const schema = JSON.parse(await fs.readFile(CONFIG.schemaFile, 'utf-8'));
    
    // Set up validator
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    
    // Find interface files
    const interfaceFiles = await findInterfaceFiles();
    
    // Load and validate interfaces
    const interfaces = await loadAndValidateInterfaces(interfaceFiles, validate);
    
    // Build master JSON with interface information
    const masterJson = buildMasterJson(interfaces);
    
    // Write output files
    await writeOutputFiles(masterJson);
    
    console.log('Documentation generation complete!');
  } catch (error) {
    console.error('Error generating documentation:', error);
    process.exit(1);
  }
}

/**
 * Find interface definition files
 */
async function findInterfaceFiles() {
  // Find stable interface files
  // Updated pattern for domain-first structure: interfaces/domain/concept/domain-concept-v*.js
  const stableFiles = await glob(`${CONFIG.interfacesDir}/**/*/(*)-v*.js`);
  
  // Find draft interface files
  const draftFiles = await glob(`${CONFIG.draftsDir}/**/*/(*)-v*.js`);
  
  return [...stableFiles, ...draftFiles];
}

/**
 * Load and validate interface definitions
 */
async function loadAndValidateInterfaces(files, validate) {
  const interfaces = [];
  const validationErrors = [];
  
  for (const file of files) {
    try {
      // Import the interface definition
      const module = await import(path.resolve(file));
      const interfaceDefinition = module.default;
      
      // Validate against schema
      const isValid = validate(interfaceDefinition);
      
      if (!isValid) {
        validationErrors.push({
          file,
          errors: validate.errors,
        });
        console.error(`Validation failed for ${file}:`, validate.errors);
        continue;
      }
      
      // Extract information about the interface
      const info = {
        file,
        id: extractIdFromFilename(file),
        pathInfo: extractInterfaceInfoFromPath(file),
        definition: interfaceDefinition,
        status: getStatusFromPath(file),
      };
      
      interfaces.push(info);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  // If there are validation errors, write a report
  if (validationErrors.length > 0) {
    await fs.writeFile(
      path.join(CONFIG.outputDir, 'validation-errors.json'),
      JSON.stringify(validationErrors, null, 2)
    );
  }
  
  return interfaces;
}

/**
 * Extract interface ID from filename
 */
function extractIdFromFilename(filePath) {
  const fileName = path.basename(filePath, '.js');
  return fileName;
}

/**
 * Extract domain and concept information from file path
 */
function extractInterfaceInfoFromPath(filePath) {
  // For domain-first structure, path should be like:
  // interfaces/marketing/core/marketing-core-v1.0.js
  
  const normalizedPath = filePath.replace(/\\/g, '/'); // Normalize for Windows paths
  const parts = normalizedPath.split('/');
  
  // Get domain and concept directories
  const fileIndex = parts.findIndex(part => part.includes('-v'));
  
  if (fileIndex >= 3) { // We need at least domain and concept folders
    const domain = parts[fileIndex - 2];
    const concept = parts[fileIndex - 1];
    
    return {
      domain,
      concept,
      version: extractVersionFromFileName(parts[fileIndex])
    };
  }
  
  return null;
}

/**
 * Extract version from file name
 */
function extractVersionFromFileName(fileName) {
  const match = fileName.match(/-v(\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Determine interface status from its path
 */
function getStatusFromPath(filePath) {
  if (filePath.includes(CONFIG.draftsDir)) {
    return 'draft';
  } else {
    return 'stable';
  }
}

/**
 * Build master JSON with all interface information
 */
function buildMasterJson(interfaces) {
  const result = {
    interfaces: {},
    domains: {},
    meta: {
      lastUpdated: new Date().toISOString(),
      totalInterfaces: 0,
      totalComponents: 0,
    },
  };
  
  // Group interfaces by base name (without version)
  const groupedInterfaces = {};
  
  interfaces.forEach(interfaceInfo => {
    const { id, pathInfo, definition, status } = interfaceInfo;
    
    // Skip if we couldn't extract path info
    if (!pathInfo) {
      console.warn(`Couldn't extract path info for ${id}`);
      return;
    }
    
    const { domain, concept, version } = pathInfo;
    
    // Extract base name without version
    const baseName = `${domain}-${concept}`;
    
    // Initialize domain if not exists
    if (!result.domains[domain]) {
      result.domains[domain] = {
        interfaces: [],
        components: {},
      };
    }
    
    // Initialize group if not exists
    if (!groupedInterfaces[baseName]) {
      groupedInterfaces[baseName] = [];
    }
    
    // Add this interface to its group
    groupedInterfaces[baseName].push({
      id,
      version: definition.version,
      versionKey: version,
      definition,
      status,
      domain,
      concept,
    });
    
    // Register this interface with its domain
    if (!result.domains[domain].interfaces.includes(baseName)) {
      result.domains[domain].interfaces.push(baseName);
    }
    
    // Register components with their domain
    Object.keys(definition.components).forEach(componentName => {
      result.domains[domain].components[componentName] = baseName;
    });
  });
  
  // Process each interface group
  Object.entries(groupedInterfaces).forEach(([baseName, versions]) => {
    // Sort versions semantically
    versions.sort((a, b) => semver.compare(b.version, a.version));
    
    // Initialize interface entry
    result.interfaces[baseName] = {
      versions: {},
      latest: versions[0].versionKey,
      status: versions[0].status,
      domain: versions[0].domain,
      concept: versions[0].concept,
    };
    
    // Process each version
    versions.forEach(versionInfo => {
      const { versionKey, definition, status } = versionInfo;
      
      // Add version info
      result.interfaces[baseName].versions[versionKey] = {
        version: definition.version,
        description: definition.description,
        category: definition.category,
        components: definition.components,
        status,
      };
      
      // Update component count
      result.meta.totalComponents += Object.keys(definition.components).length;
    });
    
    // Update interface count
    result.meta.totalInterfaces++;
  });
  
  return result;
}

// Export the main function to be called from the command line
export default main;