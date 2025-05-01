# Library Interfaces Implementation Guide

This document explains how to work with the enhanced Library Interfaces system, which now supports:

1. Structured preset descriptions
2. Domain-based organization
3. Non-overlapping component interfaces
4. Automated validation and documentation

## Repository Structure

The enhanced repository structure is:

```
/
├── interfaces/             # 🟢 All stable interfaces (≥1.0.0)
│   ├── marketing-core/
│   │   ├── marketing-core-v1.0.js
│   │   └── CHANGELOG.md
│   ├── marketing-media/
│   │   ├── marketing-media-v1.0.js
│   │   └── CHANGELOG.md
│   └── documentation-core/
│       ├── documentation-core-v1.0.js
│       └── CHANGELOG.md
├── drafts/                 # 🟠 0.x proposals
├── schema/                 # JSON Schema (validation)
│   └── interface-schema.json
├── scripts/                # Build and validation scripts
│   ├── validate-interfaces.js
│   └── generate-docs.js
└── docs/                   # Generated documentation
    └── api/
        ├── interfaces.json
        └── html/
```

## Domain-Based Organization

Interfaces are organized by domain using a naming convention:

- Domains are identified by the prefix before the first hyphen (e.g., `marketing`)
- Each domain has a `-core` interface that provides essential components
- Specialized interfaces (e.g., `marketing-media`) extend the domain with non-overlapping components
- All interfaces in a domain are designed to work together

## Working with Interface Files

### Creating a New Core Interface

1. Create a new directory under `interfaces/` named `[domain]-core`
2. Create a new interface file following the naming convention: `[domain]-core-v1.0.js`
3. Define your interface using proper preset objects:

```javascript
export default {
  description: "Essential components for example domain",
  category: "example",
  version: "1.0.0",
  components: {
    ExampleComponent: {
      description: "Detailed description of this component's purpose",
      category: "Example Category",
      presets: {
        "primary": "Detailed description of this preset's purpose",
        "secondary": "Detailed description of this preset's purpose"
      }
    }
  }
};
```

### Creating a Specialized Interface

1. Create a new directory under `interfaces/` named `[domain]-[specialization]`
2. Create a new interface file following the naming convention: `[domain]-[specialization]-v1.0.js`
3. Define your interface with non-overlapping components:

```javascript
export default {
  description: "Specialized components for example domain",
  category: "example",
  version: "1.0.0",
  components: {
    // Components in specialized interfaces must not overlap with other interfaces in the domain
    SpecializedComponent: {
      description: "Component description",
      category: "Category",
      presets: {
        "preset1": "Preset description",
        "preset2": "Preset description"
      }
    },
    
    AnotherComponent: {
      description: "Another specialized component",
      category: "Category",
      presets: {
        "basic": "Preset description",
        "advanced": "Preset description"
      }
    }
  }
};
```

### Creating a Minor Version Update

1. Create a new file with the updated minor version: `[domain]-[specialization]-v1.1.js`
2. Include all components from the previous version
3. Add new components or presets as needed

## Non-Overlapping Components Rule

A key principle of the system is that components should not overlap across interfaces in the same domain:

- Each component belongs to exactly one interface within a domain
- The validation system enforces this rule to ensure clean boundaries
- This allows libraries to mix and match interfaces as needed

## Using the Validation System

The validation system ensures interfaces follow our conventions:

```bash
# Install dependencies
npm install

# Run validation
npm run validate
```

This checks for:
- Schema compliance
- Component naming conventions (PascalCase)
- Preset naming conventions (kebab-case or lowercase)
- Versioning rules (proper semantic versioning)
- Non-overlapping components across domain interfaces

## Generating Documentation

The documentation system creates a comprehensive reference:

```bash
# Generate documentation
npm run docs:generate
```

This produces:
- A master `interfaces.json` file with all interface data
- Domain-specific JSON files for API consumption
- An HTML documentation site with domain organization

## GitHub Workflow

The repository includes a GitHub Action that:
1. Validates all interfaces on pull requests
2. Generates documentation when changes are merged
3. Deploys documentation to GitHub Pages

## Best Practices

### Component Naming

- Use PascalCase for component names
- Focus on semantic purpose, not visual implementation
- Avoid generic UI patterns (`Grid`, `Carousel`, etc.)
- Use domain-specific names (`ProductFeatures` not `Features`)

### Preset Naming

- Use lowercase for single-word presets
- Use kebab-case for multi-word presets
- Focus on content purpose, not visual layout
- Be consistent across components

### Versioning

- **MAJOR version (2.0.0)**: Breaking changes, renamed/removed components
- **MINOR version (1.1.0)**: New components or presets only
- **PATCH version (1.0.1)**: Documentation improvements only

### Domain Organization

- **Core interfaces** provide essential components for a domain
- **Specialized interfaces** add non-overlapping components for specific needs
- Each component belongs to exactly one interface
- Interfaces within a domain are designed to work together

## Implementation Examples

### Marketing Domain

The marketing domain includes multiple specialized interfaces:

- `marketing-core-v1.0` - Essential marketing components (Hero, Features, etc.)
- `marketing-media-v1.0` - Rich media components (MediaGallery, VideoFeature, etc.)

A library can implement any combination of these interfaces to provide the desired functionality.