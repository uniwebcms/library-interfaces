# Build Script Specification

This document outlines the requirements and functionality for the Library Interfaces build script, which processes interface definition files and generates the final interface specifications based on our full version directory approach.

## Purpose

The build script serves to:

1. Validate version rules and compatibility
2. Generate changelogs by comparing complete version directories
3. Generate interface specifications for consumption by tools and libraries
4. Create documentation that reflects the structure and evolution of interfaces

## Input/Output

### Input
- Complete version directories in the repository structure
  ```
  /interfaces/
    /marketing/
      /1.0.0/
        /core/
          marketing-core.js
        /media/
          marketing-media.js
      /1.1.0/
        /core/
          marketing-core.js
        /media/
          marketing-media.js
        /analytics/
          marketing-analytics.js
  ```

### Output
- JSON specifications following the `domain/version/concept` convention
- Changelogs identifying differences between versions
- Documentation showing the relationships between versions and concepts
- Validation reports for any rule violations

## Key Functions

### 1. Directory Scanning
- Traverse the interfaces directory
- Extract domain, version, and concept information
- Build a complete map of all available interfaces

### 2. Version Validation
- For each domain, process versions in semantic order
- For minor versions within the same major version:
  - Ensure all concepts from previous versions are present
  - Verify that components and presets are only added, never removed or renamed
- For patch versions:
  - Verify that only documentation has changed, not functionality

### 3. Changelog Generation
- Compare complete directories between versions
- Generate changelogs identifying added concepts, components, and presets
- For patch versions, identify documentation improvements

### 4. Specification Generation
- Generate JSON specification files for each domain/version/concept combination
- Create HTML documentation showing the relationships between versions and concepts
- Produce validation reports for any rule violations

## Processing Logic

### Version Comparison Algorithm

```js
function compareVersions(previousVersion, currentVersion) {
  const changes = {
    addedConcepts: [],
    addedComponents: {},
    addedPresets: {},
    modifiedDescriptions: {},
    hasBreakingChanges: false,
    breakingChanges: []
  };
  
  // Get all concepts in both versions
  const prevConcepts = getConceptsInVersion(previousVersion);
  const currConcepts = getConceptsInVersion(currentVersion);
  
  // Check for added concepts
  changes.addedConcepts = currConcepts.filter(c => !prevConcepts.includes(c));
  
  // Check for removed concepts (breaking change)
  const removedConcepts = prevConcepts.filter(c => !currConcepts.includes(c));
  if (removedConcepts.length > 0) {
    changes.hasBreakingChanges = true;
    removedConcepts.forEach(concept => {
      changes.breakingChanges.push(`Concept "${concept}" was removed`);
    });
  }
  
  // Check each concept that exists in both versions
  prevConcepts.filter(c => currConcepts.includes(c)).forEach(concept => {
    const prevComponents = getComponentsInConcept(previousVersion, concept);
    const currComponents = getComponentsInConcept(currentVersion, concept);
    
    // Check for added components
    const addedComponents = currComponents.filter(c => !prevComponents.includes(c));
    if (addedComponents.length > 0) {
      changes.addedComponents[concept] = addedComponents;
    }
    
    // Check for removed components (breaking change)
    const removedComponents = prevComponents.filter(c => !currComponents.includes(c));
    if (removedComponents.length > 0) {
      changes.hasBreakingChanges = true;
      removedComponents.forEach(component => {
        changes.breakingChanges.push(`Component "${component}" in concept "${concept}" was removed`);
      });
    }
    
    // Check components that exist in both versions
    prevComponents.filter(c => currComponents.includes(c)).forEach(component => {
      const prevPresets = getPresetsInComponent(previousVersion, concept, component);
      const currPresets = getPresetsInComponent(currentVersion, concept, component);
      
      // Check for added presets
      const addedPresets = currPresets.filter(p => !prevPresets.includes(p));
      if (addedPresets.length > 0) {
        if (!changes.addedPresets[concept]) changes.addedPresets[concept] = {};
        changes.addedPresets[concept][component] = addedPresets;
      }
      
      // Check for removed presets (breaking change)
      const removedPresets = prevPresets.filter(p => !currPresets.includes(p));
      if (removedPresets.length > 0) {
        changes.hasBreakingChanges = true;
        removedPresets.forEach(preset => {
          changes.breakingChanges.push(`Preset "${preset}" in component "${component}" of concept "${concept}" was removed`);
        });
      }
      
      // Check for description changes
      const prevDesc = getComponentDescription(previousVersion, concept, component);
      const currDesc = getComponentDescription(currentVersion, concept, component);
      
      if (prevDesc !== currDesc) {
        if (!changes.modifiedDescriptions[concept]) changes.modifiedDescriptions[concept] = {};
        changes.modifiedDescriptions[concept][component] = {
          previous: prevDesc,
          current: currDesc
        };
      }
      
      // Check preset descriptions
      prevPresets.filter(p => currPresets.includes(p)).forEach(preset => {
        const prevPresetDesc = getPresetDescription(previousVersion, concept, component, preset);
        const currPresetDesc = getPresetDescription(currentVersion, concept, component, preset);
        
        if (prevPresetDesc !== currPresetDesc) {
          if (!changes.modifiedDescriptions[concept]) changes.modifiedDescriptions[concept] = {};
          if (!changes.modifiedDescriptions[concept][component]) changes.modifiedDescriptions[concept][component] = {};
          if (!changes.modifiedDescriptions[concept][component].presets) changes.modifiedDescriptions[concept][component].presets = {};
          
          changes.modifiedDescriptions[concept][component].presets[preset] = {
            previous: prevPresetDesc,
            current: currPresetDesc
          };
        }
      });
    });
  });
  
  return changes;
}
```

### Wildcard Resolution

The build script will support wildcard resolution for interface specification:

```js
function resolveWildcard(domainMap, specifier) {
  // Parse specifier like "marketing/1.0.0/*"
  const [domain, version, conceptPattern] = specifier.split('/');
  
  // If not a wildcard, return as-is
  if (conceptPattern !== '*') {
    return [specifier];
  }
  
  // Get all concepts available in this domain/version
  const availableConcepts = Object.keys(domainMap[domain][version]);
  
  // Generate explicit specifiers for each concept
  return availableConcepts.map(concept => `${domain}/${version}/${concept}`);
}
```

## Build Process Integration

The build script will be integrated into the repository's workflow:

1. **Pre-commit validation**: Quick validation to prevent breaking changes
2. **CI/CD pipeline**: Full validation and specification generation
3. **Documentation generation**: Automatic updates to the documentation site

## Error Handling

The script will produce clear error messages for common issues:

1. **Breaking Change Error**: When a minor version removes or renames components
   ```
   ERROR: Breaking change detected in marketing/1.1.0
   - Component "Hero" was removed from concept "core"
   - Minor versions can only add components, never remove them
   ```

2. **Concept Consistency Error**: When a concept disappears in a later minor version
   ```
   ERROR: Concept consistency violation
   - Concept "media" exists in marketing/1.0.0
   - But is missing from marketing/1.1.0
   - Concepts must be available in all future minor versions
   ```

3. **Component Uniqueness Error**: When the same component appears in multiple concepts
   ```
   ERROR: Component uniqueness violation in marketing/1.0.0
   - Component "Hero" appears in both "core" and "media" concepts
   - Components must be unique across all concepts in a domain
   ```

## Command Line Interface

The build script will provide a command-line interface:

```
# Validate all versions
npm run validate

# Generate specifications
npm run build

# Compare two versions and generate changelog
npm run diff marketing 1.0.0 1.1.0

# Generate new version directory (creates complete copy of previous version)
npm run new-version marketing 1.1.0 1.2.0
```

## Helper Functions

The script will include utilities to assist with common tasks:

```js
// Create a new version directory from a previous version
function createNewVersion(domain, prevVersion, newVersion) {
  const prevPath = `interfaces/${domain}/${prevVersion}`;
  const newPath = `interfaces/${domain}/${newVersion}`;
  
  // Copy entire directory structure
  copyDirectoryRecursive(prevPath, newPath);
  
  // Update version numbers in all files
  updateVersionsInFiles(newPath, prevVersion, newVersion);
  
  console.log(`Created new version: ${newPath}`);
}
```

## Future Extensions

The build script architecture will support:

1. **Custom Validators**: Pluggable validation rules for specific requirements
2. **Output Formats**: Additional output formats beyond JSON and HTML
3. **Dependency Analysis**: Tools for analyzing component dependencies
4. **Migration Helpers**: Utilities for migrating between major versions
