/**
 * Validates all interfaces against schema and rules
 * Usage: node validate-interfaces.js
 */

const fs = require("fs").promises;
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();

async function validateInterfaces() {
  console.log("Validating interfaces...");

  // Load the schema
  const schemaPath = path.join("schema", "interface-schema.json");
  const schema = JSON.parse(await fs.readFile(schemaPath, "utf8"));
  const validate = ajv.compile(schema);

  // Get all domains
  const interfacesDir = path.join("interfaces");
  const domains = await fs.readdir(interfacesDir, { withFileTypes: true });

  let allValid = true;
  const domainComponents = {};

  // Validate each domain and version
  for (const domain of domains.filter((entry) => entry.isDirectory())) {
    const domainPath = path.join(interfacesDir, domain.name);
    const versions = await fs.readdir(domainPath, { withFileTypes: true });

    for (const version of versions.filter((entry) => entry.isDirectory())) {
      const versionPath = path.join(domainPath, version.name);
      const concepts = await fs.readdir(versionPath, { withFileTypes: true });

      // Keep track of components in this domain+version for overlap checking
      if (!domainComponents[`${domain.name}/${version.name}`]) {
        domainComponents[`${domain.name}/${version.name}`] = new Set();
      }

      for (const concept of concepts.filter((entry) => entry.isDirectory())) {
        const conceptPath = path.join(versionPath, concept.name);
        const files = await fs.readdir(conceptPath);

        for (const file of files.filter((f) => f.endsWith(".js"))) {
          const filePath = path.join(conceptPath, file);

          // Load and validate the interface file
          const valid = await validateInterfaceFile(
            filePath,
            validate,
            domain.name,
            version.name,
            concept.name,
            domainComponents[`${domain.name}/${version.name}`]
          );

          if (!valid) {
            allValid = false;
          }
        }
      }
    }
  }

  return allValid;
}

async function validateInterfaceFile(
  filePath,
  validate,
  domain,
  version,
  concept,
  existingComponents
) {
  console.log(`Validating ${filePath}...`);

  try {
    // For simplicity, we're assuming the interface files can be required directly
    // In a real implementation, you might need to use a JavaScript parser
    // This is a placeholder for actual file loading
    const content = await fs.readFile(filePath, "utf8");

    // Extract the interface object (simplified approach)
    const interfaceObject = extractInterfaceObject(content);

    // Schema validation
    const valid = validate(interfaceObject);
    if (!valid) {
      console.error(`Schema validation failed for ${filePath}:`);
      console.error(validate.errors);
      return false;
    }

    // Check if version in file matches directory
    if (interfaceObject.version !== version) {
      console.error(
        `Version mismatch in ${filePath}: Expected ${version}, got ${interfaceObject.version}`
      );
      return false;
    }

    // Check if category matches domain
    if (interfaceObject.category !== domain) {
      console.error(
        `Category mismatch in ${filePath}: Expected ${domain}, got ${interfaceObject.category}`
      );
      return false;
    }

    // Check component naming conventions (PascalCase)
    for (const componentName of Object.keys(interfaceObject.components)) {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
        console.error(
          `Invalid component name in ${filePath}: ${componentName} (should be PascalCase)`
        );
        return false;
      }

      // Check for component overlap
      if (existingComponents.has(componentName)) {
        console.error(
          `Component ${componentName} in ${filePath} overlaps with another interface in the same domain+version`
        );
        return false;
      }

      existingComponents.add(componentName);

      // Check preset naming conventions (kebab-case or lowercase)
      const presets = interfaceObject.components[componentName].presets;
      for (const presetName of Object.keys(presets)) {
        if (!/^[a-z][a-z0-9-]*$/.test(presetName)) {
          console.error(
            `Invalid preset name in ${filePath}: ${componentName}.${presetName} (should be kebab-case or lowercase)`
          );
          return false;
        }
      }
    }

    console.log(`✅ ${filePath} is valid`);
    return true;
  } catch (err) {
    console.error(`Error validating ${filePath}:`, err);
    return false;
  }
}

function extractInterfaceObject(content) {
  // This is a simplified approach - in a real implementation,
  // you would use a JavaScript parser
  // For now, we'll just create a dummy object based on patterns
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

validateInterfaces()
  .then((allValid) => {
    if (allValid) {
      console.log("✅ All interfaces are valid");
      process.exit(0);
    } else {
      console.error("❌ Some interfaces failed validation");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Error validating interfaces:", err);
    process.exit(1);
  });
