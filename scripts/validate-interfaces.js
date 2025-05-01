#!/usr/bin/env node

/**
 * Validate Library Interface Definitions
 * 
 * This script validates that all interface definition files conform to the schema
 * and follow naming conventions and versioning rules.
 */

import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { glob } from 'glob';
import semver from 'semver';

// Configuration
const CONFIG = {
  interfacesDir: './interfaces',
  draftsDir: './drafts',
  extensionsDir: './extensions',
  schemaFile: './schema/interface-schema.json',
};

/**
 * Main execution function
 */
async function main() {
  try {
    // Load schema
    const schema = JSON.parse(await fs.readFile(CONFIG.schemaFile, 'utf-8'));
    
    // Set up validator
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    
    // Find interface files
    const stableFiles = await glob(`${CONFIG.interfacesDir}/**/*-v*.js`);
    const draftFiles = await glob(`${CONFIG.draftsDir}/**/*-v*.js`);
    const extensionFiles = await glob(`${CONFIG.extensionsDir}/**/*-v*.js`);
    
    const allFiles = [...stableFiles, ...draftFiles, ...extensionFiles];
    
    console.log(`Found ${allFiles.length} interface files to validate`);
    
    // Validate each file
    const validationResults = await Promise.all(
      allFiles.map(file => validateInterfaceFile(file, validate))
    );
    
    // Validate versioning across related interfaces
    const versioningResults = await validateVersioning(validationResults);
    
    // Summarize results
    const validFiles = validationResults.filter(r => r.valid).length;
    const invalidFiles = validationResults.filter(r => !r.valid).length;
    
    console.log('\n=== Validation Summary ===');
    console.log(`Files validated: ${allFiles.length}`);
    console.log(`Valid files: ${validFiles}`);
    console.log(`Invalid files: ${invalidFiles}`);
    
    // Log detailed errors for invalid files
    const invalidResults = validationResults.filter(r => !r.valid);
    if (invalidResults.length > 0) {
      console.log('\n=== Validation Errors ===');
      invalidResults.forEach(result => {
        console.log(`\nFile: ${result.file}`);
        if (result.schemaErrors) {
          console.log('Schema validation errors:');
          result.schemaErrors.forEach(err => {
            console.log(`  - ${err.instancePath}: ${err.message}`);
          });
        }
        
        if (result.namingErrors) {
          console.log('Naming convention errors:');
          result.namingErrors.forEach(err => {
            console.log(`  - ${err}`);
          });
        }
      });
    }
    
    // Exit with appropriate code
    if (invalidFiles > 0 || versioningResults.hasErrors) {
      process.exit(1);
    } else {
      console.log('\nAll interfaces are valid!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error validating interfaces:', error);
    process.exit(1);
  }
}

/**
 * Validate a single interface file
 */
async function validateInterfaceFile(file, validate) {
  console.log(`Validating ${file}...`);
  
  const result = {
    file,
    valid: true,
    interface: null,
    schemaErrors: null,
    namingErrors: [],
  };
  
  try {
    // Import the interface definition
    const filePath = path.resolve(file);
    const module = await import(`file://${filePath}`);
    const interfaceDefinition = module.default;
    
    result.interface = interfaceDefinition;
    
    // Validate against schema
    const isValid = validate(interfaceDefinition);
    
    if (!isValid) {
      result.valid = false;
      result.schemaErrors = validate.errors;
      return result;
    }
    
    // Validate component naming conventions
    const componentErrors = validateComponentNaming(interfaceDefinition.components);
    
    if (componentErrors.length > 0) {
      result.valid = false;
      result.namingErrors.push(...componentErrors);
    }
    
    // Validate preset naming conventions
    const presetErrors = validatePresetNaming(interfaceDefinition.components);
    
    if (presetErrors.length > 0) {
      result.valid = false;
      result.namingErrors.push(...presetErrors);
    }
    
    return result;
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
    result.valid = false;
    result.namingErrors.push(`Failed to load or process: ${error.message}`);
    return result;
  }
}

/**
 * Validate component naming follows PascalCase
 */
function validateComponentNaming(components) {
  const errors = [];
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  
  for (const componentName of Object.keys(components)) {
    if (!pascalCaseRegex.test(componentName)) {
      errors.push(`Component "${componentName}" should use PascalCase`);
    }
  }
  
  return errors;
}

/**
 * Validate preset naming follows kebab-case
 */
function validatePresetNaming(components) {
  const errors = [];
  const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  
  for (const [componentName, component] of Object.entries(components)) {
    for (const presetName of Object.keys(component.presets)) {
      if (presetName.includes('-')) {
        // If it has hyphens, it should be kebab-case
        if (!kebabCaseRegex.test(presetName)) {
          errors.push(`Preset "${presetName}" in "${componentName}" should use kebab-case`);
        }
      } else {
        // If it's a single word, it should be lowercase
        if (presetName !== presetName.toLowerCase()) {
          errors.push(`Preset "${presetName}" in "${componentName}" should be lowercase`);
        }
      }
    }
  }
  
  return errors;
}

/**
 * Validate versioning rules across related interfaces
 */
async function validateVersioning(validationResults) {
  const result = {
    hasErrors: false,
    errors: [],
  };
  
  // Group interfaces by base name
  const interfaceGroups = {};
  
  validationResults
    .filter(r => r.valid && r.interface)
    .forEach(r => {
      const filePath = r.file;
      const fileName = path.basename(filePath, '.js');
      const match = fileName.match(/^(.+)-v(\d+\.\d+)$/);
      
      if (!match) {
        result.hasErrors = true;
        result.errors.push(`Invalid interface filename format: ${fileName}`);
        return;
      }
      
      const [, baseName, versionKey] = match;
      
      if (!interfaceGroups[baseName]) {
        interfaceGroups[baseName] = [];
      }
      
      interfaceGroups[baseName].push({
        file: filePath,
        version: r.interface.version,
        versionKey,
        interface: r.interface,
      });
    });
  
  // Check versioning rules within each group
  for (const [baseName, versions] of Object.entries(interfaceGroups)) {
    // Skip if only one version exists
    if (versions.length <= 1) continue;
    
    // Sort versions by semver
    versions.sort((a, b) => semver.compare(a.version, b.version));
    
    // Check each version against previous versions
    for (let i = 1; i < versions.length; i++) {
      const prevVersion = versions[i-1];
      const currVersion = versions[i];
      
      // Get major, minor, patch numbers
      const prevMajor = semver.major(prevVersion.version);
      const prevMinor = semver.minor(prevVersion.version);
      const prevPatch = semver.patch(prevVersion.version);
      
      const currMajor = semver.major(currVersion.version);
      const currMinor = semver.minor(currVersion.version);
      const currPatch = semver.patch(currVersion.version);
      
      // Validate according to version type
      if (currMajor > prevMajor) {
        // Major version bumps allow breaking changes, nothing to check
        continue;
      } else if (currMinor > prevMinor) {
        // Minor version bumps should only add components or presets
        const changes = validateMinorVersionChanges(prevVersion.interface, currVersion.interface);
        
        if (changes.hasBreakingChanges) {
          result.hasErrors = true;
          result.errors.push(`Minor version bump ${prevVersion.version} → ${currVersion.version} in ${baseName} contains breaking changes:`);
          changes.breakingChanges.forEach(change => {
            result.errors.push(`  - ${change}`);
          });
        }
      } else if (currPatch > prevPatch) {
        // Patch version bumps should only modify descriptions
        const changes = validatePatchVersionChanges(prevVersion.interface, currVersion.interface);
        
        if (changes.hasBreakingChanges) {
          result.hasErrors = true;
          result.errors.push(`Patch version bump ${prevVersion.version} → ${currVersion.version} in ${baseName} contains breaking changes:`);
          changes.breakingChanges.forEach(change => {
            result.errors.push(`  - ${change}`);
          });
        }
      }
    }
  }
  
  // Log versioning errors if any
  if (result.errors.length > 0) {
    console.log('\n=== Versioning Errors ===');
    result.errors.forEach(error => {
      console.log(error);
    });
  }
  
  return result;
}

/**
 * Validate rules for minor version changes
 */
function validateMinorVersionChanges(oldInterface, newInterface) {
  const result = {
    hasBreakingChanges: false,
    breakingChanges: [],
  };
  
  const oldComponents = Object.keys(oldInterface.components);
  const newComponents = Object.keys(newInterface.components);
  
  // Check for removed components
  const removedComponents = oldComponents.filter(c => !newComponents.includes(c));
  
  if (removedComponents.length > 0) {
    result.hasBreakingChanges = true;
    removedComponents.forEach(component => {
      result.breakingChanges.push(`Component "${component}" was removed`);
    });
  }
  
  // Check for renamed components
  if (oldComponents.length !== removedComponents.length) {
    // Check for renamed or modified presets in existing components
    for (const componentName of oldComponents) {
      if (!newComponents.includes(componentName)) continue;
      
      const oldComponent = oldInterface.components[componentName];
      const newComponent = newInterface.components[componentName];
      
      const oldPresets = Object.keys(oldComponent.presets);
      const newPresets = Object.keys(newComponent.presets);
      
      // Check for removed presets
      const removedPresets = oldPresets.filter(p => !newPresets.includes(p));
      
      if (removedPresets.length > 0) {
        result.hasBreakingChanges = true;
        removedPresets.forEach(preset => {
          result.breakingChanges.push(`Preset "${preset}" in component "${componentName}" was removed`);
        });
      }
    }
  }
  
  return result;
}

/**
 * Validate rules for patch version changes
 */
function validatePatchVersionChanges(oldInterface, newInterface) {
  const result = {
    hasBreakingChanges: false,
    breakingChanges: [],
  };
  
  const oldComponents = Object.keys(oldInterface.components);
  const newComponents = Object.keys(newInterface.components);
  
  // Check for added or removed components
  const addedComponents = newComponents.filter(c => !oldComponents.includes(c));
  const removedComponents = oldComponents.filter(c => !newComponents.includes(c));
  
  if (addedComponents.length > 0) {
    result.hasBreakingChanges = true;
    addedComponents.forEach(component => {
      result.breakingChanges.push(`Component "${component}" was added in a patch version`);
    });
  }
  
  if (removedComponents.length > 0) {
    result.hasBreakingChanges = true;
    removedComponents.forEach(component => {
      result.breakingChanges.push(`Component "${component}" was removed`);
    });
  }
  
  // Check for added or removed presets
  for (const componentName of oldComponents) {
    if (!newComponents.includes(componentName)) continue;
    
    const oldComponent = oldInterface.components[componentName];
    const newComponent = newInterface.components[componentName];
    
    const oldPresets = Object.keys(oldComponent.presets);
    const newPresets = Object.keys(newComponent.presets);
    
    const addedPresets = newPresets.filter(p => !oldPresets.includes(p));
    const removedPresets = oldPresets.filter(p => !newPresets.includes(p));
    
    if (addedPresets.length > 0) {
      result.hasBreakingChanges = true;
      addedPresets.forEach(preset => {
        result.breakingChanges.push(`Preset "${preset}" in component "${componentName}" was added in a patch version`);
      });
    }
    
    if (removedPresets.length > 0) {
      result.hasBreakingChanges = true;
      removedPresets.forEach(preset => {
        result.breakingChanges.push(`Preset "${preset}" in component "${componentName}" was removed`);
      });
    }
  }
  
  return result;
}

// Run the script
main();