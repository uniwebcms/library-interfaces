# Semantic Component Naming Conventions

## Core Philosophy

Library Interfaces define semantic components based on their **communication purpose**, not their visual implementation. The naming conventions in this guide help create a shared language between content creators and developers.

Our naming approach balances simplicity and clarity, focusing on how content creators naturally think about their content rather than technical implementation details.

## Component Naming Principles

### 1. Focus on Content Purpose

Components should be named for the specific type of content they present, not their visual structure:

| ✅ Good        | ❌ Avoid   | Why                                              |
| -------------- | ---------- | ------------------------------------------------ |
| `Hero`         | `Banner`   | "Hero" represents a specific marketing purpose   |
| `Features`     | `Grid`     | "Features" describes content purpose, not layout |
| `Testimonials` | `Carousel` | "Testimonials" defines what content to expect    |

Component names should immediately communicate what type of content belongs in them, enabling content creators to work without thinking about implementation details.

### 2. Use Domain-Specific Nouns

Components should use nouns that are specific to their domain:

| ✅ Domain-Specific | ❌ Generic | Why                                           |
| ------------------ | ---------- | --------------------------------------------- |
| `Pricing`          | `Table`    | "Pricing" indicates e-commerce purpose        |
| `Team`             | `Cards`    | "Team" defines organizational content         |
| `CourseOutline`    | `List`     | "CourseOutline" indicates educational purpose |

When selecting names, imagine how content creators would naturally describe what they're trying to communicate.

### 3. Keep Names Simple Yet Specific

Component names should be as simple as possible while still clearly communicating their purpose:

| ✅ Simple & Specific | ❌ Too Generic | ❌ Too Specific    | Why                                                       |
| -------------------- | -------------- | ------------------ | --------------------------------------------------------- |
| `Pricing`            | `Data`         | `ThreeTierPricing` | "Pricing" is clear without being restrictive              |
| `Team`               | `People`       | `TeamMemberGrid`   | "Team" communicates purpose without layout details        |
| `FAQ`                | `Questions`    | `AccordionFAQ`     | "FAQ" is widely understood without implementation details |

The goal is to create component names that intuitively fit into a content creator's thinking.

### 4. Use Presets for Variations

Rather than creating specialized component names (like `ProductFeatures` and `ServiceFeatures`), use presets to handle variations:

| Component      | Presets                           | Instead of Creating                           |
| -------------- | --------------------------------- | --------------------------------------------- |
| `Hero`         | `product`, `brand`, `campaign`    | `ProductHero`, `BrandHero`, `CampaignHero`    |
| `Features`     | `product`, `service`, `platform`  | `ProductFeatures`, `ServiceFeatures`          |
| `Testimonials` | `customer`, `partner`, `employee` | `CustomerTestimonials`, `PartnerTestimonials` |

This approach keeps the component library focused and intuitive while allowing rich customization options.

### 5. Use PascalCase for Components

All component names should use PascalCase (first letter of each word capitalized):

- `Hero`
- `Features`
- `TeamMembers`
- `VideoGallery`

This convention aligns with React component naming practices and makes component names stand out from other identifiers.

## Preset Naming Principles

### 1. Focus on Content Variation

Presets should describe specific content approaches or purposes:

| ✅ Purpose-Based | ❌ Layout-Based | Why                                        |
| ---------------- | --------------- | ------------------------------------------ |
| `featured`       | `large-top`     | Describes content emphasis, not layout     |
| `process`        | `three-column`  | Describes content type, not grid structure |
| `comparison`     | `side-by-side`  | Describes content purpose, not arrangement |

This helps content creators select presets based on their communication goals.

### 2. Use kebab-case for Multi-Word Presets

Unlike components, presets should use kebab-case (lowercase with hyphens) for multi-word names:

- `featured`
- `quick-start`
- `step-by-step`
- `case-study`

This creates a clear visual distinction between component names and preset names.

### 3. Keep Names Short but Clear

Preset names should be concise but descriptive:

| ✅ Concise & Clear | ❌ Too Short | ❌ Too Verbose                   |
| ------------------ | ------------ | -------------------------------- |
| `featured`         | `feat`       | `large-featured-display`         |
| `case-study`       | `cs`         | `detailed-case-study-format`     |
| `comparison`       | `comp`       | `side-by-side-comparison-layout` |

A good preset name immediately communicates its purpose without unnecessary words.

### 4. Be Consistent Across Components

When similar preset concepts apply to multiple components, use consistent naming:

| Concept              | Consistent Usage                                         |
| -------------------- | -------------------------------------------------------- |
| Featured content     | `featured` preset in `Team`, `Testimonials`, `CaseStudy` |
| Compact display      | `compact` preset in `Features`, `Pricing`, `FAQ`         |
| Detailed information | `detailed` preset in `Product`, `Team`, `CaseStudy`      |

This creates a predictable vocabulary for content creators.

## Examples from Real Interfaces

### Marketing Interface Components

- `Hero` - Primary attention-grabbing section at the top of a page
  - Presets: `brand`, `product`, `campaign`, `minimal`
- `Features` - Highlights product or service features and capabilities
  - Presets: `benefits`, `capabilities`, `process`
- `CTA` - Call-to-action element that drives specific user conversions
  - Presets: `primary`, `newsletter`, `demo`, `contact`
- `Testimonials` - Customer quotes and success stories
  - Presets: `featured`, `grid`, `carousel`, `minimal`
- `Pricing` - Product or service pricing information
  - Presets: `plans`, `packages`, `comparison`
- `Team` - Team member profiles and information
  - Presets: `leadership`, `department`, `featured`, `full`

### Documentation Interface Components

- `Document` - Main documentation content
  - Presets: `standard`, `plain`
- `APIReference` - Technical API documentation
  - Presets: `standard`, `endpoints`, `functions`
- `CodeExample` - Executable code examples with explanations
  - Presets: `standard`, `interactive`, `tutorial`
- `Tutorial` - Structured learning content with defined objectives
  - Presets: `standard`, `quickstart`, `project`

## Anti-Patterns to Avoid

### 1. Generic UI Pattern Names

❌ **Avoid:** `Carousel`, `Gallery`, `Chart`, `Table`, `Grid`, `Accordion`, `Content`, `Block`

✅ **Instead:** `ProductShowcase`, `MediaGallery`, `SalesMetrics`, `Pricing`, `Features`, `FAQ`

Generic UI pattern names make content creators think in terms of presentation rather than purpose.

### 2. Visual Structure in Names

❌ **Avoid:** `TwoColumnFeatures`, `GridLayout`, `SidebarNav`

✅ **Instead:** `Features`, `ContentLayout`, `Navigation`

### 3. Visual Styling in Names

❌ **Avoid:** `BlueHeader`, `RoundedCards`, `GradientBackground`

✅ **Instead:** `PageHeader`, `ResourceCards`, `HeroBackground`

### 4. Implementation in Names

❌ **Avoid:** `AccordionFAQ`, `CarouselTestimonials`, `TabsFeatures`

✅ **Instead:** `FAQ`, `Testimonials`, `Features`

### 5. Overly Specific Names for Simple Variations

❌ **Avoid:** `ProductFeatures`, `ServiceFeatures`, `PlatformFeatures`

✅ **Instead:** `Features` component with `product`, `service`, and `platform` presets

## When to Use More Specific Component Names

While simpler names with presets are generally preferred, more specific component names may be appropriate when:

1. **The content structure is fundamentally different** - Not just the presentation but the actual content elements, relationships, or semantics differ significantly
2. **The component serves a very specific domain purpose** - The component is so specialized that a generic name would be confusing
3. **The component combines multiple concepts** - The component represents a complex composite of other concepts

However, even in these cases, first consider whether presets could handle the variation before creating a new component name.

## Practical Tests for Good Names

### The Communication Purpose Test

If you showed the component name to a content creator unfamiliar with the technical implementation, would they immediately understand what type of content belongs in it?

### The Preset Flexibility Test

Can variations of this component be handled through presets, or are the differences fundamental enough to warrant separate components?

### The Redesign Test

If you completely redesigned the visual presentation, would the component name still make sense?

## Conclusion

Effective component naming focuses on content purpose, not implementation details. By using simple, clear, domain-specific names with well-defined presets, we create a component system that:

1. Makes intuitive sense to content creators
2. Gives developers implementation freedom
3. Creates a shared language between content and code
4. Scales effectively as the system grows

Remember: Component names should reflect how content creators think about their content, while presets handle variations in presentation and purpose.
