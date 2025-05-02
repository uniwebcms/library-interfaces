// Create a proper index.js in the root
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Export key file paths
export const paths = {
  interfaces: path.join(__dirname, "interfaces"),
  drafts: path.join(__dirname, "drafts"),
  schema: path.join(__dirname, "schema", "interface-schema.json"),
};

// Export version utilities
export { default as version } from "./scripts/version-utils.js";

// Export validation utilities
export { default as validate } from "./scripts/validation-utils.js";
