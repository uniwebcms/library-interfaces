# Library Interfaces

**Semantic component standards for purpose-built component libraries in the Uniweb Framework**

> Define once. Implement anywhere. Keep content portable.

## Library Interfaces in the Uniweb Ecosystem

Library Interfaces are a key component of the [Uniweb Framework](https://uniweb.dev), which separates content from code to enable independent workflows for content creators and developers.

In the Uniweb architecture:

- **Content creators** work with markdown and select semantic components
- **Developers** create Purpose-Built Component Libraries (PBCLs) that implement interfaces
- **Library Interfaces** (this registry) define the semantic standards that connect the two

This separation creates a powerful system where content remains portable across different visual implementations, while developers maintain complete creative freedom in how components are rendered.

## What Is This Repository?

This repository contains the official **semantic component interfaces** that purpose-built component libraries (PBCLs) can implement. These interfaces define standardized sets of components and presets that create a bridge between content and implementation.

This is not a framework, library, or component collection - it's a registry of interface definitions that:

1. **Component library developers** reference when implementing interfaces
2. **CLI tools** use to validate compatibility
3. **Content creators** consult to understand available semantic components
4. **API consumers** use to check implementation claims

## Domain-Concept Organization

Library Interfaces use a hierarchical organization system:

### 1. Domains

**Domains** are broad functional areas that group related interfaces. For example:

- The `marketing` domain includes all interfaces related to marketing websites
- The `documentation` domain focuses on documentation sites and knowledge bases

Domains represent the primary categorization and help organize interfaces by their overall purpose.

### 2. Concepts

Within each domain, **concepts** represent specific functional focuses or capabilities:

- The `core` concept provides essential components that form the foundation of a domain
- Specialized concepts like `media` add complementary components for specific needs

Concepts are designed to work together while maintaining non-overlapping components.

### 3. Versions

Each interface evolves through **versions** that follow semantic versioning:

- Major versions (e.g., `2.0.0`) may introduce breaking changes
- Minor versions (e.g., `1.1.0`) add new components or presets
- Patch versions (e.g., `1.0.1`) make documentation improvements

## Interface Specification Convention

When specifying which interfaces your library implements, use the following format:

```
domain/version/concept
```

For example:

```json
"interfaces": ["marketing/1.0.0/core"]
```

To specify multiple concepts from the same domain and version, you can use grouped notation:

```json
"interfaces": ["marketing/1.0.0/{core,media}"]
```

This clearly indicates that your library implements both the `core` and `media` concepts from the `marketing` domain at version `1.0.0`.

For more details on specification formats, see [INTERFACE_SPECIFICATION.md](./INTERFACE_SPECIFICATION.md).

## Progressive Implementation

Library developers can take a progressive approach to implementing interfaces:

1. **Start with Core**: Implement the core concept of a domain to provide essential functionality
2. **Add Specialized Concepts**: Progressively add specialized concepts as needed
3. **Mix and Match**: Choose which concepts to implement based on project requirements

For example, a library for marketing websites could start by implementing:

- `marketing/1.0.0/core` - Essential marketing components (Hero, Features, CTA)

Then progressively add specialized concepts:

- `marketing/1.0.0/media` - Rich media components (MediaGallery, VideoFeature)
- `marketing/1.0.0/blog` - Blogging components (ArticleListing, PostDetail)

This approach allows developers to:

- Implement only what they need
- Start small and expand over time
- Create focused libraries for specific use cases

## Library Interface Layers

The component architecture uses a layered model:

> **Layer‑0** ⇢ Purpose-Built Component Libraries (PBCLs) – unlimited freedom, any component names, any parameters.
>
> **Layer‑1** ⇢ Library Interfaces _(this repo)_ – curated **lists of components & presets** that _multiple_ PBCLs can implement.
>
> **Layer‑2** ⇢ Parameter Standards _(future)_ – when the community needs stricter portability, we'll add it.

## Using This Registry

### Installing the Uniweb CLI

Before using the registry, you'll need to install the Uniweb CLI:

```bash
npm install -g @uniwebcms/toolkit
```

This makes the `uniweb` command available in your terminal.

### Browse Available Interfaces

```bash
# With the CLI
uniweb list interfaces

# Output
marketing/1.0.0/core     Essential marketing site components
marketing/1.0.0/media    Rich media components for marketing
documentation/1.0.0/core Standard documentation site components
```

### Get Interface Details

```bash
# View details of a specific interface
uniweb get interface marketing/1.0.0/core

# Output
ID: marketing/1.0.0/core
Version: 1.0.0
Description: Essential marketing site components

Components:
- Hero (presets: brand, product, campaign, minimal)
- Features (presets: benefits, capabilities, process)
# ...
```

### Validate Implementation

```bash
# Check if a library correctly implements an interface
uniweb validate-library my-marketing-components marketing/1.0.0/core

# Check if a library implements multiple interfaces
uniweb validate-library my-marketing-components marketing/1.0.0/{core,media}

# Check if content uses valid components from an interface
uniweb validate-content ./content marketing/1.0.0/core
```

## Interface Structure

Each interface defines a set of semantic components and their presets:

```js
// marketing/1.0.0/core/marketing-core.js
export default {
  description: "Essential marketing site components",
  category: "marketing",
  version: "1.0.0",
  components: {
    Hero: {
      description: "Primary attention-grabbing section",
      category: "Brand Presentation",
      presets: {
        brand: "Emphasizes company identity and brand positioning",
        product: "Focuses on product value proposition and benefits",
        campaign: "Highlights special campaign or promotion",
        minimal: "Streamlined, text-focused presentation",
      },
    },

    // More components...
  },
};
```

## Non-Overlapping Components Rule

A key principle of Library Interfaces is that components should not overlap across interfaces in the same domain:

- Each component belongs to exactly one interface within a domain
- This ensures clean boundaries between different concepts
- Allows libraries to mix and match interfaces as needed

The validation system enforces this rule to maintain modularity.

## Versioning Rules

| Version type      | Allowed changes                                            | Guaranteed to work with | Requires markdown edits? |
| ----------------- | ---------------------------------------------------------- | ----------------------- | ------------------------ |
| **MAJOR** `2.0.0` | Remove or rename components/presets; restructure hierarchy | nothing older           | maybe ✔                  |
| **MINOR** `1.1.0` | **Only add** components or presets                         | all `1.x.y`             | never ✖                  |
| **PATCH** `1.0.1` | Fix typos, docs, non‑breaking tweaks                       | same major/minor        | never ✖                  |

- If your proposal _breaks_ existing markdown, it's a **MAJOR**.
- If it's purely additive, it's a **MINOR**.
- Docs only? **PATCH**.

For more details on versioning, see [VERSION_STRATEGY.md](./docs/governance/VERSION_STRATEGY.md).

## Available Interfaces

| Interface                                                   | Version | Purpose                             | Status |
| ----------------------------------------------------------- | ------- | ----------------------------------- | ------ |
| [marketing/core](/interfaces/marketing/1.0.0/core/)         | 1.0.0   | Essential marketing components      | Stable |
| [marketing/media](/interfaces/marketing/1.0.0/media/)       | 1.0.0   | Rich media components for marketing | Stable |
| [documentation/core](/interfaces/documentation/1.0.0/core/) | 1.0.0   | Documentation site components       | Stable |

## Contributing

We welcome proposals for new interfaces or improvements to existing ones. See our [CONTRIBUTING.md](CONTRIBUTING.md) for the process.

## Naming Playbook

| Guideline        | 👍 Good                          | 🚫 Bad                  |
| ---------------- | -------------------------------- | ----------------------- |
| Semantic nouns   | `FAQ`                            | `FAQAccordion`          |
| Preset as intent | `deck`                           | `three-up`              |
| Avoid geometry   | `Hero`                           | `TwoColumnHero`         |
| Domain clarity   | `ProductGallery` (in e-commerce) | `Gallery` (too generic) |

**Mnemonic:** describe **what** it is, not **how** it looks.

For complete naming guidelines, see [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md).

## Repository Structure

```
/
├── interfaces/          # 🟢 Stable interfaces (≥1.0.0)
│   ├── marketing/       # Marketing domain
│   │   ├── 1.0.0/       # Version 1.0.0
│   │   │   ├── core/    # Core concept
│   │   │   │   └── marketing-core.js
│   │   │   └── media/   # Media concept
│   │   │       └── marketing-media.js
│   │   └── 1.0.1/       # Patch version
│   │       └── ...
│   └── documentation/   # Documentation domain
│       └── 1.0.0/       # Version 1.0.0
│           ├── core/    # Core concept
│           │   └── documentation-core.js
│           ├── technical/
│           │   └── documentation-technical.js
│           └── learning/
│               └── documentation-learning.js
├── drafts/              # 🟠 0.x proposals
├── extensions/          # Extension pointers
├── schema/              # JSON Schema (validation)
├── scripts/             # Build scripts
└── docs/                # Documentation
    ├── blog/            # Conceptual articles
    ├── guidelines/      # Interface design guidelines
    └── governance/      # Process documentation
```

For more details on the repository structure, see [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md).

## Key Documentation

- [GLOSSARY.md](./GLOSSARY.md) - Definitions of key terms
- [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) - How interfaces are organized
- [INTERFACE_SPECIFICATION.md](./INTERFACE_SPECIFICATION.md) - How to specify interfaces
- [GOVERNANCE.md](./GOVERNANCE.md) - Interface lifecycle and governance
- [VERSION_STRATEGY.md](./docs/governance/VERSION_STRATEGY.md) - Versioning approach
- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - Component and preset naming guidelines
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute

## License

MIT

---

_Share. Fork. Disrupt. 🚀_
