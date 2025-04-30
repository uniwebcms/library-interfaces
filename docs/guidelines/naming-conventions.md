# Naming Conventions for Library Interfaces

Effective naming is the foundation of Library Interfaces. The names we choose for components and presets shape how content creators think about their content and how developers implement libraries. This guide outlines principles and best practices for naming within the Uniweb ecosystem.

## The Core Principle: Communication Purpose, Not Generic Building Blocks

The central rule of Library Interface naming is to **describe the specific communication purpose** a component serves, not how it looks, how it's structured, or what generic UI pattern it uses. Library Interfaces are not collections of generic building blocks - they are semantic solutions for specific communication needs.

This means:

- Focus on the communication goal the component serves
- Name components based on the specific type of content they represent
- Avoid generic UI pattern names that make content creators think like developers
- Ensure names are tied to domain-specific communication purposes

## Component Naming Guidelines

### 1. Focus on Communication Purpose

Components should be named based on the specific communication need they fulfill:

| ✅ Communication-Focused | ❌ Generic Building Block | 💡 Why                                                            |
| ------------------------ | ------------------------- | ----------------------------------------------------------------- |
| `Hero`                   | `Banner`                  | "Hero" represents a specific marketing communication need         |
| `Features`               | `Grid`                    | "Features" describes product attributes, not just any grid layout |
| `Testimonials`           | `Carousel`                | "Testimonials" is the communication purpose, not the UI pattern   |
| `Pricing`                | `Table`                   | "Pricing" represents a specific commerce communication need       |

Generic UI patterns like "Carousel," "Gallery," or "Chart" should be avoided as component names because they don't specify a communication purpose - they're implementation patterns that could serve many different purposes.

### 2. Use Domain-Specific Semantic Nouns

Components should be named using domain-specific nouns that accurately describe their content purpose:

| ✅ Domain-Specific Names | ❌ Generic UI Pattern Names | 💡 Why                                       |
| ------------------------ | --------------------------- | -------------------------------------------- |
| `ProductComparison`      | `ComparisonTable`           | Specifies the e-commerce communication goal  |
| `CourseSyllabus`         | `Accordion`                 | Specifies the education communication goal   |
| `PatientDirectory`       | `SearchGrid`                | Specifies the healthcare communication goal  |
| `ReleaseTimeline`        | `Timeline`                  | Specifies the software documentation purpose |

A component name should immediately communicate its domain-specific purpose to content creators in that field.

### 3. Prioritize Simplicity While Maintaining Specificity

Choose the simplest, most direct component name that accurately describes the specific communication purpose:

| ✅ Simple & Specific | ❌ Too Generic | ❌ Unnecessarily Complex       | 💡 Why                                                 |
| -------------------- | -------------- | ------------------------------ | ------------------------------------------------------ |
| `Pricing`            | `Data`         | `PricingInformationDisplay`    | "Pricing" is specific to product pricing communication |
| `Team`               | `People`       | `TeamMemberProfilesSection`    | "Team" specifies organizational context                |
| `ProductFeatures`    | `List`         | `ProductFeaturesWithIconsGrid` | "ProductFeatures" specifies the product context        |

The goal is to create component names that are intuitive and domain-specific for content creators while giving developers implementation freedom.

### 4. Find the Right Level of Specificity

Component names should be specific enough to convey clear communication purpose but not so specific that they limit implementation:

| ✅ Good Balance   | ❌ Too Generic | ❌ Too Specific      | 💡 Why                                                   |
| ----------------- | -------------- | -------------------- | -------------------------------------------------------- |
| `Pricing`         | `Data`         | `ThreeTierPricing`   | "Pricing" provides clear purpose without limiting design |
| `Team`            | `People`       | `CircularTeamPhotos` | "Team" is specific to organization context               |
| `ProductFeatures` | `Items`        | `FeaturesWithIcons`  | "ProductFeatures" communicates specific product context  |
| `API`             | `Code`         | `TabbedAPIReference` | "API" clearly communicates technical reference           |

Ask yourself: Does the name convey a specific communication purpose while giving developers freedom to determine presentation?

### 5. Use CamelCase for Components

All component names should use CamelCase (also known as PascalCase) with the first letter capitalized:

- `Hero`
- `ProductFeatures`
- `CTA`
- `CustomerTestimonials`

This convention aligns with React component naming conventions and makes component names easily distinguishable from other identifiers.

### 6. Avoid Implementation Technology

Component names should never reference implementation technologies:

| ✅ Purpose-Focused | ❌ Implementation-Specific |
| ------------------ | -------------------------- |
| `ProductGallery`   | `ReactSlider`              |
| `SiteSearch`       | `AlgoliaSearch`            |
| `CaseStudies`      | `LightboxGallery`          |
| `SalesMetrics`     | `D3Chart`                  |

The implementation technology may change over time, but the communication purpose remains the same.

### 7. Match Domain Terminology

Use terminology that content creators in the domain naturally understand:

| Domain        | ✅ Domain-Appropriate | ❌ Generic Alternative |
| ------------- | --------------------- | ---------------------- |
| E-commerce    | `ProductDetail`       | `Item`                 |
| Education     | `CourseLesson`        | `Content`              |
| Documentation | `APIReference`        | `Code`                 |
| Healthcare    | `ProviderDirectory`   | `List`                 |

Domain-specific terms create clearer meaning for content creators in that field and avoid generic building block thinking.

### 8. Use Domain Context When Needed for Clarity

Always include domain context when it helps clarify the specific communication purpose:

| ✅ Clear Domain Context | ❌ Generic UI Pattern | 💡 Why Include Domain Context        |
| ----------------------- | --------------------- | ------------------------------------ |
| `ProductGallery`        | `Gallery`             | Specifies e-commerce product context |
| `CourseSchedule`        | `Calendar`            | Specifies educational purpose        |
| `PatientForm`           | `Form`                | Specifies healthcare context         |
| `EventRegistration`     | `SignupForm`          | Specifies event-specific purpose     |

Generic UI pattern names like "Gallery," "Calendar," or "Form" don't specify communication purpose and should be avoided as standalone component names.

## Preset Naming Guidelines

### 1. Use Descriptive Terms for Content Variations

Presets should describe specific variations in how content is used or presented:

| ✅ Good Preset Names | ❌ Avoid These Names | 💡 Why                                          |
| -------------------- | -------------------- | ----------------------------------------------- |
| `featured`           | `option1`            | Describes content purpose, not arbitrary option |
| `compact`            | `small`              | Focuses on content density, not just size       |
| `detailed`           | `large`              | Describes information depth, not just size      |
| `promotional`        | `special`            | Specifies the marketing intent                  |
| `technical`          | `variant2`           | Describes content approach                      |

### 2. Use kebab-case for Multi-Word Presets

Unlike components, presets should use kebab-case (lowercase with hyphens) for multi-word names:

- `case-study`
- `quick-start`
- `step-by-step`
- `product-comparison`

This creates a clear visual distinction between component names and preset names.

### 3. Focus on Content Variation, Not Layout

Presets should describe how the content varies in purpose or approach, not how it's visually arranged:

| ✅ Purpose-Based Presets | ❌ Layout-Based Presets | 💡 Why                                     |
| ------------------------ | ----------------------- | ------------------------------------------ |
| `featured`               | `large-top`             | Describes content emphasis, not layout     |
| `process`                | `three-up`              | Describes content type, not grid structure |
| `comparison`             | `side-by-side`          | Describes content purpose, not arrangement |
| `showcase`               | `alternating`           | Describes content intent, not pattern      |

A content creator should be able to select a preset based on what their content represents, not how they want it arranged.

### 4. Keep Names Short but Clear

Preset names should be concise but descriptive:

| ✅ Concise & Clear | ❌ Too Short | ❌ Too Verbose                         |
| ------------------ | ------------ | -------------------------------------- |
| `benefits`         | `ben`        | `customer-focused-benefits-list`       |
| `case-study`       | `cs`         | `detailed-customer-case-study-example` |
| `quick-start`      | `qs`         | `beginning-guide-for-new-users`        |

A good preset name immediately communicates its purpose without unnecessary words.

### 5. Be Consistent Across Components

When the same preset concept applies to multiple components, use consistent naming:

| Concept              | Consistent Usage Across Components                     |
| -------------------- | ------------------------------------------------------ |
| Featured content     | `featured` preset in `Team`, `Product`, `Testimonials` |
| Compact display      | `compact` preset in `Features`, `Pricing`, `FAQ`       |
| Detailed information | `detailed` preset in `Product`, `Team`, `CaseStudy`    |

This consistency creates an intuitive vocabulary for content creators.

## Examples from Real Interfaces

### Marketing Interface Components

- `Hero` - Primary attention-grabbing section at the top of a page
- `ProductFeatures` - Highlights product or service features
- `CTA` - Call-to-action to drive conversions
- `CustomerTestimonials` - Customer quotes and success stories
- `Pricing` - Product or service pricing information
- `Team` - Information about team members

### Documentation Interface Components

- `DocumentContent` - Main documentation content rendered from markdown
- `SiteNavigation` - Site navigation and search component
- `TableOfContents` - Page-level table of contents
- `APIReference` - Technical API documentation
- `CodeExample` - Runnable code samples with explanations

## Anti-Patterns to Avoid

### 1. Generic UI Pattern Names

❌ **Avoid:** `Carousel`, `Gallery`, `Chart`, `Table`, `Grid`, `Accordion`

✅ **Instead:** `ProductShowcase`, `CustomerStories`, `SalesMetrics`, `PricingOptions`, `TeamMembers`, `FAQ`

Generic UI pattern names make content creators think in terms of presentation rather than communication purpose.

### 2. Visual Structure in Names

❌ **Avoid:** `TwoColumnFeatures`, `GridLayout`, `SidebarNav`

✅ **Instead:** `ProductFeatures`, `CategoryLayout`, `SiteNavigation`

### 3. Visual Styling in Names

❌ **Avoid:** `BlueHeader`, `RoundedCards`, `GradientBackground`

✅ **Instead:** `PageHeader`, `ResourceCards`, `HeroBackground`

### 4. UI Patterns in Names

❌ **Avoid:** `AccordionFAQ`, `CarouselTestimonials`, `TabsFeatures`

✅ **Instead:** `FAQ`, `CustomerTestimonials`, `ProductFeatures`

### 5. Implementation Details in Names

❌ **Avoid:** `ReactSlider`, `FlexboxContainer`, `JavaScriptCalculator`

✅ **Instead:** `ProductGallery`, `ContentContainer`, `PriceCalculator`

### 6. Redundant Words

❌ **Avoid:** `PricingDisplaySection`, `TeamMemberProfilesContainer`

✅ **Instead:** `Pricing`, `Team`

## Practical Tests for Good Names

### The Communication Purpose Test

Does the name clearly convey a specific communication purpose rather than a generic UI pattern?

### The Domain Expert Test

Would a domain expert (not a developer) immediately understand what type of content belongs in this component?

### The Redesign Test

If you completely redesigned the visual presentation, would the component name still accurately represent the communication purpose?

### The Cross-Library Test

If multiple libraries implemented this component with different visual approaches, would the name still clearly communicate its purpose?

## Converting Problematic Names

When improving existing component names, follow these patterns:

| Original Name | Improved Name       | What Changed                             |
| ------------- | ------------------- | ---------------------------------------- |
| `Table`       | `PricingPlans`      | Added specific communication purpose     |
| `Carousel`    | `ProductShowcase`   | Replaced UI pattern with purpose         |
| `Gallery`     | `ProjectPortfolio`  | Added domain-specific purpose            |
| `Form`        | `ContactRequest`    | Added specific form purpose              |
| `Tabs`        | `ProductCategories` | Replaced UI pattern with content meaning |

## Conclusion

Good naming is essential to the success of Library Interfaces. By focusing on specific communication purpose rather than generic UI patterns, we create a system that:

1. Helps content creators think in terms of communication goals, not UI implementation
2. Avoids turning interfaces into collections of generic building blocks
3. Maintains the focus on domain-specific content purposes
4. Ensures components represent specific solutions for communication needs

Remember the guiding principle: **Name components for the specific communication purpose they serve, not as generic UI building blocks.**
