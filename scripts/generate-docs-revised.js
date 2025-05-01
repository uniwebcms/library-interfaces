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
    const { id, definition, status } = interfaceInfo;
    
    // Extract base name and version
    const match = id.match(/^(.+)-v(\d+\.\d+)$/);
    if (!match) {
      console.warn(`Invalid interface ID format: ${id}`);
      return;
    }
    
    const [, baseName, version] = match;
    
    // Extract domain from interface name (prefix before first hyphen)
    const domain = baseName.split('-')[0];
    
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

/**
 * Write output files
 */
async function writeOutputFiles(masterJson) {
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

/**
 * Generate HTML for the main index page
 */
function generateIndexHtml(masterJson) {
  // Group interfaces by domain
  const domainGroups = {};
  
  Object.entries(masterJson.interfaces).forEach(([name, data]) => {
    const domain = data.domain;
    
    if (!domainGroups[domain]) {
      domainGroups[domain] = [];
    }
    
    const latestVersion = data.versions[data.latest];
    domainGroups[domain].push({
      name,
      description: latestVersion.description,
      category: latestVersion.category,
      status: data.status,
      latest: data.latest,
    });
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
    
    <section class="domains">
      <h2>Domains</h2>
      <div class="domain-grid">
        ${Object.keys(domainGroups).map(domain => `
          <div class="domain-card">
            <h3><a href="./${domain}/">${domain}</a></h3>
            <p>${domainGroups[domain].length} interfaces</p>
            <div class="card-footer">
              <a href="./${domain}/" class="button">View Domain</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    
    <section class="interfaces">
      <h2>All Interfaces</h2>
      <div class="interface-grid">
        ${Object.entries(masterJson.interfaces).map(([name, data]) => {
          const latestVersion = data.versions[data.latest];
          return `
            <div class="interface-card ${data.status}">
              <h3><a href="./${name}/">${name}</a></h3>
              <div class="interface-meta">
                <span class="badge ${data.status}">${data.status}</span>
                <span class="version">v${data.latest.split('v')[1]}</span>
                <span class="domain">${data.domain}</span>
              </div>
              <p>${latestVersion.description}</p>
              <div class="card-footer">
                <a href="./${name}/" class="button">View Details</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
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
 * Generate HTML for a domain page
 */
function generateDomainHtml(domainName, domainData, masterJson) {
  // Get interfaces in this domain
  const domainInterfaces = domainData.interfaces.map(interfaceName => {
    const interfaceData = masterJson.interfaces[interfaceName];
    const latestVersion = interfaceData.versions[interfaceData.latest];
    
    return {
      name: interfaceName,
      description: latestVersion.description,
      category: latestVersion.category,
      status: interfaceData.status,
      latest: interfaceData.latest,
    };
  });
  
  // Get all components in this domain
  const domainComponents = Object.entries(domainData.components).map(([componentName, interfaceName]) => {
    const interfaceData = masterJson.interfaces[interfaceName];
    const latestVersion = interfaceData.versions[interfaceData.latest];
    const component = latestVersion.components[componentName];
    
    return {
      name: componentName,
      interface: interfaceName,
      description: component.description,
      category: component.category,
      presets: Object.keys(component.presets).length,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${domainName} Domain - Uniweb Library Interfaces</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <header>
    <h1>${domainName} Domain</h1>
    <p>Semantic components for ${domainName} websites and applications</p>
  </header>
  
  <nav class="breadcrumb">
    <a href="../">Interfaces</a> &gt; <span>${domainName}</span>
  </nav>
  
  <main>
    <section class="domain-interfaces">
      <h2>Interfaces in ${domainName}</h2>
      <p>The ${domainName} domain includes ${domainInterfaces.length} complementary interfaces that work together.</p>
      
      <div class="interface-grid">
        ${domainInterfaces.map(iface => `
          <div class="interface-card ${iface.status}">
            <h3><a href="../${iface.name}/">${iface.name}</a></h3>
            <div class="interface-meta">
              <span class="badge ${iface.status}">${iface.status}</span>
              <span class="version">v${iface.latest.split('v')[1]}</span>
            </div>
            <p>${iface.description}</p>
            <div class="card-footer">
              <a href="../${iface.name}/" class="button">View Details</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    
    <section class="domain-components">
      <h2>Components in ${domainName}</h2>
      <p>The ${domainName} domain defines ${domainComponents.length} unique components across all interfaces.</p>
      
      <div class="component-table">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Interface</th>
              <th>Category</th>
              <th>Presets</th>
            </tr>
          </thead>
          <tbody>
            ${domainComponents.map(component => `
              <tr>
                <td><a href="../${component.interface}/#component-${component.name.toLowerCase()}">${component.name}</a></td>
                <td><a href="../${component.interface}/">${component.interface}</a></td>
                <td>${component.category}</td>
                <td>${component.presets}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
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
 * Generate HTML for an interface page
 */
function generateInterfaceHtml(interfaceName, interfaceData, masterJson) {
  const versions = Object.entries(interfaceData.versions)
    .map(([key, data]) => ({
      key,
      version: data.version,
      description: data.description,
    }))
    .sort((a, b) => semver.compare(b.version, a.version));
  
  const latestData = interfaceData.versions[interfaceData.latest];
  const domainData = masterJson.domains[interfaceData.domain];
  
  // Other interfaces in the same domain
  const relatedInterfaces = domainData.interfaces
    .filter(name => name !== interfaceName)
    .map(name => {
      const iface = masterJson.interfaces[name];
      const latest = iface.versions[iface.latest];
      return {
        name,
        description: latest.description,
        latest: iface.latest,
      };
    });
  
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
      <span class="domain"><a href="../${interfaceData.domain}/">${interfaceData.domain} domain</a></span>
    </div>
  </header>
  
  <nav class="breadcrumb">
    <a href="../">Interfaces</a> &gt; 
    <a href="../${interfaceData.domain}/">${interfaceData.domain}</a> &gt;
    <span>${interfaceName}</span>
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
    
    ${relatedInterfaces.length > 0 ? `
      <section class="related-interfaces">
        <h2>Related Interfaces</h2>
        <p>These interfaces in the ${interfaceData.domain} domain can be used alongside ${interfaceName}:</p>
        
        <div class="related-list">
          ${relatedInterfaces.map(related => `
            <div class="related-card">
              <h3><a href="../${related.name}/">${related.name}</a></h3>
              <p>${related.description}</p>
              <div class="card-footer">
                <a href="../${related.name}/${related.latest}.html" class="button">View Latest</a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}
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
  
  // Get interface data
  const interfaceData = masterJson.interfaces[interfaceName];
  const domainName = interfaceData.domain;
  
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
      <span class="domain"><a href="../${domainName}/">${domainName} domain</a></span>
    </div>
  </header>
  
  <nav class="breadcrumb">
    <a href="../">Interfaces</a> &gt; 
    <a href="../${domainName}/">${domainName}</a> &gt;
    <a href="./">${interfaceName}</a> &gt;
    <span>${versionKey}</span>
  </nav>
  
  <main>
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
    
    .badge.latest {
      background-color: var(--success-color);
      color: white;
    }
    
    /* Interface grid */
    .interface-grid, .domain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .interface-card, .domain-card, .related-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }
    
    .interface-card h3, .domain-card h3, .related-card h3 {
      margin-top: 0;
    }
    
    .interface-meta {
      display: flex;
      gap: 0.5rem;
      margin: 0.5rem 0 1rem;
      flex-wrap: wrap;
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
    
    /* Related interfaces */
    .related-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
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
    
    /* Component Table */
    .component-table {
      overflow-x: auto;
    }
    
    .component-table table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    
    .component-table th, .component-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    
    .component-table th {
      background-color: var(--light-bg);
      font-weight: bold;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }
      
      .interface-grid,
      .domain-grid,
      .version-list,
      .presets,
      .related-list {
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
main();.semver));
    
    // Skip if only one version exists
    if (versions.length <= 1) continue;
    
    const diffDir = path.join(CONFIG.outputDir, interfaceName, 'diffs');
    await fs.mkdir(diffDir, { recursive: true });
    
    // Generate diffs between adjacent versions
    for (let i = 1; i < versions.length; i++) {
      const oldVersion = versions[i-1];
      const newVersion = versions[i