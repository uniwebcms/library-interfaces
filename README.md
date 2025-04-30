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
# Install the Uniweb CLI globally
npm install -g @uniwebcms/toolkit
```

This makes the `uniweb` command available in your terminal.

### Browse Available Interfaces

```bash
# With the CLI
uniweb list interfaces

# Output
marketing-v1.0     Essential marketing site components
documentation-v1.0 Standard documentation site components
```

### Get Interface Details

```bash
# View details of a specific interface
uniweb get interface marketing-v1.0

# Output
ID: marketing-v1.0
Version: 1.0.0
Description: Essential marketing site components

Components:
- Hero (presets: brand, product, campaign, minimal)
- FeatureShowcase (presets: benefits, capabilities, process)
# ...
```

### Validate Implementation

```bash
# Check if a library correctly implements an interface
uniweb validate-library my-marketing-components marketing-v1.0

# Check if content uses valid components from an interface
uniweb validate-content ./content marketing-v1.0
```

## Interface Structure

Each interface defines a set of semantic components and their presets:

```js
// marketing-v1.0.js
export default {
  id: "marketing-v1.0",
  version: "1.0.0",
  description: "Standard interface for marketing websites",
  components: {
    Hero: {
      description: "Primary attention-grabbing section",
      presets: [
        "brand", // Company/brand-focused hero
        "product", // Product-focused hero
        "campaign", // Special campaign or promotion hero
        "minimal", // Simplified, text-focused hero
      ],
    },

    // More components...
  },
};
```

## Versioning Rules (Crystal‑Clear Edition)

| Version type      | Allowed changes                                            | Guaranteed to work with | Requires markdown edits? |
| ----------------- | ---------------------------------------------------------- | ----------------------- | ------------------------ |
| **MAJOR** `2.0.0` | Remove or rename components/presets; restructure hierarchy | nothing older           | maybe ✔                  |
| **MINOR** `1.1.0` | **Only add** components or presets                         | all `1.x`               | never ✖                  |
| **PATCH** `1.0.1` | Fix typos, docs, non‑breaking tweaks                       | same major/minor        | never ✖                  |

- If your proposal _breaks_ existing markdown, it's a **MAJOR**.
- If it's purely additive, it's a **MINOR**.
- Docs only? **PATCH**.

## Available Interfaces

| Interface                                   | Version | Purpose                                 | Status |
| ------------------------------------------- | ------- | --------------------------------------- | ------ |
| [Marketing](/interfaces/marketing/)         | 1.0     | Marketing websites and landing pages    | Stable |
| [Documentation](/interfaces/documentation/) | 1.0     | Documentation sites and knowledge bases | Stable |

## Contributing

We welcome proposals for new interfaces or improvements to existing ones. See our [Contributing Guide](CONTRIBUTING.md) for the process.

## Naming Playbook

| Guideline        | 👍 Good                          | 🚫 Bad                  |
| ---------------- | -------------------------------- | ----------------------- |
| Semantic nouns   | `FAQ`                            | `FAQAccordion`          |
| Preset as intent | `deck`                           | `three-up`              |
| Avoid geometry   | `Hero`                           | `TwoColumnHero`         |
| Domain clarity   | `ProductGallery` (in e-commerce) | `Gallery` (too generic) |

**Mnemonic:** describe **what** it is, not **how** it looks.

## Repository Structure

```
/
├── interfaces/          # 🟢 Stable interfaces (≥1.0.0)
│   ├── marketing/
│   │   ├── marketing-v1.0.js
│   │   └── CHANGELOG.md
│   └── documentation/
│       ├── documentation-v1.0.js
│       └── CHANGELOG.md
├── drafts/              # 🟠 0.x proposals
├── extensions/          # 🔗 JSON pointers to 3rd-party repos
├── schema/              # JSON Schema (validation)
└── docs/                # Documentation
    ├── concepts/        # Conceptual explanations
    ├── guidelines/      # Interface design guidelines
    └── governance/      # Process documentation
```

## License

MIT – because ideas should travel faster than lawyers.

---

_Share. Fork. Disrupt. 🚀_
