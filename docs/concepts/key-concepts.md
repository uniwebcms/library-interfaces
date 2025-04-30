# Library Interfaces: Key Concepts

This document explains the core concepts behind Library Interfaces and how they create a semantic bridge between content and implementation.

## The Problem: Content-Code Separation

Content creation and development are separate domains with different priorities:

- **Content creators** think about messages, audience needs, and what they want to communicate
- **Developers** think about components, props, and implementation details

This disconnect creates challenges:

1. **Content creators** must learn technical details to express their needs
2. **Developers** struggle to anticipate all the ways content will be used
3. **Content** becomes tightly coupled to specific implementations
4. **Design changes** often require content updates

## The Solution: Semantic Component Standards

Library Interfaces solve these problems by defining **semantic component standards** that:

1. Create a shared language focused on content purpose
2. Allow content creators to think in terms of communication goals
3. Give developers implementation freedom while meeting content needs
4. Enable content portability across different visual implementations

## Core Building Blocks

### Semantic Components

Components in Library Interfaces represent **content purpose** rather than visual structure:

| Traditional Components | Semantic Components |
| ---------------------- | ------------------- |
| `Grid`                 | `FeatureShowcase`   |
| `Card`                 | `TeamMember`        |
| `ThreeColumnLayout`    | `PricingPlans`      |

This shift lets content creators think in terms of what they want to communicate:

| Instead of thinking...                     | They can think...                         |
| ------------------------------------------ | ----------------------------------------- |
| "I need a three-column grid with icons"    | "I need to showcase product benefits"     |
| "I need a carousel with testimonial cards" | "I need to feature customer testimonials" |
| "I need a hero image with text overlay"    | "I need a product-focused hero section"   |

### Presets

Presets define specific variations of a component's content purpose:

```markdown
---
component: FeatureShowcase
preset: benefits
---

# How Our Product Helps You

## Save Time

Our automation saves you hours each week...

## Reduce Costs

Cut operational expenses by up to 30%...

## Improve Quality

AI-powered insights help you deliver better results...
```

The `benefits` preset communicates that this content focuses on customer benefits, but doesn't dictate the visual layout.

### Interfaces

An Interface brings together a collection of semantic components and presets for a specific domain purpose:

```js
// marketing-v1.0.js
export default {
  id: "marketing-v1.0",
  version: "1.0.0",
  description: "Standard interface for marketing websites",
  components: {
    Hero: {
      description: "Primary attention-grabbing section at the top of a page",
      presets: ["brand", "product", "campaign", "minimal"],
    },
    FeatureShowcase: {
      description: "Highlights product or service features",
      presets: ["benefits", "capabilities", "process"],
    },
    // More components...
  },
};
```

## The Three-Layer Model

Library Interfaces operate within a layered architecture:

```
Layer 2: Parameter Standards (future)
  ↑ Standardized prop names & types
Layer 1: Library Interfaces (this repo)
  ↑ Semantic component & preset names
Layer 0: Purpose-Built Component Libraries
  ↑ Complete implementation freedom
Content: Markdown with front matter
```

### Layer 0: Purpose-Built Component Libraries (PBCLs)

- Complete freedom in implementation
- Brand-specific visual design
- Any parameter structure
- Any rendering technology

### Layer 1: Library Interfaces

- Standardized component and preset names
- Focus on semantic meaning, not visual structure
- No parameter standardization (yet)
- Multiple PBCLs can implement the same interface

### Layer 2: Parameter Standards (future)

- Will standardize parameter names and types
- Only when needed for deeper compatibility
- Still focused on semantics, not visual structure

## How It Works

### For Content Creation

Content creators choose components based on what they want to communicate:

```markdown
---
component: FeatureShowcase
preset: benefits
---

# How Our Product Helps You

## Save Time

Our automation saves you hours each week...

## Reduce Costs

Cut operational expenses by up to 30%...
```

### For Library Development

Developers implement interfaces by creating components that serve the semantic purpose:

```jsx
// Implementing the FeatureShowcase component
function FeatureShowcase({ content, params = {} }) {
  // Different semantic approaches based on preset
  const preset = params.preset || "benefits";

  switch (preset) {
    case "benefits":
      return <BenefitDisplay content={content} />;
    case "capabilities":
      return <CapabilityDisplay content={content} />;
    case "process":
      return <ProcessDisplay content={content} />;
    default:
      return <DefaultDisplay content={content} />;
  }
}
```

The developer has complete freedom in how to implement each semantic preset.

## Benefits of Library Interfaces

### For Content Teams

1. **Domain-specific language** - Work with terms that match your content purpose
2. **Focus on communication** - Think about what to say, not how to display it
3. **Content portability** - Content works across any library implementing the interface
4. **Future-proof content** - Content remains valid even as design trends change

### For Library Developers

1. **Clear expectations** - Know exactly which components to implement
2. **Creative freedom** - Implement components in your own visual style
3. **Focused innovation** - Improve how content is presented without changing what it means
4. **Versioning clarity** - Communicate breaking changes through version numbers

## Versioning and Compatibility

Library Interfaces use semantic versioning to maintain compatibility:

| Version type      | Allowed changes                     | Compatible with  | Requires content updates? |
| ----------------- | ----------------------------------- | ---------------- | ------------------------- |
| **MAJOR** `2.0.0` | Remove/rename components or presets | Nothing older    | Possibly                  |
| **MINOR** `1.1.0` | Add new components or presets       | All `1.x`        | No                        |
| **PATCH** `1.0.1` | Documentation improvements          | Same major/minor | No                        |

This approach ensures that:

1. Content can safely use any library that implements the same major version
2. Libraries can add new capabilities without breaking existing content
3. Breaking changes are clearly signaled through major version bumps

## The Power of Separation

By separating what content means from how it looks, Library Interfaces create a flexible system where:

1. **Content creators** can focus on communication without technical constraints
2. **Developers** can implement creative designs without breaking content
3. **The same content** can be visualized in completely different ways
4. **Both domains** can evolve independently at their own pace

This separation is the key advantage over traditional approaches where content structure and visual design are tightly coupled.
