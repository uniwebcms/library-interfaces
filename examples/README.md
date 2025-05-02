# Library Interface Implementation Examples

This directory contains reference examples showing how to implement and validate against Library Interfaces standards. These examples demonstrate the correct patterns for implementing semantic components according to the standard.

## Purpose

These examples serve to:

1. Demonstrate proper implementation of interface standards
2. Show the separation between interface requirements and implementation details
3. Provide validation approaches to verify standard compliance
4. Illustrate best practices for library authors

## Directory Structure

```
examples/
├── marketing-components/    # Example implementation of marketing interfaces
│   ├── components/          # Component implementations
│   │   ├── Hero/            # Hero component implementation
│   │   │   ├── index.js     # Interface entry point
│   │   │   └── variants/    # Preset implementations
│   │   └── Features/        # Features component implementation
│   └── index.js             # Library exports
└── validation/              # Validation utilities
    └── validate-implementation.js  # Example validator
```

## Implementation Pattern

These examples follow this pattern for implementing interfaces:

1. **Interface Boundary**: Components exported from the library match the interface definitions exactly
2. **Preset Handling**: Each component handles all required presets as defined in the interface
3. **Internal Implementation**: Component implementations use standard React patterns internally
4. **Content Structure**: Components process content according to the standard content model

### Key Implementation Principles

1. Only user-facing components use the `{ content, params }` interface
2. Internal components use standard React props
3. Each preset is implemented as a separate component for maintainability
4. The library explicitly declares which interfaces it implements

## Validation Approach

The validation example demonstrates how to verify that a library correctly implements an interface by:

1. Checking that all required components are exported
2. Verifying that components follow the interface pattern
3. Ensuring all required presets are implemented
4. Testing with sample content to validate behavior

## Usage Example

To implement a library interface:

```javascript
// In your component library:
import { Hero, Features } from "./components";

// Export components required by the interface
export { Hero, Features };

// Declare implemented interfaces
export const metadata = {
  implements: ["marketing/1.0.0/core"],
};
```

To validate against an interface:

```javascript
import { validateLibrary } from "library-interfaces/validation";

// Validate your library
validateLibrary("./your-library.js", "marketing/1.0.0/core").then((valid) => {
  if (valid) {
    console.log("Library successfully implements the interface!");
  }
});
```

## Next Steps

After reviewing these examples:

1. Refer to the [interface specification](../interfaces) for complete requirements
2. See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidance on proposing new interfaces
3. Check [GOVERNANCE.md](../GOVERNANCE.md) for understanding the interface lifecycle

## Notes for Library Authors

When implementing these interfaces:

- Focus on the semantic purpose of components, not their visual appearance
- Handle all required presets, even if with minimal implementations
- Maintain the separation between interface requirements and implementation details
- Document which interfaces your library implements
