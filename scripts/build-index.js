#!/usr/bin/env node

/**
 * Interface Index Builder
 *
 * Generates a comprehensive index.json catalog of all interfaces in the repository
 * This index is used by CLI tools and other consumers to discover available interfaces
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

// Handle ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

/**
 * Build the index of all interfaces
 */
async function buildIndex() {
  const interfaces = collectInterfaces();
  const drafts = collectDrafts();
  const extensions = collectExtensions();

  const index = {
    interfaces,
    drafts,
    extensions,
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(rootDir, "index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(
    `✅ Index built with ${interfaces.length} interfaces, ${drafts.length} drafts, and ${extensions.length} extensions`
  );
}

/**
 * Collect all stable interfaces
 * @returns {Array} Array of interface metadata
 */
function collectInterfaces() {
  const interfaceFiles = globSync("interfaces/**/*-v[0-9]*.[0-9]*.js", {
    cwd: rootDir,
  });

  return interfaceFiles
    .map((filePath) => {
      try {
        const content = fs.readFileSync(path.join(rootDir, filePath), "utf8");
        const interfaceObj = extractInterfaceObject(content);

        // Get the list of components
        const components = Object.keys(interfaceObj.components);

        return {
          id: interfaceObj.id,
          domain: interfaceObj.id.split("-v")[0],
          version: interfaceObj.version,
          path: `/${filePath}`,
          description: interfaceObj.description,
          components,
        };
      } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return null;
      }
    })
    .filter(Boolean); // Remove any nulls from errors
}

/**
 * Collect all draft interfaces
 * @returns {Array} Array of draft interface metadata
 */
function collectDrafts() {
  const draftFiles = globSync("drafts/**/*-v0.[0-9]*.js", { cwd: rootDir });

  return draftFiles
    .map((filePath) => {
      try {
        const content = fs.readFileSync(path.join(rootDir, filePath), "utf8");
        const interfaceObj = extractInterfaceObject(content);

        return {
          id: interfaceObj.id,
          domain: interfaceObj.id.split("-v")[0],
          version: interfaceObj.version,
          path: `/${filePath}`,
          description: interfaceObj.description,
          status: "draft",
        };
      } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Collect all extension pointers
 * @returns {Array} Array of extension metadata
 */
function collectExtensions() {
  const extensionFiles = globSync("extensions/**/*.json", { cwd: rootDir });

  return extensionFiles
    .map((filePath) => {
      try {
        const content = fs.readFileSync(path.join(rootDir, filePath), "utf8");
        const extensionObj = JSON.parse(content);

        return {
          name: extensionObj.name,
          version: extensionObj.version,
          description: extensionObj.description,
          repository: extensionObj.repository,
          path: extensionObj.path,
          extends: extensionObj.extends,
        };
      } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Extract the interface object from a JS file
 * @param {string} content File content
 * @returns {object} Extracted interface object
 */
function extractInterfaceObject(content) {
  // This is a simple approach - a more robust solution might use an actual JS parser
  const cleanedContent = content
    .replace(/export\s+default\s+/g, "")
    .replace(/\/\*\*[\s\S]*?\*\//g, "") // Remove JSDoc comments
    .replace(/\/\/.*$/gm, ""); // Remove single-line comments

  // Use eval in this controlled context to parse the JS object
  try {
    return eval(`(${cleanedContent})`);
  } catch (error) {
    throw new Error(`Failed to parse interface: ${error.message}`);
  }
}

// Run the index builder
buildIndex().catch((error) => {
  console.error(`Error building index: ${error.message}`);
  process.exit(1);
});
