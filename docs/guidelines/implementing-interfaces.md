# Implementing Library Interfaces

This guide provides practical advice for component library developers implementing Library Interfaces in their own libraries.

## Understanding Implementation Requirements

When implementing a Library Interface, you commit to providing:

1. **All required components** with their exact names
2. **All presets** for each component
3. **Semantic behavior** that fulfills the purpose described

You have complete freedom in:

1. **Visual design** - How components look
2. **Technical implementation** - How components are built
3. **Parameter structure** - What configuration options you provide
4. **Additional features** - Extending beyond the base requirements

## Implementation Workflow

### 1. Choosing an Interface

First, select which interface to implement:

```bash
# List available interfaces
uniweb list interfaces
```

Consider:

- Does this interface match your domain focus?
- Will you implement all components, or need to extend it?
- Do you understand the semantic purpose of each component?

### 2. Declaring Implementation

In your library's package metadata, declare which interfaces you implement:

```json
{
  "name": "acme-marketing-components",
  "version": "1.0.0",
  "description": "ACME's marketing component library",
  "interfaces": ["marketing-v1.0"]
}
```

This indicates to tools and users that your library claims compatibility with these interfaces.

### 3. Component Implementation

For each component in the interface, create a corresponding component in your library:

```jsx
// Example implementation of the Hero component from marketing-v1.0
function Hero({ content, params }) {
  // Extract parameters with defaults
  const preset = params.preset || "brand";
  const theme = params.theme || "light";

  // Different implementations based on preset
  switch (preset) {
    case "brand":
      return <BrandHero content={content} theme={theme} />;
    case "product":
      return <ProductHero content={content} theme={theme} />;
    case "campaign":
      return <CampaignHero content={content} theme={theme} />;
    case "minimal":
      return <MinimalHero content={content} theme={theme} />;
    default:
      return <DefaultHero content={content} theme={theme} />;
  }
}
```

Remember that:

- Component names must match exactly (case-sensitive)
- All presets must be implemented
- The semantic purpose of each preset should be honored

### 4. Validating Your Implementation

You can validate your implementation against the interface:

```bash
uniweb validate-library ./my-library marketing-v1.0
```

This checks:

- All required components exist
- All required presets are supported
- Your documentation accurately reflects the interface

## Best Practices

### 1. Focus on Semantic Purpose

When implementing components, focus on the semantic purpose described in the interface:

```javascript
// Example: FeatureShowcase from marketing-v1.0
// Interface description: "Highlights product or service features"
// Presets:
// - "benefits" - Focusing on customer benefits
// - "capabilities" - Focusing on technical capabilities
// - "process" - Showing a process or how something works
```

Your implementation should fulfill this purpose, regardless of the specific visual approach:

- A `benefits` preset should emphasize what users gain
- A `capabilities` preset should focus on technical features
- A `process` preset should show sequential steps

The design language, layout approach, and specific styling are entirely up to you.

### 2. Implement All Presets

Each preset represents a specific content variation that content creators expect:

```jsx
function Testimonials({ content, params }) {
  const preset = params.preset || "featured";

  switch (preset) {
    case "featured":
      // Single highlighted testimonial
      return <FeaturedTestimonial content={content} params={params} />;
    case "collection":
      // Multiple testimonials
      return <TestimonialCollection content={content} params={params} />;
    case "carousel":
      // Rotating testimonials
      return <TestimonialCarousel content={content} params={params} />;
    case "quotes":
      // Pull-quote style testimonials
      return <TestimonialQuotes content={content} params={params} />;
    default:
      return <DefaultTestimonial content={content} params={params} />;
  }
}
```

Don't skip presets, even if they seem similar. Each has a distinct purpose.

### 3. Add Parameters for Deeper Customization

While interfaces define components and presets, they don't standardize parameters. You should add your own parameters to enable deeper customization:

```jsx
function PricingDisplay({ content, params }) {
  // Interface-required presets
  const preset = params.preset || "plans";

  // Library-specific parameters (with sensible defaults)
  const {
    accentColor = "#4a90e2",
    showComparison = true,
    highlightRecommended = true,
    currency = "USD",
  } = params;

  // Implement based on preset and parameters
  // ...
}
```

These additional parameters allow content creators to customize your implementation while maintaining semantic compatibility.

### 4. Use Internal Components for Implementation

Separate your interface-compliant components from their implementation details:

```jsx
// Public component that matches the interface
function FeatureShowcase(props) {
  // Extract preset and handle interface requirements
  const preset = props.params?.preset || "benefits";

  // Use internal components for actual implementation
  switch (preset) {
    case "benefits":
      return <BenefitGrid {...props} />;
    case "capabilities":
      return <CapabilityTable {...props} />;
    case "process":
      return <ProcessFlow {...props} />;
    default:
      return <DefaultFeatures {...props} />;
  }
}

// Internal component with implementation details
function BenefitGrid({ content, params }) {
  // Implementation-specific logic
  // ...
}
```

This approach keeps your interface-compliant layer thin while allowing complex implementations.

### 5. Handle Content Structure Variations

Be flexible in how you handle content structure:

```jsx
function TeamSection({ content, params }) {
  // Always have fallbacks for missing content
  const teamTitle = content.main?.title || "Our Team";
  const introduction = content.main?.paragraphs?.[0] || "";

  // Handle different content structures gracefully
  const teamMembers = content.items || [];

  // Render with appropriate fallbacks
  return (
    <div className="team-section">
      <h2>{teamTitle}</h2>
      {introduction && <p className="introduction">{introduction}</p>}

      {teamMembers.length > 0 ? (
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} member={member} />
          ))}
        </div>
      ) : (
        <p className="no-members">Team information coming soon.</p>
      )}
    </div>
  );
}
```

Good implementations degrade gracefully when content is missing or incomplete.

## Testing Interface Compatibility

### Content Samples

Create content samples for each component and preset:

```markdown
---
component: Hero
preset: product
---

# Revolutionary Product

Transform your workflow with our innovative solution.

![Product Image](/images/product.jpg)

[Get Started](#){button-primary}
[Learn More](#){button-secondary}
```

Test these samples with your implementation to ensure compatibility.

### Automated Testing

Create tests that validate your implementation against the interface:

```javascript
test("Hero implements all required presets", () => {
  const requiredPresets = ["brand", "product", "campaign", "minimal"];

  // Mock content for testing
  const mockContent = {
    main: {
      title: "Test Title",
      paragraphs: ["Test paragraph"],
      images: [],
      links: [],
    },
  };

  // Test each preset
  requiredPresets.forEach((preset) => {
    const { container } = render(
      <Hero content={mockContent} params={{ preset }} />
    );

    // Verify rendering without errors
    expect(container).not.toBeEmptyDOMElement();
  });
});
```

### Visual Testing

Create a visual testing suite that shows how each component and preset renders:

```jsx
function InterfaceGallery() {
  return (
    <div className="interface-gallery">
      <h1>Marketing Interface Implementation</h1>

      <section>
        <h2>Hero Component</h2>

        <div className="preset-example">
          <h3>Brand Preset</h3>
          <Hero content={sampleContent.hero} params={{ preset: "brand" }} />
        </div>

        <div className="preset-example">
          <h3>Product Preset</h3>
          <Hero content={sampleContent.hero} params={{ preset: "product" }} />
        </div>

        {/* More presets... */}
      </section>

      {/* More components... */}
    </div>
  );
}
```

This gallery helps validate implementation visually and serves as documentation.

## Common Implementation Challenges

### Challenge 1: Balancing Semantic Purpose with Visual Design

**Problem:** Your design system's visual language doesn't obviously match the semantic presets.

**Solution:** Focus on the intent behind each preset rather than the name. For example, a `featured` preset means highlighting important content, regardless of how your design system visually emphasizes elements.

### Challenge 2: Handling Complex Content Structures

**Problem:** Content can be structured in various ways within the same semantic component.

**Solution:** Build flexible components that adapt to different content structures:

```jsx
function FeatureShowcase({ content, params }) {
  // Handle both single-level and two-level feature structures
  const features = content.items || [];
  const hasCategories = features.some((item) => item.items?.length > 0);

  if (hasCategories) {
    // Render grouped features
    return <CategoryFeatures features={features} params={params} />;
  } else {
    // Render flat feature list
    return <SimpleFeatures features={features} params={params} />;
  }
}
```

### Challenge 3: Maintaining Backward Compatibility

**Problem:** The interface evolves with minor updates, adding new presets you need to support.

**Solution:** Implement with extensibility in mind:

```jsx
function CTASection({ content, params }) {
  const preset = params.preset || "primary";

  // Map of presets to implementations
  const presetImplementations = {
    primary: PrimaryCTA,
    newsletter: NewsletterCTA,
    demo: DemoCTA,
    contact: ContactCTA,
    // New preset added in minor update
    webinar: WebinarCTA,
  };

  // Get implementation or fall back to default
  const Implementation = presetImplementations[preset] || PrimaryCTA;

  return <Implementation content={content} params={params} />;
}
```

This approach makes adding new presets straightforward.

## Beyond the Interface: Extra Value

While maintaining interface compatibility, you can add extra value:

### 1. Enhanced Presets

Offer additional presets beyond the interface requirements:

```jsx
// Required presets: featured, collection, carousel, quotes
// Extra value presets:
const testimonialPresets = {
  // Required by interface
  featured: FeaturedTestimonial,
  collection: TestimonialCollection,
  carousel: TestimonialCarousel,
  quotes: TestimonialQuotes,
  // Extra value
  video: VideoTestimonial,
  "case-study": CaseStudyTestimonial,
  rating: RatingTestimonial,
};
```

### 2. Specialized Versions of Components

Create more specialized versions of interface components for specific use cases:

```jsx
// Interface-compliant component
export function PricingDisplay(props) {
  // Standard implementation
}

// Specialized versions
export function EnterprisePricing(props) {
  // Specialized for enterprise pricing
  return (
    <PricingDisplay {...props} params={{ ...props.params, enterprise: true }} />
  );
}

export function FreemiumPricing(props) {
  // Specialized for freemium models
  return (
    <PricingDisplay {...props} params={{ ...props.params, freemium: true }} />
  );
}
```

### 3. Integration with Other Systems

Add integrations with other systems while maintaining interface compatibility:

```jsx
function ContactForm({ content, params, integrations }) {
  // Standard implementation from interface
  const preset = params.preset || "simple";

  // Extra functionality through integrations
  const { crm = null, analytics = null } = integrations || {};

  function handleSubmit(data) {
    // Standard form handling

    // Integration with external systems (extra value)
    if (crm) crm.createLead(data);
    if (analytics) analytics.trackConversion("contact_form");
  }

  return <form onSubmit={handleSubmit}>{/* Form implementation */}</form>;
}
```

## Conclusion

Implementing a Library Interface creates a bridge between content creators and your component library. By focusing on the semantic purpose while bringing your unique design vision, you create a powerful tool that:

1. Speaks the same language as content creators
2. Expresses your unique design approach
3. Remains compatible with content created for other implementations
4. Provides clear upgrade paths as interfaces evolve

Remember that interfaces are about semantic meaning, not visual implementation. Your library's value comes from how effectively it communicates that meaning through your unique design language.
