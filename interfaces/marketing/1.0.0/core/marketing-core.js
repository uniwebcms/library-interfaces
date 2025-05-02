/**
 * Marketing Core Interface v1.0.0
 *
 * Core semantic components for marketing websites covering essential
 * marketing communication needs. This interface provides the fundamental
 * components that most marketing sites require.
 *
 * This interface focuses on semantic meaning rather than visual implementation,
 * allowing different libraries to implement these components in unique ways
 * while maintaining content compatibility.
 */

export default {
  description: "Core components for marketing websites",
  category: "marketing",
  version: "1.0.0",
  components: {
    /**
     * Site navigation components
     */
    NavBar: {
      description: "Site navigation component that provides access to key site areas and functions",
      category: "Navigation",
      presets: {
        "primary": "Main site navigation with complete navigation structure and functionality",
        "simple": "Streamlined navigation focused on essential links and minimal design",
        "transparent": "Navigation designed to overlay content with background transparency",
      },
    },

    Footer: {
      description: "Site footer with links, company information, and supplementary content",
      category: "Navigation",
      presets: {
        "standard": "Balanced footer with organized columns of links and company information",
        "simple": "Minimalist footer with essential legal links and contact information",
        "detailed": "Comprehensive footer with multiple sections covering products, resources, legal, and contact",
      },
    },

    /**
     * Core marketing components
     */
    Features: {
      description: "Highlights product or service features and capabilities to communicate value",
      category: "Value Communication",
      presets: {
        "benefits": "Communicates value-focused outcomes that customers gain, emphasizing 'what's in it for them'",
        "capabilities": "Showcases technical abilities and functional aspects of the product or service",
        "process": "Illustrates sequential steps or workflow showing how something operates or is used",
      },
    },

    CTA: {
      description: "Call-to-action element that drives specific user conversions and key actions",
      category: "Value Communication",
      presets: {
        "primary": "Main conversion call-to-action designed to drive the primary desired action",
        "newsletter": "Email signup focused on building subscriber relationships and lead generation",
        "demo": "Request demo or trial with emphasis on product exploration and evaluation",
        "contact": "Contact initiation designed to start conversations and build relationships",
      },
    },

    /**
     * Company & brand components
     */
    Hero: {
      description: "Primary attention-grabbing section at the top of a page that sets the tone and focus",
      category: "Brand Presentation",
      presets: {
        "brand": "Emphasizes company identity, values, and overall brand positioning",
        "product": "Focuses on product value proposition, features, and benefits",
        "campaign": "Highlights special campaign, promotion, or time-sensitive offering",
        "minimal": "Presents streamlined, text-focused messaging without complex visual elements",
      },
    },

    Team: {
      description: "Team member profiles and information that humanize the organization",
      category: "Brand Presentation",
      presets: {
        "leadership": "Focuses on executive or leadership team with appropriate emphasis on authority",
        "department": "Presents members of a specific functional department or team",
        "featured": "Highlights select team members based on relevance to specific content",
        "full": "Comprehensive presentation of the entire organization's team structure",
      },
    },

    /**
     * Support components
     */
    Pricing: {
      description: "Product or service pricing information presented to facilitate purchase decisions",
      category: "Conversion",
      presets: {
        "plans": "Service or subscription plans with recurring pricing structures",
        "packages": "Product packages or bundles with one-time purchase pricing",
        "comparison": "Side-by-side comparison of different pricing tiers or options",
      },
    },

    FAQ: {
      description: "Frequently asked questions that address common customer concerns and objections",
      category: "Conversion",
      presets: {
        "general": "Broad questions covering common topics about the company or offerings",
        "product": "Specific questions focused on product features, capabilities, and usage",
        "support": "Questions related to customer service, help resources, and issue resolution",
      },
    },

    ContactInfo: {
      description: "Company contact information and communication options for customer inquiries",
      category: "Conversion",
      presets: {
        "simple": "Basic contact form and information designed for general inquiries",
        "detailed": "Comprehensive contact information with multiple departments and channels",
        "support": "Support-specific contact options focused on customer assistance",
      },
    },
  },
};
