/**
 * Library Interfaces Documentation Generator
 * 
 * This script processes interface definition files and generates:
 * 1. A master JSON file with all interfaces and versions
 * 2. Validation reports for interface compliance
 * 3. HTML documentation for GitHub Pages
 */

import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { glob } from 'glob';
import semver from 'semver';
import prettier from 'prettier';

// Configuration
const CONFIG = {
  interfacesDir: './interfaces',
  draftsDir: './drafts',
  extensionsDir: './extensions',
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
  const stableFiles = await glob(`${CONFIG.interfacesDir}/**/*-v*.js`);
  
  // Find draft interface files
  const draftFiles = await glob(`${CONFIG.draftsDir}/**/*-v*.js`);
  
  // Find extension interface files
  const extensionFiles = await glob(`${CONFIG.extensionsDir}/**/*-v*.js`);
  
  return [...stableFiles, ...draftFiles, ...extensionFiles];
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
 * Determine interface status from its path
 */
function getStatusFromPath(filePath) {
  if (filePath.includes(CONFIG.draftsDir)) {
    return 'draft';
  } else if (filePath.includes(CONFIG.extensionsDir)) {
    return 'extension';
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
    meta: {
      lastUpdated: new Date().toISOString(),
      totalInterfaces: 0,
      totalComponents: 0,
    },
  };
  
  // Group interfaces by base name (without version)
  const groupedInterfaces = {};
  
  interfaces.forEach(interfaceInfo => {
    const { id, definition, status } = interfaceInfo;
    
    // Extract base name and version
    const match = id.match(/^(.+)-v(\d+\.\d+)$/);
    if (!match) {
      console.warn(`Invalid interface ID format: ${id}`);
      return;
    }
    
    const [, baseName, version] = match;
    
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
        extends: definition.extends || [],
      };
      
      // Update component count
      result.meta.totalComponents += Object.keys(definition.components).length;
    });
    
    // Update interface count
    result.meta.totalInterfaces++;
  });
  
  return result;
}

/**
 * Write output files
 */
async function writeOutputFiles(masterJson) {
  // Write main interfaces.json
  await fs.writeFile(
    path.join(CONFIG.outputDir, 'interfaces.json'),
    JSON.stringify(masterJson, null, 2)
  );
  
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
  await generateVersionDiffs(masterJson);
  
  // Generate HTML documentation
  await generateHtmlDocumentation(masterJson);
}

/**
 * Generate diff information between versions
 */
async function generateVersionDiffs(masterJson) {
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
function generateVersionDiff(oldVersion, newVersion) {
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
async function generateHtmlDocumentation(masterJson) {
  const docsDir = path.join(CONFIG.outputDir, 'html');
  await fs.mkdir(docsDir, { recursive: true });
  
  // Generate index.html
  const indexHtml = generateIndexHtml(masterJson);
  await fs.writeFile(path.join(docsDir, 'index.html'), indexHtml);
  
  // Generate interface pages
  for (const [interfaceName, interfaceData] of Object.entries(masterJson.interfaces)) {
    const interfaceDir = path.join(docsDir, interfaceName);
    await fs.mkdir(interfaceDir, { recursive: true });
    
    // Generate interface index
    const interfaceHtml = generateInterfaceHtml(interfaceName, interfaceData);
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

/**
 * Generate HTML for the main index page
 */
function generateIndexHtml(masterJson) {
  const interfaces = Object.entries(masterJson.interfaces).map(([name, data]) => {
    const latestVersion = data.versions[data.latest];
    return {
      name,
      description: latestVersion.description,
      category: latestVersion.category,
      status: data.status,
      latest: data.latest,
    };
  });
  
  // Group interfaces by category
  const categories = {};
  interfaces.forEach(iface => {
    if (!categories[iface.category]) {
      categories[iface.category] = [];
    }
    categories[iface.category].push(iface);
  });
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uniweb Library Interfaces</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <header>
    <h1>Uniweb Library Interfaces</h1>
    <p>Semantic component standards for purpose-built component libraries</p>
  </header>
  
  <main>
    <section class="summary">
      <h2>Interface Registry</h2>
      <p>Total Interfaces: ${masterJson.meta.totalInterfaces}</p>
      <p>Total Components: ${masterJson.meta.totalComponents}</p>
      <p>Last Updated: ${new Date(masterJson.meta.lastUpdated).toLocaleString()}</p>
    </section>
    
    <section class="categories">
      ${Object.entries(categories).map(([category, interfaces]) => `
        <div class="category">
          <h2>${category}</h2>
          <div class="interface-grid">
            ${interfaces.map(iface => `
              <div class="interface-card ${iface.status}">
                <h3><a href="./${iface.name}/">${iface.name}</a></h3>
                <div class="interface-meta">
                  <span class="badge ${iface.status}">${iface.status}</span>
                  <span class="version">v${iface.latest}</span>
                </div>
                <p>${iface.description}</p>
                <div class="card-footer">
                  <a href="./${iface.name}/" class="button">View Details</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} Uniweb Framework</p>
  </footer>

  <script src="./main.js"></script>
</body>
</html>`;
}

/**
 * Generate HTML for an interface page
 */
function generateInterfaceHtml(interfaceName, interfaceData) {
  const versions = Object.entries(interfaceData.versions)
    .map(([key, data]) => ({
      key,
      version: data.version,
      description: data.description,
    }))
    .sort((a, b) => semver.compare(b.version, a.version));
  
  const latestData = interfaceData.versions[interfaceData.latest];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${interfaceName} - Uniweb Library Interfaces</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <header>
    <h1>${interfaceName}</h1>
    <p>${latestData.description}</p>
    <div class="interface-meta">
      <span class="badge ${interfaceData.status}">${interfaceData.status}</span>
      <span class="category">${latestData.category}</span>
    </div>
  </header>
  
  <nav class="breadcrumb">
    <a href="../">Interfaces</a> &gt; <span>${interfaceName}</span>
  </nav>
  
  <main>
    <section class="versions">
      <h2>Available Versions</h2>
      <div class="version-list">
        ${versions.map(v => `
          <div class="version-card ${v.key === interfaceData.latest ? 'latest' : ''}">
            <h3>
              <a href="./${v.key}.html">v${v.version}</a>
              ${v.key === interfaceData.latest ? '<span class="badge latest">Latest</span>' : ''}
            </h3>
            <p>${v.description}</p>
            <div class="card-footer">
              <a href="./${v.key}.html" class="button">View Details</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} Uniweb Framework</p>
  </footer>

  <script src="../main.js"></script>
</body>
</html>`;
}

/**
 * Generate HTML for a specific interface version
 */
function generateVersionHtml(interfaceName, versionKey, versionData, masterJson) {
  // Extract component categories
  const categories = {};
  
  Object.entries(versionData.components).forEach(([componentName, component]) => {
    const category = component.category || 'Uncategorized';
    
    if (!categories[category]) {
      categories[category] = [];
    }
    
    categories[category].push({
      name: componentName,
      ...component,
    });
  });
  
  // Sort components within categories
  Object.values(categories).forEach(components => {
    components.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${interfaceName} ${versionKey} - Uniweb Library Interfaces</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <header>
    <h1>${interfaceName} ${versionKey}</h1>
    <p>${versionData.description}</p>
    <div class="interface-meta">
      <span class="badge ${versionData.status}">${versionData.status}</span>
      <span class="version">v${versionData.version}</span>
      <span class="category">${versionData.category}</span>
    </div>
  </header>
  
  <nav class="breadcrumb">
    <a href="../">Interfaces</a> &gt; 
    <a href="./">${interfaceName}</a> &gt;
    <span>${versionKey}</span>
  </nav>
  
  <main>
    ${versionData.extends && versionData.extends.length > 0 ? `
      <section class="extends">
        <h2>Extends</h2>
        <ul class="extensions-list">
          ${versionData.extends.map(ext => `<li><a href="../${ext.split('-v')[0]}/${ext.split('-')[1]}.html">${ext}</a></li>`).join('')}
        </ul>
      </section>
    ` : ''}
  
    <section class="toc">
      <h2>Contents</h2>
      <ul>
        ${Object.keys(categories).map(category => 
          `<li><a href="#category-${category.toLowerCase().replace(/\s+/g, '-')}">${category}</a></li>`
        ).join('')}
      </ul>
    </section>
    
    ${Object.entries(categories).map(([category, components]) => `
      <section class="component-category" id="category-${category.toLowerCase().replace(/\s+/g, '-')}">
        <h2>${category}</h2>
        
        ${components.map(component => `
          <div class="component" id="component-${component.name.toLowerCase()}">
            <h3>${component.name}</h3>
            <p class="component-description">${component.description}</p>
            
            <h4>Presets</h4>
            <div class="presets">
              ${Object.entries(component.presets).map(([preset, description]) => `
                <div class="preset">
                  <code>${preset}</code>
                  <p>${description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </section>
    `).join('')}
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} Uniweb Framework</p>
  </footer>
  
  <script src="../main.js"></script>
</body>
</html>`;
}

/**
 * Copy static assets for the documentation site
 */
async function copyStaticAssets(docsDir) {
  // Create styles.css
  const css = `
    /* Base styles */
    :root {
      --primary-color: #4a6ee0;
      --secondary-color: #6c87d8;
      --text-color: #333;
      --light-bg: #f5f7fa;
      --card-bg: #fff;
      --border-color: #eaeaea;
      --success-color: #28a745;
      --warning-color: #ffc107;
      --draft-color: #6c757d;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--light-bg);
      margin: 0;
      padding: 0;
    }
    
    header {
      background-color: var(--primary-color);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    header h1 {
      margin: 0;
      font-size: 2.5rem;
    }
    
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    footer {
      text-align: center;
      padding: 1rem;
      background-color: var(--text-color);
      color: white;
    }
    
    a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    .button {
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: white;
      border-radius: 4px;
      text-decoration: none;
    }
    
    .button:hover {
      background-color: var(--secondary-color);
      text-decoration: none;
    }
    
    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .badge.stable {
      background-color: var(--success-color);
      color: white;
    }
    
    .badge.draft {
      background-color: var(--draft-color);
      color: white;
    }
    
    .badge.extension {
      background-color: var(--warning-color);
      color: black;
    }
    
    .badge.latest {
      background-color: var(--success-color);
      color: white;
    }
    
    /* Interface grid */
    .interface-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .interface-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }
    
    .interface-card h3 {
      margin-top: 0;
    }
    
    .interface-meta {
      display: flex;
      gap: 0.5rem;
      margin: 0.5rem 0 1rem;
    }
    
    .card-footer {
      margin-top: auto;
      padding-top: 1rem;
    }
    
    /* Versions */
    .version-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .version-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .version-card.latest {
      border: 2px solid var(--success-color);
    }
    
    /* Components */
    .component {
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .component h3 {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    
    .presets {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .preset {
      background-color: var(--light-bg);
      border-radius: 4px;
      padding: 1rem;
    }
    
    .preset code {
      display: inline-block;
      font-family: monospace;
      background-color: rgba(0, 0, 0, 0.05);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-weight: bold;
    }
    
    /* Navigation */
    .breadcrumb {
      background-color: var(--card-bg);
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    
    /* Table of Contents */
    .toc {
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .toc ul {
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    /* Extensions */
    .extensions-list {
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .extensions-list li {
      background-color: var(--light-bg);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }
      
      .interface-grid,
      .version-list,
      .presets {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  await fs.writeFile(path.join(docsDir, 'styles.css'), css);
  
  // Create main.js
  const js = `
    // Add interactivity to the documentation site
    document.addEventListener('DOMContentLoaded', function() {
      // Add copy functionality for preset codes
      document.querySelectorAll('.preset code').forEach(function(codeElement) {
        codeElement.addEventListener('click', function() {
          navigator.clipboard.writeText(this.textContent).then(function() {
            // Show a temporary tooltip
            const tooltip = document.createElement('span');
            tooltip.textContent = 'Copied!';
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0,0,0,0.7)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '4px 8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '1000';
            tooltip.style.top = (codeElement.offsetTop - 20) + 'px';
            tooltip.style.left = codeElement.offsetLeft + 'px';
            
            document.body.appendChild(tooltip);
            
            setTimeout(function() {
              document.body.removeChild(tooltip);
            }, 1500);
          });
        });
      });
    });
  `;
  
  await fs.writeFile(path.join(docsDir, 'main.js'), js);
}

// Run the script
main();