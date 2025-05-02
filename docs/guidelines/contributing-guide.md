# Contributing to Library Interfaces

This guide explains how to contribute to the Library Interfaces repository, including creating new versions, adding concepts, and updating existing interfaces.

## Getting Started

Before contributing, familiarize yourself with the [Repository Structure Guide](./revised-repository-structure.md) to understand how interfaces are organized.

## Contribution Types

### 1. Creating a New Minor Version

When creating a new minor version (e.g., 1.0.0 → 1.1.0):

1. Create a complete copy of the previous version directory:
   ```bash
   cp -r interfaces/marketing/1.0.0 interfaces/marketing/1.1.0
   ```

2. Make necessary changes to existing files:
   ```javascript
   // interfaces/marketing/1.1.0/core/marketing-core.js
   export default {
     description: "Essential marketing site components",
     version: "1.1.0",  // Update the version number
     category: "marketing",
     components: {
       Hero: {
         description: "Primary attention-grabbing section at the top of a page",
         category: "Brand Presentation",
         presets: {
           "brand": "Emphasizes company identity and brand positioning",
           "product": "Focuses on product value proposition and benefits",
           "campaign": "Highlights special campaign or promotion",
           "minimal": "Streamlined, text-focused presentation",
           // New preset in v1.1.0
           "video": "Video-focused hero section with embedded media"
         }
       },
       // Other components...
     }
   };
   ```

3. Add new concept directories if needed:
   ```bash
   mkdir -p interfaces/marketing/1.1.0/analytics
   touch interfaces/marketing/1.1.0/analytics/marketing-analytics.js
   ```

### 2. Creating a Patch Version

For a patch version that only updates documentation (e.g., 1.0.0 → 1.0.1):

1. Create a complete copy of the previous version directory:
   ```bash
   cp -r interfaces/marketing/1.0.0 interfaces/marketing/1.0.1
   ```

2. Update documentation in the relevant files:
   ```javascript
   // interfaces/marketing/1.0.1/core/marketing-core.js
   export default {
     description: "Essential marketing site components",
     version: "1.0.1",  // Update the version number
     category: "marketing",
     components: {
       Hero: {
         // Improved description
         description: "Primary attention-grabbing section that establishes brand identity or highlights key messages",
         category: "Brand Presentation",
         presets: {
           // Same presets, possibly with improved descriptions
           "brand": "Emphasizes company identity, values, and overall brand positioning",
           "product": "Focuses on product value proposition, features, and benefits",
           "campaign": "Highlights special campaign, promotion, or time-sensitive offering",
           "minimal": "Streamlined, text-focused presentation with reduced visual elements"
         }
       },
       // Other components with documentation improvements...
     }
   };
   ```

### 3. Creating a Major Version

For a major version with breaking changes (e.g., 1.1.0 → 2.0.0):

1. Create a new directory for the major version:
   ```bash
   mkdir -p interfaces/marketing/2.0.0
   ```

2. Copy content from the latest minor version of the previous major version:
   ```bash
   cp -r interfaces/marketing/1.1.0/* interfaces/marketing/2.0.0/
   ```

3. Make breaking changes as needed:
   - Rename or remove components
   - Restructure concepts
   - Change semantic meanings

## File Structure

Each interface definition file should follow this template:

```javascript
/**
 * [Domain] [Concept] Interface
 *
 * A brief description of the purpose of this interface.
 */

export default {
  description: "Concise description of the interface purpose",
  category: "domain-category",
  version: "X.Y.Z",  // Full semantic version
  components: {
    ComponentName: {
      description: "Clear description of the component's purpose",
      category: "Component Category",
      presets: {
        "preset-name": "Detailed description of the preset's purpose",
        // More presets...
      }
    },
    // More components...
  }
};
```

## Validation Rules

The build system will enforce these rules:

1. **Version Compatibility**: 
   - Minor versions can only add components or presets, never remove or rename them
   - Patch versions can only improve documentation, no functional changes

2. **Concept Availability**: 
   - Concepts present in one version must be available in all future versions of the same major version
   - New concepts can be added in any minor version

3. **Component Uniqueness**: 
   - Components must be unique across all concepts in a domain
   - Each component belongs to exactly one concept

## Best Practices

### Component Descriptions

- Focus on semantic purpose, not visual implementation
- Be specific about the communication goal, not the UI pattern
- Keep descriptions concise but informative

### Preset Naming

- Use lowercase for single-word presets
- Use kebab-case for multi-word presets
- Focus on semantic purpose, not visual styling

### Directory Management

- Always create a complete copy of the previous version
- Only modify files that need changes
- Run validation before submitting

## Submission Process

1. Fork the repository
2. Create a new version directory following the guidelines above
3. Make your changes
4. Run the validation script: `npm run validate`
5. Submit a pull request with a clear description of your changes
