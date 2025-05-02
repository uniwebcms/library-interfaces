/**
 * Detects changes between two versions of an interface
 * Usage: node detect-changes.js <domain> <from-version> <to-version>
 * Example: node detect-changes.js marketing 1.0.0 1.1.0
 */

import fs from "fs".promises;
import path from "path";

// Get command line arguments
const [domain, fromVersion, toVersion] = process.argv.slice(2);

if (!domain || !fromVersion || !toVersion) {
  console.error(
    "Usage: node detect-changes.js <domain> <from-version> <to-version>"
  );
  process.exit(1);
}

async function detectChanges() {
  const sourceDir = path.join("interfaces", domain, fromVersion);
  const targetDir = path.join("interfaces", domain, toVersion);

  // Load all interface files
  const sourceInterfaces = await loadInterfaces(sourceDir);
  const targetInterfaces = await loadInterfaces(targetDir);

  // Compare interfaces
  const changes = compareInterfaces(sourceInterfaces, targetInterfaces);

  // Generate changelog entry
  const changelogEntry = generateChangelogEntry(changes, toVersion);

  console.log("Detected Changes:");
  console.log(changelogEntry);

  // Option to write to CHANGELOG.md
  const changelogPath = path.join("interfaces", domain, "CHANGELOG.md");
  await prependToChangelog(changelogPath, changelogEntry);
}

async function loadInterfaces(directory) {
  const interfaces = {};
  const conceptDirs = await fs.readdir(directory, { withFileTypes: true });

  for (const conceptDir of conceptDirs.filter((entry) => entry.isDirectory())) {
    const concept = conceptDir.name;
    const conceptPath = path.join(directory, concept);
    const files = await fs.readdir(conceptPath);

    for (const file of files.filter((f) => f.endsWith(".js"))) {
      const filePath = path.join(conceptPath, file);
      const content = await fs.readFile(filePath, "utf8");

      // Extract interface data (simplified - in reality you'd use a proper parser)
      // This is a placeholder for actual code that would parse the JS file
      const componentRegex = /(\w+):\s*{[^}]*description:\s*["']([^"']+)["']/g;
      const components = {};
      let match;

      while ((match = componentRegex.exec(content)) !== null) {
        const [, componentName, description] = match;
        components[componentName] = { description };
      }

      interfaces[`${concept}/${file}`] = { components };
    }
  }

  return interfaces;
}

function compareInterfaces(sourceInterfaces, targetInterfaces) {
  const changes = {
    added: {
      concepts: [],
      components: [],
      presets: [],
    },
    modified: {
      components: [],
      presets: [],
    },
    removed: {
      concepts: [],
      components: [],
      presets: [],
    },
  };

  // Find added and modified concepts
  for (const [targetKey, targetInterface] of Object.entries(targetInterfaces)) {
    if (!sourceInterfaces[targetKey]) {
      const concept = targetKey.split("/")[0];
      changes.added.concepts.push(concept);

      // All components in a new concept are considered added
      for (const component of Object.keys(targetInterface.components)) {
        changes.added.components.push(`${concept}/${component}`);
      }
    } else {
      // Compare components within existing concepts
      const sourceInterface = sourceInterfaces[targetKey];

      for (const [componentName, componentData] of Object.entries(
        targetInterface.components
      )) {
        if (!sourceInterface.components[componentName]) {
          changes.added.components.push(`${targetKey}/${componentName}`);
        } else if (
          componentData.description !==
          sourceInterface.components[componentName].description
        ) {
          changes.modified.components.push(`${targetKey}/${componentName}`);
        }
      }
    }
  }

  // Find removed concepts and components
  for (const [sourceKey, sourceInterface] of Object.entries(sourceInterfaces)) {
    if (!targetInterfaces[sourceKey]) {
      const concept = sourceKey.split("/")[0];
      changes.removed.concepts.push(concept);

      // All components in a removed concept are considered removed
      for (const component of Object.keys(sourceInterface.components)) {
        changes.removed.components.push(`${concept}/${component}`);
      }
    } else {
      // Find removed components within existing concepts
      const targetInterface = targetInterfaces[sourceKey];

      for (const componentName of Object.keys(sourceInterface.components)) {
        if (!targetInterface.components[componentName]) {
          changes.removed.components.push(`${sourceKey}/${componentName}`);
        }
      }
    }
  }

  return changes;
}

function generateChangelogEntry(changes, version) {
  const date = new Date().toISOString().split("T")[0];

  let entry = `## ${version} - ${date}\n\n`;

  if (changes.added.concepts.length > 0) {
    entry += `### Added Concepts\n\n`;
    for (const concept of changes.added.concepts) {
      entry += `- ${concept}\n`;
    }
    entry += "\n";
  }

  if (changes.added.components.length > 0) {
    entry += `### Added Components\n\n`;
    for (const component of changes.added.components) {
      entry += `- ${component}\n`;
    }
    entry += "\n";
  }

  if (changes.modified.components.length > 0) {
    entry += `### Modified Components\n\n`;
    for (const component of changes.modified.components) {
      entry += `- ${component}\n`;
    }
    entry += "\n";
  }

  if (changes.removed.components.length > 0) {
    entry += `### Removed Components\n\n`;
    for (const component of changes.removed.components) {
      entry += `- ${component}\n`;
    }
    entry += "\n";
  }

  if (changes.removed.concepts.length > 0) {
    entry += `### Removed Concepts\n\n`;
    for (const concept of changes.removed.concepts) {
      entry += `- ${concept}\n`;
    }
    entry += "\n";
  }

  return entry;
}

async function prependToChangelog(changelogPath, entry) {
  let content = "";

  try {
    content = await fs.readFile(changelogPath, "utf8");
  } catch (err) {
    // File doesn't exist, create it with a header
    content = "# Changelog\n\n";
  }

  // Prepend the new entry
  content = content.replace("# Changelog\n\n", `# Changelog\n\n${entry}`);

  await fs.writeFile(changelogPath, content);
  console.log(`Updated ${changelogPath}`);
}

detectChanges().catch((err) => {
  console.error("Error detecting changes:", err);
  process.exit(1);
});
