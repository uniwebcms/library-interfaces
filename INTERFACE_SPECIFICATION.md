# Interface Specification Convention

This document explains the definitive convention for specifying which interfaces your library implements, focusing on clarity and expressiveness with our full version directory approach.

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

## Include Full Version Numbers

Always include the full version number with patch version:

```json
"interfaces": ["marketing/1.0.0/core"]
```

This ensures clarity about exactly which version is being implemented, including documentation improvements in patch versions. While patch versions only contain documentation improvements, it's important to specify exactly which patch version you're implementing for consistency and to ensure documentation references match.

## Multiple Concepts

To specify multiple concepts from the same domain and version, use grouped notation with curly braces:

```json
"interfaces": ["marketing/1.0.0/{core,media}"]
```

This concisely indicates that your library implements both the `core` and `media` concepts from the `marketing` domain at version `1.0.0`.

## Wildcards

To specify all concepts available in a particular domain and version, use a wildcard:

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

## Resolution Logic

When the build system encounters an interface specification, it:

1. Parses the domain, version, and concept
2. Resolves any wildcards or grouped notation
3. Validates that all specified interfaces exist
4. Ensures the library actually implements all required components and presets

## Validation

Libraries should validate their interface implementations:

```bash
# Validate a specific interface implementation
uniweb validate-library my-library marketing/1.0.0/core

# Validate multiple concepts at once
uniweb validate-library my-library marketing/1.0.0/{core,media}

# Validate all claimed interfaces
uniweb validate-library my-library
```

## See Also

- [GLOSSARY.md](./GLOSSARY.md) - Definitions of key terms
- [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) - How interfaces are organized
- [VERSION_STRATEGY.md](./docs/governance/VERSION_STRATEGY.md) - Detailed versioning approach
