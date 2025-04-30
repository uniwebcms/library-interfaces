### 2. Use CamelCase

All component names should use CamelCase (also known as PascalCase) with the first letter capitalized:

- `Hero`
- `FeatureShowcase`
- `ProductComparison`
- `TeamSection`

This convention aligns with React component naming standards and makes component names easily distinguishable from other identifiers.

### 3. Be Specific But Not Too Specific

Component names should be specific enough to convey clear purpose, but not so specific that they limit implementation:

| ✅ Good Balance   | ❌ Too Generic | ❌ Too Specific                |
| ----------------- | -------------- | ------------------------------ |
| `PricingTable`    | `DataTable`    | `ThreeTierPricingGrid`         |
| `TeamSection`     | `Section`      | `CircularTeamPhotosWithHover`  |
| `FeatureShowcase` | `ContentBlock` | `ThreeColumnFeaturesWithIcons` |

**Finding the right balance**: If a name would make sense regardless of how the content is visually presented, it's likely at the right level of specificity.

### 4. Match Domain Terminology

Components should use terminology that content creators in the domain naturally understand:

| Domain        | ✅ Domain-Appropriate | ❌ Generic Alternative |
| ------------- | --------------------- | ---------------------- |
| E-commerce    | `ProductDetail`       | `ItemInfo`             |
| Education     | `LessonOutline`       | `ContentList`          |
| Documentation | `APIReference`        | `CodeBlock`            |

### 5. Choose Domain Scope Appropriately

Components in specialized domains should include domain context when they might be confusing in broader contexts:

| ✅ Domain-Scoped                | ❌ Potential Confusion   |
| ------------------------------- | ------------------------ |
| `ProductCarousel` in e-commerce | `Carousel` (too generic) |
| `ArticleFeed` in blogs          | `Feed` (too generic)     |
| `CourseSchedule` in education   | `Schedule` (too generic) |

However, don't add domain prefixes when the component is already clearly domain-specific:

| ✅ Clear Without Prefix | ❌ Redundant Prefix        |
| ----------------------- | -------------------------- |
| `ShoppingCart`          | `EcommerceShoppingCart`    |
| `TeamMember`            | `CompanyTeamMember`        |
| `APIEndpoint`           | `DocumentationAPIEndpoint` |

## Preset Naming Guidelines

### 1. Use Descriptive Adjectives or Nouns

Presets should describe the content variation using adjectives, nouns, or short phrases:

| ✅ Good Preset Names | ❌ Avoid These Names |
| -------------------- | -------------------- |
| `featured`           | `option1`            |
| `compact`            | `small`              |
| `detailed`           | `large`              |
| `promotional`        | `special`            |
| `technical`          | `variant2`           |

### 2. Use kebab-case for Multi-Word Presets

Unlike components, presets should use kebab-case (lowercase with hyphens) for multi-word names:

- `featured-product`
- `step-by-step`
- `case-study`
- `social-proof`

This creates a clear visual distinction between component names and preset names.

### 3. Focus on Intent, Not Layout

Presets should describe the content purpose or variation, not the visual layout:

| ✅ Purpose-Based Presets | ❌ Layout-Based Presets |
| ------------------------ | ----------------------- |
| `featured`               | `large-top`             |
| `process`                | `three-up`              |
| `comparison`             | `side-by-side`          |
| `testimonial`            | `alternating`           |

**Why it matters**: If a content creator selects a preset named `three-up`, they're thinking about layout. If they select `comparison`, they're thinking about content purpose, which is much more portable across implementations.

### 4. Keep Names Short but Clear

Preset names should be concise but descriptive:

| ✅ Concise & Clear | ❌ Too Short | ❌ Too Verbose                         |
| ------------------ | ------------ | -------------------------------------- |
| `benefits`         | `ben`        | `customer-focused-benefits-list`       |
| `case-study`       | `cs`         | `detailed-customer-case-study-example` |
| `quick-start`      | `qs`         | `beginning-guide-for-new-users`        |

### 5. Be Consistent Across Components

When the same preset concept applies to multiple components, use consistent naming:

| Concept              | Consistent Usage                                              |
| -------------------- | ------------------------------------------------------------- |
| Featured content     | `featured` preset in `TeamMember`, `Product`, `Testimonial`   |
| Compact display      | `compact` preset in `FeatureList`, `PricingTable`, `FAQ`      |
| Detailed information | `detailed` preset in `ProductInfo`, `TeamMember`, `CaseStudy` |

This consistency creates an intuitive vocabulary for content creators.

## Real-World Examples

### Marketing Interface Components

- `Hero` - Primary attention-grabbing section at the top of a page
- `FeatureShowcase` - Highlights product or service features
- `CTASection` - Call-to-action section to drive conversions
- `Testimonials` - Customer quotes and success stories
- `PricingDisplay` - Product or service pricing information

### Documentation Interface Components

- `DocumentPage` - Main documentation content rendered from markdown
- `NavBar` - Site navigation and search component
- `TableOfContents` - Page-level table of contents
- `APIReference` - Technical API documentation
- `CodeExample` - Runnable code samples with explanations

## Practical Test: Is Your Name Semantic?

To test if your component or preset name is sufficiently semantic:

1. **The Switch Test**: If the visual implementation changed completely, would the name still make sense?
2. **The Content Creator Test**: Does the name focus on what the content represents rather than how it looks?
3. **The Future-Proof Test**: Will the name still be appropriate as design trends evolve?
4. **The Domain Expert Test**: Would a non-technical domain expert understand what the name represents?

If you can answer "yes" to all these questions, your name is likely well-chosen.

## Common Pitfalls to Avoid

1. **Including layout information**: `TwoColumnFeatures`, `GridLayout`
2. **Including visual style**: `BlueHeader`, `RoundedCards`
3. **Including technology details**: `ReactSlider`, `FlexboxContainer`
4. **Vague or meaningless names**: `Section1`, `ContentBlock`, `Component`
5. **Mixing naming conventions**: `teamMember` (should be `TeamMember`)

Remember the guiding principle: Name components and presets for what they mean to content creators, not how they'll be implemented.
