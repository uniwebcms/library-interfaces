# Repository Structure Guide

This document explains the organization of the Library Interfaces repository and the principles behind its structure. It serves as the definitive reference for how interfaces are stored and accessed.

## Directory Structure

The repository uses a domain-first, then full version, then concept organization:

```
/interfaces/                     # Root interfaces directory
  /marketing/                    # Domain
    /1.0.0/                      # Full version including patch
      /core/                     # Concept
        marketing-core.js        # Interface definition (domain-concept.js)
      /media/                    # Another concept
        marketing-media.js
    /1.0.1/                      # Patch version
      /core/
        marketing-core.js        # Updated descriptions only
      /media/
        marketing-media.js       # Duplicated for completeness
    /1.1.0/                      # Minor version
      /core/
        marketing-core.js        # New presets added
      /media/
        marketing-media.js       # Duplicated for completeness
      /analytics/                # New concept in 1.1.0
        marketing-analytics.js
  /documentation/                # Another domain
    /1.0.0/
      /core/
        documentation-core.js
      /technical/
        documentation-technical.js
/drafts/                         # Draft interfaces (< 1.0.0)
  /portfolio-v0.1.js             # Draft interface in older format (will be migrated)
  /portfolio/                    # Newer draft structure matching final structure
    /0.2.0/
      /core/
        portfolio-core.js
/examples/                       # Using library interfaces in practice
/schema/                         # JSON Schema for validation
  /interface-schema.json         # Schema for interface validation
/scripts/                        # Build and validation scripts
  /validate-interfaces.js        # Validation script
  /create-version.js             # Version creation helper
  /detect-changes.js             # Change detection for changelogs
  /generate-docs.js              # Documentation generator
/docs/                           # Documentation
  /api/                          # Generated API documentation
  /guidelines/                   # Design guidelines
  /governance/                   # Process documentation
```

## Structure Principles

### 1. Complete Version Directories

Each version directory provides a complete, standalone snapshot of all concepts and components available at that specific version:

- Every version directory is self-contained and immutable
- Files are duplicated across versions even if unchanged
- Patch versions have their own complete directories

### 2. Domain Organization

Domains represent broad functional areas and are the top level of organization:

- `marketing` - Components for marketing websites
- `documentation` - Components for documentation sites
- `ecommerce` - Components for online stores

### 3. Concept Organization

Within each version, interfaces are organized by concept:

- `core` - Essential components for the domain
- `media` - Media-specific components
- `analytics` - Data visualization components

### 4. File Naming Convention

Interface definition files use a domain-concept naming convention:

```
domain-concept.js
```

For example:

```
marketing-core.js
documentation-technical.js
```

This naming makes it clear which domain and concept each file belongs to, without duplicating version information that's already in the directory path.

## Reference Format

When referencing interfaces from a library, use the format:

```
domain/version/concept
```

For example:

```json
"interfaces": ["marketing/1.0.0/core"]
```

Always include the full version number, including the patch version, for precise specification.

## See Also

- [GLOSSARY.md](./GLOSSARY.md) - Definitions of key terms used in this document
- [VERSION_STRATEGY.md](./docs/governance/VERSION_STRATEGY.md) - Detailed explanation of versioning approach
- [GOVERNANCE.md](./GOVERNANCE.md) - Interface lifecycle and governance process
