/**
 * Documentation generator file output functions
 */

import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';

/**
 * Write output files
 */
export async function writeOutputFiles(masterJson, CONFIG) {
  // Write main interfaces.json
  await fs.writeFile(
    path.join(CONFIG.outputDir, 'interfaces.json'),
    JSON.stringify(masterJson, null, 2)
  );
  
  // Write domain files
  for (const [domainName, domainData] of Object.entries(masterJson.domains)) {
    await fs.writeFile(
      path.join(CONFIG.outputDir, `${domainName}.json`),
      JSON.stringify(domainData, null, 2)
    );
  }
  
  // Write individual interface files for each interface and version
  for (const [interfaceName, interfaceData] of Object.entries(masterJson.interfaces)) {
    const interfaceDir = path.join(CONFIG.outputDir, interfaceName);
    await fs.mkdir(interfaceDir, { recursive: true });
    
    // Write interface summary
    await fs.writeFile(
      path.join(interfaceDir, 'index.json'),
      JSON.stringify({
        name: interfaceName,
        latest: interfaceData.latest,
        versions: Object.keys(interfaceData.versions),
        status: interfaceData.status,
        domain: interfaceData.domain,
        concept: interfaceData.concept,
      }, null, 2)
    );
    
    // Write each version
    for (const [versionKey, versionData] of Object.entries(interfaceData.versions)) {
      await fs.writeFile(
        path.join(interfaceDir, `${versionKey}.json`),
        JSON.stringify(versionData, null, 2)
      );
    }
  }
  
  // Generate version diffs for minor versions
  await generateVersionDiffs(masterJson, CONFIG);
  
  // Generate HTML documentation
  await generateHtmlDocumentation(masterJson, CONFIG);
}

/**
 * Generate diff information between versions
 */
export async function generateVersionDiffs(masterJson, CONFIG) {
  for (const [interfaceName, interfaceData] of Object.entries(masterJson.interfaces)) {
    const versions = Object.keys(interfaceData.versions)
      .map(v => ({
        key: v,
        semver: interfaceData.versions[v].version
      }))
      .sort((a, b) => semver.compare(a.semver, b.semver));
    
    // Skip if only one version exists
    if (versions.length <= 1) continue;
    
    const diffDir = path.join(CONFIG.outputDir, interfaceName, 'diffs');
    await fs.mkdir(diffDir, { recursive: true });
    
    // Generate diffs between adjacent versions
    for (let i = 1; i < versions.length; i++) {
      const oldVersion = versions[i-1];
      const newVersion = versions[i];
      
      const oldData = interfaceData.versions[oldVersion.key];
      const newData = interfaceData.versions[newVersion.key];
      
      // Only generate diffs for minor/patch versions
      if (semver.major(oldData.version) !== semver.major(newData.version)) {
        continue; // Skip major version diffs
      }
      
      const diff = generateVersionDiff(oldData, newData);
      
      await fs.writeFile(
        path.join(diffDir, `${oldVersion.key}_to_${newVersion.key}.json`),
        JSON.stringify(diff, null, 2)
      );
    }
  }
}

/**
 * Generate diff between two interface versions
 */
export function generateVersionDiff(oldVersion, newVersion) {
  const diff = {
    from: oldVersion.version,
    to: newVersion.version,
    components: {
      added: [],
      removed: [],
      modified: []
    },
    presets: {
      added: [],
      removed: []
    }
  };
  
  // Find added/removed components
  const oldComponents = Object.keys(oldVersion.components);
  const newComponents = Object.keys(newVersion.components);
  
  diff.components.added = newComponents.filter(c => !oldComponents.includes(c));
  diff.components.removed = oldComponents.filter(c => !newComponents.includes(c));
  
  // Find modified components and preset changes
  for (const componentName of oldComponents) {
    if (!newComponents.includes(componentName)) continue;
    
    const oldComponent = oldVersion.components[componentName];
    const newComponent = newVersion.components[componentName];
    
    // Check if description changed
    const descriptionChanged = oldComponent.description !== newComponent.description;
    
    // Check preset changes
    const oldPresets = Object.keys(oldComponent.presets);
    const newPresets = Object.keys(newComponent.presets);
    
    const addedPresets = newPresets.filter(p => !oldPresets.includes(p));
    const removedPresets = oldPresets.filter(p => !newPresets.includes(p));
    
    // Check if any preset descriptions changed
    const presetDescriptionsChanged = oldPresets.some(p => {
      if (!newPresets.includes(p)) return false;
      return oldComponent.presets[p] !== newComponent.presets[p];
    });
    
    // If anything changed, add to modified list
    if (descriptionChanged || addedPresets.length > 0 || removedPresets.length > 0 || presetDescriptionsChanged) {
      diff.components.modified.push({
        name: componentName,
        descriptionChanged,
        presets: {
          added: addedPresets,
          removed: removedPresets,
          descriptionChanged: presetDescriptionsChanged
        }
      });
    }
    
    // Track all preset additions/removals
    for (const preset of addedPresets) {
      diff.presets.added.push(`${componentName}.${preset}`);
    }
    
    for (const preset of removedPresets) {
      diff.presets.removed.push(`${componentName}.${preset}`);
    }
  }
  
  return diff;
}

/**
 * Generate HTML documentation
 */
export async function generateHtmlDocumentation(masterJson, CONFIG) {
  const docsDir = path.join(CONFIG.outputDir, 'html');
  await fs.mkdir(docsDir, { recursive: true });
  
  // Generate index.html
  const indexHtml = generateIndexHtml(masterJson);
  await fs.writeFile(path.join(docsDir, 'index.html'), indexHtml);
  
  // Generate domain pages
  for (const [domainName, domainData] of Object.entries(masterJson.domains)) {
    const domainDir = path.join(docsDir, domainName);
    await fs.mkdir(domainDir, { recursive: true });
    
    // Generate domain index
    const domainHtml = generateDomainHtml(domainName, domainData, masterJson);
    await fs.writeFile(path.join(domainDir, 'index.html'), domainHtml);
  }
  
  // Generate interface pages
  for (const [interfaceName, interfaceData] of Object.entries(masterJson.interfaces)) {
    const interfaceDir = path.join(docsDir, interfaceName);
    await fs.mkdir(interfaceDir, { recursive: true });
    
    // Generate interface index
    const interfaceHtml = generateInterfaceHtml(interfaceName, interfaceData, masterJson);
    await fs.writeFile(path.join(interfaceDir, 'index.html'), interfaceHtml);
    
    // Generate version pages
    for (const [versionKey, versionData] of Object.entries(interfaceData.versions)) {
      const versionHtml = generateVersionHtml(interfaceName, versionKey, versionData, masterJson);
      await fs.writeFile(path.join(interfaceDir, `${versionKey}.html`), versionHtml);
    }
  }
  
  // Copy static assets
  await copyStaticAssets(docsDir);
}