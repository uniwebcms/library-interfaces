/**
 * Documentation generator HTML rendering functions
 */

import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';

/**
 * Generate HTML for the main index page
 */
export function generateIndexHtml(masterJson) {
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
      concept: data.concept,
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
                <span class="domain"><a href="./${data.domain}/">${data.domain}</a></span>
                <span class="concept">${data.concept}</span>
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
export function generateDomainHtml(domainName, domainData, masterJson) {
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
      concept: interfaceData.concept,
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
      concept: interfaceData.concept,
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
              <span class="concept">${iface.concept}</span>
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
export function generateInterfaceHtml(interfaceName, interfaceData, masterJson) {
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
        concept: iface.concept,
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
      <span class="concept">${interfaceData.concept}</span>
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
              <div class="concept-tag">${related.concept}</div>
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
export function generateVersionHtml(interfaceName, versionKey, versionData, masterJson) {
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
      <span class="concept">${interfaceData.concept}</span>
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