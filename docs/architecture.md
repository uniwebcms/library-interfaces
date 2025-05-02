# Library Interfaces Architecture

This document provides a visual overview of the Library Interfaces standard structure and organization to help implementers understand the hierarchical relationships.

## Core Architecture

Library Interfaces are organized in a three-level hierarchy:

```mermaid
graph TD
    A[Domain] --> B1[Concept 1]
    A --> B2[Concept 2]
    A --> B3[Concept 3]
    B1 --> C1[Interface Definition]
    B2 --> C2[Interface Definition]
    B3 --> C3[Interface Definition]

    C1 --> D1[Components]
    C2 --> D2[Components]
    C3 --> D3[Components]

    D1 --> E1[Presets]
    D2 --> E2[Presets]
    D3 --> E3[Presets]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B1 fill:#bbf,stroke:#333,stroke-width:1px
    style B2 fill:#bbf,stroke:#333,stroke-width:1px
    style B3 fill:#bbf,stroke:#333,stroke-width:1px
    style C1 fill:#dfd,stroke:#333,stroke-width:1px
    style C2 fill:#dfd,stroke:#333,stroke-width:1px
    style C3 fill:#dfd,stroke:#333,stroke-width:1px
```

## Domain and Concept Relationship

Domains represent broad functional areas (like marketing, documentation, or ecommerce), while concepts represent specific functional capabilities within a domain.

```mermaid
graph LR
    A[Marketing Domain] --> B1[Core Concept]
    A --> B2[Media Concept]
    A --> B3[Analytics Concept]

    C[Documentation Domain] --> D1[Core Concept]
    C --> D2[Technical Concept]
    C --> D3[Learning Concept]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#f9f,stroke:#333,stroke-width:2px
```

## Component Structure

Each interface defines semantic components with presets:

```mermaid
graph TD
    A[Hero Component] --> B1[Brand Preset]
    A --> B2[Product Preset]
    A --> B3[Campaign Preset]
    A --> B4[Minimal Preset]

    C[Features Component] --> D1[Benefits Preset]
    C --> D2[Capabilities Preset]
    C --> D3[Process Preset]

    style A fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
```

## Repository Structure

The repository is organized to reflect this hierarchy:

```
interfaces/
├── domain/               # e.g., marketing, documentation
│   ├── version/          # e.g., 1.0.0, 1.1.0
│   │   ├── concept/      # e.g., core, media
│   │   │   └── domain-concept.js # Interface definition
```

## Implementation Pattern

When a library implements an interface, it follows this pattern:

```mermaid
graph TD
    A[Library Implementation] --> B[Exported Components]
    B --> C1[Hero Component]
    B --> C2[Features Component]

    C1 --> D1[Handles All Presets]
    C2 --> D2[Handles All Presets]

    D1 --> E1[Internal Components]
    D2 --> E2[Internal Components]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:1px
    style C1 fill:#dfd,stroke:#333,stroke-width:1px
    style C2 fill:#dfd,stroke:#333,stroke-width:1px
```

## Version Compatibility

Version numbers follow semantic versioning rules:

```mermaid
graph LR
    A[Major Version] --> B[Breaking Changes]
    C[Minor Version] --> D[Additive Changes Only]
    E[Patch Version] --> F[Documentation Improvements]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:1px
    style E fill:#dfd,stroke:#333,stroke-width:1px
```

## Content Structure

Components receive content in a standardized structure:

```json
{
  "main": {
    "title": "Main heading content",
    "paragraphs": ["First paragraph", "Second paragraph"],
    "images": [{ "src": "/image.jpg", "alt": "Image description" }],
    "links": [{ "text": "Link text", "url": "/target" }]
  },
  "items": [
    {
      "title": "First item heading",
      "paragraphs": ["Item content"],
      "images": [],
      "links": []
    }
  ]
}
```

## Key Principles

1. **Components represent content purpose**, not visual presentation
2. **Presets define content variations**, not visual styles
3. **Non-overlapping components** belong to exactly one concept
4. **Version compatibility** ensures content portability
