/**
 * Library Interfaces
 *
 * This module exports utilities for working with Library Interfaces.
 */

const path = require("path");

// Export key file paths
exports.paths = {
  interfaces: path.join(__dirname, "interfaces"),
  drafts: path.join(__dirname, "drafts"),
  schema: path.join(__dirname, "schema", "interface-schema.json"),
};

// Export version utilities
exports.version = require("./scripts/version-utils");

// Export validation utilities
exports.validate = require("./scripts/validation-utils");
