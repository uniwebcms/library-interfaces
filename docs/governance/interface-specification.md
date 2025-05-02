# Interface Specification Convention

This document explains the convention for specifying which interfaces your library implements, focusing on clarity and expressiveness with our full version directory approach.

## Basic Format

When specifying which interfaces your library implements, use the following format:

```
domain/version/concept
```

For example:
```json
"interfaces": ["marketing/1.0.0/core"]
```

This clearly indicates that your library implements the `core` concept from the `marketing` domain at version `1.0.0`.

## Full Version Numbers

With our approach, the version includes the patch number:

```json
// Specific patch version
"interfaces": ["marketing/1.0.1/core"]
```

This ensures clarity about exactly which version is being implemented, including documentation improvements in patch versions.

## Multiple Concepts

To specify multiple concepts from the same domain and version, you can use grouped notation with curly braces:

```json
"interfaces": ["marketing/1.0.0/{core,media}"]
```

This concisely indicates that your library implements both the `core` and `media` concepts from the `marketing` domain at version `1.0.0`.

## Wildcards

To specify all concepts available in a particular domain and version, you can use a wildcard:

```json
"interfaces": ["marketing/1.0.0/*"]
```

This indicates that your library implements all concepts available in the `marketing` domain at version `1.0.0`. The wildcard will only expand to concepts that were officially part of that specific version when it was released.

## Multiple Domains

To implement interfaces from different domains:

```json
"interfaces": [
  "marketing/1.0.0/core",
  "documentation/1.0.0/core"
]
```

## Mixed Versions

For implementing different versions:

```json
"interfaces": [
  "marketing/2.0.0/core",
  "marketing/1.0.0/media"
]
```

## Complex Examples

You can combine these approaches for more complex implementations:

```json
"interfaces": [
  "marketing/1.0.0/*",                     // All marketing 1.0.0 concepts
  "documentation/1.0.0/{core,technical}",  // Selected documentation concepts
  "ecommerce/2.0.0/product"                // Different domain and version
]
```

## Best Practices

### Specific Version Specification

Always specify the exact version you're implementing, including the patch version:

```json
// Good
"interfaces": ["marketing/1.0.0/core"]

// Not recommended (ambiguous about patch version)
"interfaces": ["marketing/1.0/core"]
```

### Wildcards Usage

Only use wildcards when you genuinely intend to implement all concepts in a domain/version:

```json
// Only use if you implement everything
"interfaces": ["marketing/1.0.0/*"]

// Better for selective implementation
"interfaces": ["marketing/1.0.0/{core,media}"]
```

### Progressive Implementation

For libraries that are progressively implementing interfaces, clearly specify the implemented concepts:

```json
// Initial implementation
"interfaces": ["marketing/1.0.0/core"]

// Later expanded
"interfaces": [
  "marketing/1.0.0/{core,media}",
  "marketing/1.1.0/analytics"
]
```

### Documentation

In your library's documentation, clearly state which interfaces you implement:

```markdown
## Supported Interfaces

This library implements:
- marketing/1.0.0/core
- marketing/1.0.0/media
- documentation/1.0.0/core
```

## Validation

Libraries should validate their interface implementations against the specification:

```bash
# Validate a specific interface implementation
uniweb validate-library my-library marketing/1.0.0/core

# Validate multiple concepts at once
uniweb validate-library my-library marketing/1.0.0/{core,media}

# Validate all claimed interfaces
uniweb validate-library my-library
```

## Resolution Logic

When the build system encounters an interface specification, it:

1. Parses the domain, version, and concept
2. Resolves any wildcards or grouped notation
3. Validates that all specified interfaces exist
4. Ensures the library actually implements all required components and presets

## Version Update Implications

When a new patch or minor version is released:

- Libraries implementing a previous version can continue to specify that version
- Libraries can update to the new version to take advantage of improvements
- The version number in your specification precisely identifies which interface definition you're implementing
