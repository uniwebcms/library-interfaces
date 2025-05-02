# Version Strategy

This document outlines our versioning strategy for Library Interfaces, focusing on clarity, stability, and developer experience. It consolidates and supersedes content from previous versioning-related documentation.

## Full Version Directory Approach

We use a **full version directory approach**, where each version (including patch versions) has its own complete directory structure:

```
/interfaces/
  /marketing/             # Domain
    /1.0.0/               # Full version including patch
      /core/              # Concept
        marketing-core.js # No version in filename needed
      /media/
        marketing-media.js
    /1.0.1/               # Patch version
      /core/
        marketing-core.js # Updated descriptions only
      /media/
        marketing-media.js # Duplicated for completeness
    /1.1.0/               # Minor version
      /core/
        marketing-core.js # New presets added
      /media/
        marketing-media.js # Duplicated for completeness
      /analytics/          # New concept in 1.1.0
        marketing-analytics.js
```

## Key Principles

### 1. Complete Version Snapshots

Each version directory provides a complete, standalone snapshot of all concepts and components available at that specific version:

- Every version directory is self-contained and immutable
- Includes patch versions with full directories
- Provides a clear picture of what was available in each released version

### 2. File Duplication

Files are duplicated across versions even if unchanged:

- Ensures each version directory is complete
- Makes it clear what was included in each version
- Provides an accurate historical record

### 3. Interface Specification

Libraries specify which interfaces they implement using the format:

```
domain/version/concept
```

For example:

```json
"interfaces": ["marketing/1.0.0/core"]
```

The full version number, including patch version, should always be included for precise specification. Wildcards and grouped notation are supported:

```json
"interfaces": ["marketing/1.0.0/*"]
"interfaces": ["marketing/1.0.0/{core,media}"]
```

## Version Evolution

### Creating New Versions

When creating a new version:

1. Duplicate the entire previous version directory
2. Update version numbers in files
3. Make changes only to files that need updating
4. Add new concept directories as needed

### Version Rules

- **Patch Versions (1.0.1)**: Documentation improvements only
- **Minor Versions (1.1.0)**: Can only add components/presets/concepts, never remove
- **Major Versions (2.0.0)**: Can introduce breaking changes

The build system validates these rules to ensure version compatibility.

## Automated Tools

Our build system helps manage versioning:

1. **create-version.js**: Creates a new version by duplicating an existing one
2. **detect-changes.js**: Identifies changes between versions for changelogs
3. **validate-interfaces.js**: Ensures version compatibility rules are followed

## Benefits of This Approach

### For Repository Browsers

- Immediate understanding of what's in each version
- Clear visual indication of when concepts were introduced
- Complete snapshots of each released version

### For Library Implementers

- Precise specification of which version to implement
- Clear contracts about what components are available in each version
- Ability to mix and match versions if needed

### For Content Creators

- Predictable component availability
- Clear documentation about which presets exist in each version
- Confidence in backward compatibility guarantees

## Handling Migration

When creating a new major version that introduces breaking changes:

1. Clearly document the changes in CHANGELOG.md
2. Provide a migration guide for content creators
3. Keep the previous major version available for a transition period
4. Update documentation to highlight differences

## Implementation Example

### Creating a New Minor Version

```bash
# Create a new minor version
npm run new-version marketing 1.0.0 1.1.0

# Add new components or concepts
# Edit files as needed

# Detect and document changes
npm run detect-changes marketing 1.0.0 1.1.0

# Validate the new version
npm run validate

# Generate updated documentation
npm run docs
```

## Versioning Timeline

Interfaces follow this versioning timeline:

1. **Draft (0.x.y)**: During initial development, unstable
2. **Release Candidate (0.9.x)**: Feature complete, undergoing final review
3. **Stable (1.0.0)**: Released and follows semantic versioning
4. **Updates**: Minor (1.x.0) and patch (1.0.x) releases as needed
5. **Next Major Version**: When breaking changes are required

## See Also

- [GLOSSARY.md](./GLOSSARY.md) - Definitions of key terms
- [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) - How interfaces are organized
- [GOVERNANCE_UNIFIED.md](./GOVERNANCE_UNIFIED.md) - Governance process
- [INTERFACE_SPECIFICATION.md](./INTERFACE_SPECIFICATION.md) - How to specify interfaces