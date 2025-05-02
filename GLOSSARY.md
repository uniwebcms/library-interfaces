# Library Interfaces Glossary

This glossary defines the key terminology used throughout the Library Interfaces repository to ensure consistent understanding and usage.

## Core Concepts

### Domain

A broad functional area that groups related interfaces. Examples include `marketing`, `documentation`, and `ecommerce`. Domains represent the primary categorization and help organize interfaces by their overall purpose.

### Concept

A specific functional focus or capability within a domain. Each domain contains multiple concepts, such as `core` (essential components) and specialized concepts like `media` (media-related components). Concepts are designed to work together while maintaining non-overlapping components.

### Interface

A formal definition of a set of components and their presets for a specific domain and concept, including metadata like descriptions and version information. Interfaces are versioned and evolve over time while maintaining backward compatibility within major versions.

### Component

A semantic building block defined by its communication purpose rather than its visual implementation. Components have names, descriptions, categories, and presets. Component names use PascalCase (e.g., `Hero`, `FeatureShowcase`) and focus on content purpose.

### Preset

A specific variation or configuration of a component that represents a different content approach or purpose. Presets use kebab-case (e.g., `featured`, `quick-start`) and define common usage patterns without specifying visual implementation.

### Purpose-Built Component Library (PBCL)

A complete collection of React components designed to work together as a cohesive design system, implementing one or more Library Interfaces. PBCLs provide the actual implementation that renders content according to interface specifications.

## Repository Structure

### Module

The technical packaging and delivery mechanism that connects a component library to a site at runtime. A module contains the implementation of components specified by one or more interfaces.

### Extension

An organization-specific extension to a standard interface, hosted in an external repository but registered in the main repository for discoverability. Extensions allow organizations to build on core interfaces while maintaining their own standards.

## Versioning

### Major Version (X.0.0)

A version that introduces breaking changes, such as removing or renaming components or presets. Content created for one major version may require updates to work with a different major version.

### Minor Version (0.X.0)

A version that adds new components or presets without breaking changes. Content created for an earlier minor version will continue to work with later minor versions of the same major version.

### Patch Version (0.0.X)

A version that includes only documentation improvements or non-breaking tweaks. No functional changes are allowed in patch versions.

## File Structure

### Reference Format

When specifying which interfaces a library implements, we use the format:
```
domain/version/concept
```

For example: `marketing/1.0.0/core` or with grouped notation: `marketing/1.0.0/{core,media}`.

### Directory Structure

The repository uses a domain-first, then full version, then concept organization:
```
/interfaces/
  /marketing/             # Domain
    /1.0.0/               # Full version (including patch)
      /core/              # Concept
        marketing-core.js # Interface definition
```

## Lifecycle Stages

### Proposed

Initial concept submitted as an issue or discussion for feedback.

### Draft

Interface added to `drafts/` directory with version numbered as `0.x.y`.

### Release Candidate

Final draft version (typically `0.9.x`) undergoing final review.

### Stable

Promoted to `interfaces/` directory with version `1.0.0` or higher.

### Extended

Receives new capabilities through minor versions while maintaining backward compatibility.

### Deprecated

Superseded by a newer major version but still available for transition.

### Retired

Removed from active registry after a lengthy deprecation period.
