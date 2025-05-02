# Repository Structure Guide

This guide explains the organization of the Library Interfaces repository and the principles behind its structure.

## Directory Structure

The repository uses a domain-first, then full version, then concept organization:

```
/interfaces/
  /marketing/              # Domain
    /1.0.0/                # Full version (including patch)
      /core/               # Concept
        marketing-core.js  # No version in filename needed
      /media/              # Another concept
        marketing-media.js
    /1.1.0/                # Complete version directory
      /core/
        marketing-core.js  # Updated or same as previous version
      /media/
        marketing-media.js
      /analytics/          # New concept in 1.1.0
        marketing-analytics.js
    /2.0.0/                # New major version
      /core/
        marketing-core.js
      /media/
        marketing-media.js
      /commerce/           # New concept in v2.0.0
        marketing-commerce.js
  /documentation/          # Another domain
    /1.0.0/
      /core/
        documentation-core.js
      /technical/
        documentation-technical.js
```

## Structure Principles

### 1. Complete Version Directories

Each version directory provides a complete snapshot of all concepts and components available at that specific version:

- Every version directory is self-contained and complete
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

Interface definition files use a simplified naming convention since the version is already in the directory path:

```
domain-concept.js
```

For example:
```
marketing-core.js
documentation-technical.js
```

## Version Evolution

### Creating a New Version

When creating a new version:

1. Create a complete copy of the previous version directory
2. Make changes only to the files that need updating
3. Add new concept directories as needed

Example for a new minor version:
```
# Copy the entire previous version directory
cp -r /interfaces/marketing/1.0.0 /interfaces/marketing/1.1.0

# Modify existing files as needed
edit /interfaces/marketing/1.1.0/core/marketing-core.js

# Add new concept directories
mkdir -p /interfaces/marketing/1.1.0/analytics
touch /interfaces/marketing/1.1.0/analytics/marketing-analytics.js
```

### Version Rules

- **Major versions** (2.0.0): May introduce breaking changes, remove concepts or components
- **Minor versions** (1.1.0): Can only add to previous versions, never remove
- **Patch versions** (1.0.1): Documentation improvements only, no functional changes

## Benefits of This Approach

### 1. Clear Browsing Experience

Anyone browsing the repository can see exactly what was included in each version:

- No need to understand cascading rules
- Complete picture of each released version
- Easy to track when concepts were introduced

### 2. Historical Accuracy

Each version directory acts as an immutable snapshot:

- Precise record of what was released
- Complete version history
- Clear tracking of both minor and patch versions

### 3. Simplified Mental Model

The structure creates an intuitive representation:

- "This directory contains everything in version 1.1.0"
- Clear boundaries between versions
- No implicit knowledge required
