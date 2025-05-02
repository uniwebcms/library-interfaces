#!/usr/bin/env node

/**
 * Library Interface Validator
 *
 * Validates interface definition files against the schema
 * Usage: node validate-interface.js path/to/interface.js
 */

import fs from "fs";
import path from "path";
import Ajv from "ajv";
import { fileURLToPath } from "url";

// Handle ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load schema
const schemaPath = path.resolve(__dirname, "../schema/interface.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

/**
 * Validate an interface file against the schema
 * @param {string} filePath Path to the interface file
 * @returns {object} Validation result with valid flag and any errors
 */
function validateInterface(filePath) {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Extract the JavaScript object from the file
    // This simple approach assumes the file exports a default object
    const interfaceStr = fileContent
      .replace(/export\s+default\s+/g, "")
      .replace(/\/\*\*[\s\S]*?\*\//g, "") // Remove JSDoc comments
      .replace(/\/\/.*$/gm, ""); // Remove single-line comments

    // Parse the interface object
    const interfaceObj = eval(`(${interfaceStr})`);

    // Validate against schema
    const valid = validate(interfaceObj);

    if (!valid) {
      return { valid: false, errors: validate.errors };
    }

    // Additional validation beyond schema
    const additionalErrors = validateAdditionalRules(interfaceObj);

    if (additionalErrors.length > 0) {
      return { valid: false, errors: additionalErrors };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: `Error processing file: ${error.message}` }],
    };
  }
}

/**
 * Perform additional validation beyond JSON Schema
 * @param {object} interfaceObj The interface object
 * @returns {Array} Array of validation errors
 */
function validateAdditionalRules(interfaceObj) {
  const errors = [];

  // Check ID matches filename convention
  const idParts = interfaceObj.id.split("-v");
  const domain = idParts[0];
  const version = idParts[1];

  // Check version in ID matches version property
  const versionMajorMinor = interfaceObj.version
    .split(".")
    .slice(0, 2)
    .join(".");

  if (version !== versionMajorMinor) {
    errors.push({
      message: `Version in ID (${version}) doesn't match version property (${versionMajorMinor})`,
    });
  }

  // Check for duplicate presets across components
  const allPresets = {};

  Object.entries(interfaceObj.components).forEach(
    ([componentName, component]) => {
      component.presets.forEach((preset) => {
        if (allPresets[preset]) {
          allPresets[preset].push(componentName);
        } else {
          allPresets[preset] = [componentName];
        }
      });
    }
  );

  // Flag presets that appear in multiple components as potential issues
  // (not errors, but worth reviewing)
  Object.entries(allPresets)
    .filter(([_, components]) => components.length > 1)
    .forEach(([preset, components]) => {
      errors.push({
        level: "warning",
        message: `Preset "${preset}" appears in multiple components: ${components.join(
          ", "
        )}. Consider if this is intentional.`,
      });
    });

  return errors;
}

/**
 * Format validation errors for display
 * @param {Array} errors Validation errors
 * @returns {string} Formatted error message
 */
function formatErrors(errors) {
  return errors
    .map((err) => {
      if (err.dataPath) {
        return `${err.dataPath}: ${err.message}`;
      }
      return err.message;
    })
    .join("\n");
}

// Run as CLI tool when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node validate-interface.js path/to/interface.js");
    process.exit(1);
  }

  const filePath = args[0];
  const result = validateInterface(filePath);

  if (result.valid) {
    console.log(`✅ ${filePath} is valid`);
    process.exit(0);
  } else {
    console.error(`❌ ${filePath} has validation errors:`);
    console.error(formatErrors(result.errors));
    process.exit(1);
  }
}

export { validateInterface };
