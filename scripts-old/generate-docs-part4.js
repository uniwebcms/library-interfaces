/**
 * Documentation generator static assets
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Copy static assets for the documentation site
 */
export async function copyStaticAssets(docsDir) {
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
    
    /* Concept tag */
    .concept-tag, .concept {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      background-color: var(--light-bg);
      border: 1px solid var(--border-color);
      font-family: monospace;
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