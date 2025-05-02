/**
 * Library Interface Validation Utility
 *
 * This utility validates that a component library correctly implements
 * a Library Interface standard.
 */

import fs from "fs/promises";
import path from "path";

/**
 * Validates a library against a specific interface
 * @param {string} libraryPath - Path to the library module
 * @param {string} interfaceSpec - Interface specification in format "domain/version/concept"
 * @returns {Promise<object>} Validation results
 */
export async function validateLibrary(libraryPath, interfaceSpec) {
  console.log(`Validating library against ${interfaceSpec}...`);

  try {
    // 1. Parse the interface specification
    const [domain, version, concept] = interfaceSpec.split("/");
    if (!domain || !version || !concept) {
      throw new Error(
        `Invalid interface specification: ${interfaceSpec}. Format should be domain/version/concept`
      );
    }

    // 2. Load the interface definition
    const interfacePath = path.resolve(
      `interfaces/${domain}/${version}/${concept}/${domain}-${concept}.js`
    );

    try {
      await fs.access(interfacePath);
    } catch (error) {
      throw new Error(`Interface specification not found: ${interfacePath}`);
    }

    const interfaceModule = await import("file://" + interfacePath);
    const interfaceDefinition = interfaceModule.default;

    // 3. Load the library implementation
    const library = await import("file://" + path.resolve(libraryPath));

    // 4. Create validation results object
    const results = {
      valid: true,
      interfaceSpec,
      missingComponents: [],
      invalidComponents: [],
      missingPresets: {},
      metadata: {},
    };

    // 5. Validate library metadata
    if (!library.metadata || !library.metadata.implements) {
      results.metadata.missing = true;
      results.valid = false;
    } else if (!library.metadata.implements.includes(interfaceSpec)) {
      results.metadata.missingImplements = true;
      results.valid = false;
    }

    // 6. Validate required components
    const requiredComponents = Object.keys(interfaceDefinition.components);
    const implementedComponents = Object.keys(library).filter(
      (key) => typeof library[key] === "function"
    );

    // Check for missing components
    results.missingComponents = requiredComponents.filter(
      (component) => !implementedComponents.includes(component)
    );

    if (results.missingComponents.length > 0) {
      results.valid = false;
    }

    // 7. Validate component implementations
    for (const componentName of requiredComponents) {
      // Skip missing components
      if (results.missingComponents.includes(componentName)) {
        continue;
      }

      // Check component signature
      const componentStr = library[componentName].toString();
      if (
        !componentStr.includes("content") ||
        !componentStr.includes("params")
      ) {
        results.invalidComponents.push({
          component: componentName,
          reason:
            "Component does not follow { content, params } interface pattern",
        });
        results.valid = false;
      }

      // Check for required presets
      const expectedPresets = Object.keys(
        interfaceDefinition.components[componentName].presets
      );

      // Create a mock content and check preset handling
      const mockContent = createMockContent();

      // Loop through expected presets
      for (const preset of expectedPresets) {
        try {
          // Simple test - check if component renders with the preset
          const result = library[componentName]({
            content: mockContent,
            params: { preset },
          });

          // If rendering returns undefined or throws, mark as missing preset
          if (result === undefined) {
            if (!results.missingPresets[componentName]) {
              results.missingPresets[componentName] = [];
            }
            results.missingPresets[componentName].push(preset);
            results.valid = false;
          }
        } catch (error) {
          // If rendering throws, mark as missing preset
          if (!results.missingPresets[componentName]) {
            results.missingPresets[componentName] = [];
          }
          results.missingPresets[componentName].push(preset);
          results.valid = false;
        }
      }
    }

    // 8. Return validation results
    if (results.valid) {
      console.log(`✅ Library successfully implements ${interfaceSpec}`);
    } else {
      console.error(`❌ Library does not fully implement ${interfaceSpec}`);
      if (results.missingComponents.length > 0) {
        console.error(
          `   Missing components: ${results.missingComponents.join(", ")}`
        );
      }
      if (results.invalidComponents.length > 0) {
        console.error(
          `   Invalid components: ${results.invalidComponents
            .map((c) => c.component)
            .join(", ")}`
        );
      }
      if (Object.keys(results.missingPresets).length > 0) {
        for (const component of Object.keys(results.missingPresets)) {
          console.error(
            `   Component ${component} missing presets: ${results.missingPresets[
              component
            ].join(", ")}`
          );
        }
      }
    }

    return results;
  } catch (error) {
    console.error(`Error during validation: ${error.message}`);
    throw error;
  }
}

/**
 * Creates mock content for testing
 */
function createMockContent() {
  return {
    main: {
      title: "Test Title",
      paragraphs: ["Test paragraph"],
      images: [
        {
          src: "/test-image.jpg",
          alt: "Test Image",
        },
      ],
      links: [
        {
          text: "Test Link",
          url: "/test",
        },
      ],
    },
    items: [
      {
        title: "Test Item",
        paragraphs: ["Test item paragraph"],
        images: [],
        links: [],
      },
    ],
  };
}

// Example usage
const runExample = async () => {
  try {
    const results = await validateLibrary(
      path.resolve("examples/marketing-components/index.js"),
      "marketing/1.0.0/core"
    );

    console.log("Validation complete");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Example failed:", error);
  }
};

// Run the example if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runExample();
}
