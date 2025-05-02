/**
 * Generates documentation and API JSON files
 * Usage: node generate-docs.js
 */

import fs from "fs".promises;
import path from "path";

async function generateDocs() {
  console.log("Generating documentation...");

  // Create docs directory structure
  await fs.mkdir(path.join("docs", "api"), { recursive: true });

  // Generate master interfaces.json
  const masterData = await generateMasterData();
  await fs.writeFile(
    path.join("docs", "api", "interfaces.json"),
    JSON.stringify(masterData, null, 2)
  );

  // Generate domain-specific docs
  for (const domain of Object.keys(masterData)) {
    for (const version of Object.keys(masterData[domain])) {
      const domainDir = path.join("docs", "api", domain);
      const versionDir = path.join(domainDir, version);

      await fs.mkdir(versionDir, { recursive: true });

      // Write domain+version specific JSON
      await fs.writeFile(
        path.join(versionDir, "index.json"),
        JSON.stringify(masterData[domain][version], null, 2)
      );
    }
  }

  console.log("✅ Documentation generated successfully");
}

async function generateMasterData() {
  const masterData = {};
  const interfacesDir = path.join("interfaces");
  const domains = await fs.readdir(interfacesDir, { withFileTypes: true });

  for (const domain of domains.filter((entry) => entry.isDirectory())) {
    masterData[domain.name] = {};

    const domainPath = path.join(interfacesDir, domain.name);
    const versions = await fs.readdir(domainPath, { withFileTypes: true });

    for (const version of versions.filter((entry) => entry.isDirectory())) {
      masterData[domain.name][version.name] = {
        version: version.name,
        concepts: {},
      };

      const versionPath = path.join(domainPath, version.name);
      const concepts = await fs.readdir(versionPath, { withFileTypes: true });

      for (const concept of concepts.filter((entry) => entry.isDirectory())) {
        masterData[domain.name][version.name].concepts[concept.name] = {
          interfaces: {},
        };

        const conceptPath = path.join(versionPath, concept.name);
        const files = await fs.readdir(conceptPath);

        for (const file of files.filter((f) => f.endsWith(".js"))) {
          const filePath = path.join(conceptPath, file);
          const content = await fs.readFile(filePath, "utf8");

          // Parse the interface (simplified)
          const interfaceData = extractInterfaceData(content);
          masterData[domain.name][version.name].concepts[
            concept.name
          ].interfaces[file] = interfaceData;
        }
      }
    }
  }

  return masterData;
}

function extractInterfaceData(content) {
  // Simplified extraction - a real implementation would use a JavaScript parser
  const categoryMatch = content.match(/category:\s*["']([^"']+)["']/);
  const versionMatch = content.match(/version:\s*["']([^"']+)["']/);
  const descriptionMatch = content.match(/description:\s*["']([^"']+)["']/);

  const components = {};
  const componentRegex = /(\w+):\s*{[^}]*description:\s*["']([^"']+)["']/g;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    const [, componentName, description] = match;
    components[componentName] = {
      description,
      presets: extractPresets(content, componentName),
    };
  }

  return {
    category: categoryMatch ? categoryMatch[1] : "",
    version: versionMatch ? versionMatch[1] : "",
    description: descriptionMatch ? descriptionMatch[1] : "",
    components,
  };
}

function extractPresets(content, componentName) {
  // Simplified extraction of presets
  const presets = {};
  const presetsSection = content.match(
    new RegExp(`${componentName}[^}]*presets:\\s*{([^}]+)}`)
  );

  if (presetsSection) {
    const presetMatches = presetsSection[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g);

    for (const presetMatch of presetMatches) {
      const [, presetName, presetDescription] = presetMatch;
      presets[presetName] = presetDescription;
    }
  }

  return presets;
}

generateDocs().catch((err) => {
  console.error("Error generating documentation:", err);
  process.exit(1);
});
