# Library Interfaces Documentation Generator

This folder contains scripts that generate comprehensive documentation for the Library Interfaces system using the domain-first directory structure.

## Overview

The documentation generator:

1. Scans the repository for interface definition files
2. Validates them against the schema
3. Generates a master JSON file with all interface data
4. Creates HTML documentation showing interfaces by domain
5. Provides detailed views of components and presets

## File Structure

The generator is split into modular files:

- `generate-docs.js` - Main entry point
- `generate-docs-part1.js` - Core scanning and processing logic
- `generate-docs-part2.js` - Output file generation
- `generate-docs-part3.js` - HTML page generation
- `generate-docs-part4.js` - Static assets (CSS, JavaScript)

## Usage

Run the documentation generator with:

```bash
node scripts/generate-docs.js
```

This will generate documentation in the `docs/api` directory:

- `docs/api/interfaces.json` - Master JSON file with all interfaces
- `docs/api/[domain].json` - Domain-specific JSON files
- `docs/api/html/` - HTML documentation site

## Domain-First Structure

The generator is designed to work with the domain-first directory structure:

```
/interfaces/
  /marketing/              # Domain directory
    /core/                 # Core concept directory
      marketing-core-v1.0.js
    /media/                # Specialized concept directory
      marketing-media-v1.0.js
  /documentation/
    /core/
      documentation-core-v1.0.js
```

The documentation is organized to reflect this structure, with:

1. **Domain pages** - Show all interfaces in a domain
2. **Interface pages** - Show details for a specific interface
3. **Version pages** - Show components and presets for a specific version

## Features

- **Hierarchical Organization** - Documentation organized by domain and concept
- **Component Listings** - All components with descriptions and presets
- **Version Diffs** - Differences between interface versions
- **Related Interfaces** - Shows relationships between interfaces in the same domain
- **Responsive Design** - Works on mobile and desktop devices
- **Interactive Elements** - Copy-to-clipboard functionality for presets

## Generated API

The generator creates a comprehensive JSON API for tools to consume:

- `/interfaces.json` - All interfaces, domains, and metadata
- `/[domain].json` - Domain-specific information
- `/[interface]/index.json` - Interface overview
- `/[interface]/[version].json` - Version-specific details
- `/[interface]/diffs/[version]_to_[version].json` - Version differences

These files can be used by other tools to implement validation, code generation, or other functionality.

## GitHub Pages Integration

The generated documentation is designed to be deployed to GitHub Pages through a GitHub Action.