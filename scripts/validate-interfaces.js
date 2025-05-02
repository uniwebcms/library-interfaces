/**
 * Validates all interfaces against schema and rules
 * Usage: node validate-interfaces.js
 */

import fs from "fs".promises;
import path from "path";
import Ajv from "ajv";
const ajv = new Ajv();
import chalk from "chalk";

async function validateInterfaces() {
  console.log(chalk.blue("Validating interfaces..."));

  // Load the schema
  const schemaPath = path.join("schema", "interface-schema.json");
  try {
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

    // Validate draft interfaces if they exist
    try {
      const draftsDir = path.join("drafts");
      const draftStat = await fs.stat(draftsDir);

      if (draftStat.isDirectory()) {
        console.log(chalk.blue("\nValidating draft interfaces..."));
        const draftDomains = await fs.readdir(draftsDir, {
          withFileTypes: true,
        });

        for (const draftDomain of draftDomains.filter((entry) =>
          entry.isDirectory()
        )) {
          const draftDomainPath = path.join(draftsDir, draftDomain.name);
          const draftVersions = await fs.readdir(draftDomainPath, {
            withFileTypes: true,
          });

          for (const draftVersion of draftVersions.filter((entry) =>
            entry.isDirectory()
          )) {
            const draftVersionPath = path.join(
              draftDomainPath,
              draftVersion.name
            );
            const draftConcepts = await fs.readdir(draftVersionPath, {
              withFileTypes: true,
            });

            for (const draftConcept of draftConcepts.filter((entry) =>
              entry.isDirectory()
            )) {
              const draftConceptPath = path.join(
                draftVersionPath,
                draftConcept.name
              );
              const draftFiles = await fs.readdir(draftConceptPath);

              for (const file of draftFiles.filter((f) => f.endsWith(".js"))) {
                const filePath = path.join(draftConceptPath, file);

                // Create a draft-specific component tracking set
                if (
                  !domainComponents[
                    `draft/${draftDomain.name}/${draftVersion.name}`
                  ]
                ) {
                  domainComponents[
                    `draft/${draftDomain.name}/${draftVersion.name}`
                  ] = new Set();
                }

                const valid = await validateInterfaceFile(
                  filePath,
                  validate,
                  draftDomain.name,
                  draftVersion.name,
                  draftConcept.name,
                  domainComponents[
                    `draft/${draftDomain.name}/${draftVersion.name}`
                  ],
                  true
                );

                if (!valid) {
                  allValid = false;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      // No drafts directory or other error, just continue
      if (err.code !== "ENOENT") {
        console.log(
          chalk.yellow(`Note: Could not validate drafts: ${err.message}`)
        );
      }
    }

    return allValid;
  } catch (err) {
    console.error(chalk.red(`Error loading schema: ${err.message}`));
    return false;
  }
}

async function validateInterfaceFile(
  filePath,
  validate,
  domain,
  version,
  concept,
  existingComponents,
  isDraft = false
) {
  console.log(chalk.blue(`Validating ${filePath}...`));

  try {
    // Read the file content
    const content = await fs.readFile(filePath, "utf8");

    // Extract the interface object (simplified approach)
    const interfaceObject = extractInterfaceObject(content);

    // Schema validation
    const valid = validate(interfaceObject);
    if (!valid) {
      console.error(chalk.red(`Schema validation failed for ${filePath}:`));
      console.error(validate.errors);
      return false;
    }

    // In draft mode, version can be 0.x.y
    if (!isDraft && !version.match(/^[1-9]\d*\.\d+\.\d+$/)) {
      console.error(
        chalk.red(
          `Non-draft interfaces must have versions 1.0.0 or higher. Found: ${version} in ${filePath}`
        )
      );
      return false;
    }

    // Check if version in file matches directory
    if (interfaceObject.version !== version) {
      console.error(
        chalk.red(
          `Version mismatch in ${filePath}: Expected ${version}, got ${interfaceObject.version}`
        )
      );
      return false;
    }

    // Check if category matches domain
    if (interfaceObject.category !== domain) {
      console.error(
        chalk.red(
          `Category mismatch in ${filePath}: Expected ${domain}, got ${interfaceObject.category}`
        )
      );
      return false;
    }

    // Check component naming conventions (PascalCase)
    for (const componentName of Object.keys(interfaceObject.components)) {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
        console.error(
          chalk.red(
            `Invalid component name in ${filePath}: ${componentName} (should be PascalCase)`
          )
        );
        return false;
      }

      // Check for component overlap
      if (existingComponents.has(componentName)) {
        console.error(
          chalk.red(
            `Component ${componentName} in ${filePath} overlaps with another interface in the same domain+version`
          )
        );
        return false;
      }

      existingComponents.add(componentName);

      // Check preset naming conventions (kebab-case or lowercase)
      const presets = interfaceObject.components[componentName].presets;
      for (const presetName of Object.keys(presets)) {
        if (!/^[a-z][a-z0-9-]*$/.test(presetName)) {
          console.error(
            chalk.red(
              `Invalid preset name in ${filePath}: ${componentName}.${presetName} (should be kebab-case or lowercase)`
            )
          );
          return false;
        }
      }
    }

    console.log(chalk.green(`✅ ${filePath} is valid`));
    return true;
  } catch (err) {
    console.error(chalk.red(`Error validating ${filePath}:`, err));
    return false;
  }
}

function extractInterfaceObject(content) {
  // This is a simplified approach - in a real implementation,
  // you would use a JavaScript parser
  const categoryMatch = content.match(/category:\s*["']([^"']+)["']/);
  const versionMatch = content.match(/version:\s*["']([^"']+)["']/);
  const descriptionMatch = content.match(/description:\s*["']([^"']+)["']/);

  const components = {};
  const componentRegex = /(\w+):\s*{[^}]*description:\s*["']([^"']+)["']/g;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    const [, componentName, description] = match;

    // Extract category for the component
    const componentCategoryMatch = content
      .substring(match.index)
      .match(/category:\s*["']([^"']+)["']/);
    const componentCategory = componentCategoryMatch
      ? componentCategoryMatch[1]
      : "Default";

    components[componentName] = {
      description,
      category: componentCategory,
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

  // Try to find the presets block for this component
  const presetsRegex = new RegExp(
    `${componentName}[^}]*presets:\\s*{([\\s\\S]*?)(?:},|},\\s*\\w+:|}}})`,
    "i"
  );
  const presetsMatch = content.match(presetsRegex);

  if (presetsMatch && presetsMatch[1]) {
    // Extract individual preset entries
    const presetEntries = presetsMatch[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g);

    for (const presetMatch of presetEntries) {
      const [, presetName, presetDescription] = presetMatch;
      presets[presetName] = presetDescription;
    }
  }

  return presets;
}

validateInterfaces()
  .then((allValid) => {
    if (allValid) {
      console.log(chalk.green("✅ All interfaces are valid"));
      process.exit(0);
    } else {
      console.error(chalk.red("❌ Some interfaces failed validation"));
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error(chalk.red("Error validating interfaces:"), err);
    process.exit(1);
  });
