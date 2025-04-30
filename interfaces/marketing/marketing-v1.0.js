/**
 * Marketing Interface v1.0
 *
 * A semantic component interface for marketing websites that provides
 * components focused on specific marketing communication purposes.
 *
 * This interface focuses on semantic meaning rather than visual implementation,
 * allowing different libraries to implement these components in unique ways
 * while maintaining content compatibility.
 */

export default {
  description: "Essential components for marketing websites",
  category: "marketing",
  version: "1.0.0",
  components: {
    /**
     * Site navigation components
     */
    NavBar: {
      description: "Site navigation component",
      category: "Navigation",
      presets: [
        "primary", // Main site navigation
        "simple", // Simplified navigation
        "transparent", // Background-transparent navigation
      ],
    },

    Footer: {
      description: "Site footer with links and information",
      category: "Navigation",
      presets: [
        "standard", // Standard footer with columns of links
        "simple", // Minimalist footer
        "detailed", // Comprehensive footer with multiple sections
      ],
    },

    /**
     * Core marketing components
     */
    Features: {
      description: "Highlights product or service features and capabilities",
      category: "Value Communication",
      presets: [
        "benefits", // Focusing on customer benefits
        "capabilities", // Focusing on technical capabilities
        "process", // Showing a process or how something works
      ],
    },

    CTA: {
      description: "Call-to-action to drive specific user conversions",
      category: "Value Communication",
      presets: [
        "primary", // Main conversion CTA
        "newsletter", // Email signup focused
        "demo", // Request demo or trial
        "contact", // Contact or get in touch
      ],
    },

    /**
     * Social proof components
     */
    Testimonials: {
      description: "Customer quotes and success stories",
      category: "Social Proof",
      presets: [
        "featured", // Single highlighted testimonial
        "collection", // Multiple testimonials
        "carousel", // Rotating testimonials
        "quotes", // Pull-quote style testimonials
      ],
    },

    Partners: {
      description: "Display of partner/customer logos and relationships",
      category: "Social Proof",
      presets: [
        "logos", // Partner/client logos
        "featured", // Specially highlighted organizations
        "industries", // Organizations grouped by industry
        "tiers", // Organizations grouped by partnership level
      ],
    },

    Stats: {
      description: "Key metrics, statistics, or numbers",
      category: "Social Proof",
      presets: [
        "achievements", // Company/product achievements
        "growth", // Growth metrics
        "impact", // Impact statistics
        "comparison", // Comparative statistics
      ],
    },

    /**
     * Company & brand components
     */
    Hero: {
      description: "Primary attention-grabbing section at the top of a page",
      category: "Brand Presentation",
      presets: [
        "brand", // Company/brand-focused hero
        "product", // Product-focused hero
        "campaign", // Special campaign or promotion hero
        "minimal", // Simplified, text-focused hero
      ],
    },

    Team: {
      description: "Team member profiles and information",
      category: "Brand Presentation",
      presets: [
        "leadership", // Leadership team
        "department", // Specific department
        "featured", // Featured team members
        "full", // Complete team presentation
      ],
    },

    Story: {
      description: "Rich narrative content that tells a compelling story",
      category: "Brand Presentation",
      presets: [
        "about", // Company or brand story
        "vision", // Vision or mission narrative
        "journey", // Evolution or journey narrative
        "impact", // Impact or results story
      ],
    },

    /**
     * Support components
     */
    Pricing: {
      description: "Product or service pricing information",
      category: "Conversion",
      presets: [
        "plans", // Service/subscription plans
        "packages", // Product packages
        "comparison", // Side-by-side comparison
        "calculator", // Interactive pricing calculator
      ],
    },

    FAQ: {
      description: "Frequently asked questions",
      category: "Conversion",
      presets: [
        "general", // General FAQs
        "product", // Product-specific FAQs
        "support", // Support-related FAQs
        "categories", // Categorized FAQs
      ],
    },

    ContactInfo: {
      description: "Company contact information and form",
      category: "Conversion",
      presets: [
        "simple", // Basic contact form/info
        "detailed", // Comprehensive contact information
        "support", // Support or help request
        "locations", // Contact with multiple location options
      ],
    },

    /**
     * Content organization components
     */
    Categories: {
      description: "Content organized into selectable categories",
      category: "Content Presentation",
      presets: [
        "products", // Product categories
        "services", // Service categories
        "industries", // Industry segments
        "solutions", // Solution categories
      ],
    },

    ContentFilter: {
      description: "Filterable content for different audiences",
      category: "Content Presentation",
      presets: [
        "industries", // Industry-specific content
        "roles", // Role or job-specific content
        "solutions", // Solution-specific content
        "needs", // Need or problem-specific content
      ],
    },
  },
};
