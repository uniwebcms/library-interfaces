/**
 * Creates a new version of an interface by duplicating an existing version
 * Usage: node create-version.js <domain> <from-version> <to-version>
 * Example: node create-version.js marketing 1.0.0 1.1.0
 */

import fs from "fs".promises;
import path from "path";

// Get command line arguments
const [domain, fromVersion, toVersion] = process.argv.slice(2);

if (!domain || !fromVersion || !toVersion) {
  console.error(
    "Usage: node create-version.js <domain> <from-version> <to-version>"
  );
  process.exit(1);
}

async function createNewVersion() {
  const sourceDir = path.join("interfaces", domain, fromVersion);
  const targetDir = path.join("interfaces", domain, toVersion);

  // Check if source directory exists
  try {
    await fs.access(sourceDir);
  } catch (err) {
    console.error(`Source directory ${sourceDir} does not exist.`);
    process.exit(1);
  }

  // Check if target directory already exists
  try {
    await fs.access(targetDir);
    console.error(`Target directory ${targetDir} already exists.`);
    process.exit(1);
  } catch (err) {
    // This is actually good - we want the target to not exist yet
  }

  console.log(`Creating new version: ${domain} ${fromVersion} → ${toVersion}`);

  // Create the target directory
  await fs.mkdir(targetDir, { recursive: true });

  // Copy all files and update version numbers
  await copyAndUpdateDirectory(sourceDir, targetDir);

  console.log(`✅ Successfully created ${toVersion} from ${fromVersion}`);
  console.log(`Don't forget to document changes in CHANGELOG.md`);
}

async function copyAndUpdateDirectory(sourceDir, targetDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directories
      await fs.mkdir(targetPath, { recursive: true });
      await copyAndUpdateDirectory(sourcePath, targetPath);
    } else {
      // Copy and update files
      let content = await fs.readFile(sourcePath, "utf8");

      // Update version in file
      if (entry.name.endsWith(".js")) {
        // Update the version in the file content
        content = content.replace(
          /version: ["'][\d\.]+["']/g,
          `version: "${toVersion}"`
        );
      }

      await fs.writeFile(targetPath, content);
    }
  }
}

createNewVersion().catch((err) => {
  console.error("Error creating new version:", err);
  process.exit(1);
});
