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
      description:
        "Site navigation component that provides access to key site areas and functions",
      category: "Navigation",
      presets: {
        primary:
          "Main site navigation with complete navigation structure and functionality",
        simple:
          "Streamlined navigation focused on essential links and minimal design",
        transparent:
          "Navigation designed to overlay content with background transparency",
      },
    },

    Footer: {
      description:
        "Site footer with links, company information, and supplementary content",
      category: "Navigation",
      presets: {
        standard:
          "Balanced footer with organized columns of links and company information",
        simple:
          "Minimalist footer with essential legal links and contact information",
        detailed:
          "Comprehensive footer with multiple sections covering products, resources, legal, and contact",
      },
    },

    /**
     * Core marketing components
     */
    Features: {
      description:
        "Highlights product or service features and capabilities to communicate value",
      category: "Value Communication",
      presets: {
        benefits:
          "Communicates value-focused outcomes that customers gain, emphasizing 'what's in it for them'",
        capabilities:
          "Showcases technical abilities and functional aspects of the product or service",
        process:
          "Illustrates sequential steps or workflow showing how something operates or is used",
      },
    },

    CTA: {
      description:
        "Call-to-action element that drives specific user conversions and key actions",
      category: "Value Communication",
      presets: {
        primary:
          "Main conversion call-to-action designed to drive the primary desired action",
        newsletter:
          "Email signup focused on building subscriber relationships and lead generation",
        demo: "Request demo or trial with emphasis on product exploration and evaluation",
        contact:
          "Contact initiation designed to start conversations and build relationships",
      },
    },

    /**
     * Social proof components
     */
    Testimonials: {
      description:
        "Customer quotes and success stories that build credibility through social proof",
      category: "Social Proof",
      presets: {
        featured:
          "Highlights a single, prominent testimonial with detailed context and emphasis",
        collection:
          "Presents multiple testimonials in a structured layout for comprehensive social proof",
        carousel:
          "Showcases multiple testimonials in a rotating format to maximize content density",
        quotes:
          "Emphasizes compelling quote snippets in a pull-quote style for high impact",
      },
    },

    Partners: {
      description:
        "Display of partner/customer logos and relationship information to build credibility",
      category: "Social Proof",
      presets: {
        logos:
          "Simple presentation of partner or client logos to establish credibility through association",
        featured:
          "Highlights select partners with additional context about the relationship",
        industries:
          "Organizes partners by industry vertical to demonstrate sector-specific expertise",
        tiers:
          "Groups organizations by partnership level to showcase relationship depth and structure",
      },
    },

    Stats: {
      description:
        "Key metrics, statistics, or numbers that provide evidence of value and success",
      category: "Social Proof",
      presets: {
        achievements:
          "Highlights company or product achievements using meaningful data points",
        growth:
          "Presents growth-focused metrics showing positive trajectory and momentum",
        impact:
          "Emphasizes the tangible impact on customers, communities, or industries",
        comparison:
          "Presents comparative statistics to demonstrate competitive advantage",
      },
    },

    /**
     * Company & brand components
     */
    Hero: {
      description:
        "Primary attention-grabbing section at the top of a page that sets the tone and focus",
      category: "Brand Presentation",
      presets: {
        brand:
          "Emphasizes company identity, values, and overall brand positioning",
        product: "Focuses on product value proposition, features, and benefits",
        campaign:
          "Highlights special campaign, promotion, or time-sensitive offering",
        minimal:
          "Presents streamlined, text-focused messaging without complex visual elements",
      },
    },

    Team: {
      description:
        "Team member profiles and information that humanize the organization",
      category: "Brand Presentation",
      presets: {
        leadership:
          "Focuses on executive or leadership team with appropriate emphasis on authority",
        department:
          "Presents members of a specific functional department or team",
        featured:
          "Highlights select team members based on relevance to specific content",
        full: "Comprehensive presentation of the entire organization's team structure",
      },
    },

    Story: {
      description:
        "Rich narrative content that tells a compelling story about the organization or offering",
      category: "Brand Presentation",
      presets: {
        about:
          "Company or brand story focusing on history, purpose, and identity",
        vision:
          "Forward-looking narrative about mission, vision, and organizational values",
        journey:
          "Progressive story showing evolution, milestones, and growth over time",
        impact:
          "Narrative focused on outcomes, results, and tangible differences made",
      },
    },

    /**
     * Support components
     */
    Pricing: {
      description:
        "Product or service pricing information presented to facilitate purchase decisions",
      category: "Conversion",
      presets: {
        plans:
          "Service or subscription plans with recurring pricing structures",
        packages: "Product packages or bundles with one-time purchase pricing",
        comparison:
          "Side-by-side comparison of different pricing tiers or options",
        calculator:
          "Interactive tool for customized pricing based on configuration options",
      },
    },

    FAQ: {
      description:
        "Frequently asked questions that address common customer concerns and objections",
      category: "Conversion",
      presets: {
        general:
          "Broad questions covering common topics about the company or offerings",
        product:
          "Specific questions focused on product features, capabilities, and usage",
        support:
          "Questions related to customer service, help resources, and issue resolution",
        categories:
          "Questions organized into logical categories for improved navigation",
      },
    },

    ContactInfo: {
      description:
        "Company contact information and communication options for customer inquiries",
      category: "Conversion",
      presets: {
        simple:
          "Basic contact form and information designed for general inquiries",
        detailed:
          "Comprehensive contact information with multiple departments and channels",
        support:
          "Support-specific contact options focused on customer assistance",
        locations:
          "Contact information organized by geographic locations or offices",
      },
    },

    /**
     * Content organization components
     */
    Categories: {
      description:
        "Content organized into selectable categories for improved navigation",
      category: "Content Presentation",
      presets: {
        products: "Product categories organized by type, function, or use case",
        services:
          "Service categories organized by offering type or customer need",
        industries:
          "Content categorized by industry vertical or market segment",
        solutions:
          "Solutions categorized by problem type or business challenge",
      },
    },

    ContentFilter: {
      description:
        "Filterable content organized for different audience segments and needs",
      category: "Content Presentation",
      presets: {
        industries:
          "Content filtered by industry-specific relevance and context",
        roles: "Content filtered by job role, function, or professional focus",
        solutions:
          "Content filtered by solution category or problem being solved",
        needs:
          "Content filtered by specific need, challenge, or desired outcome",
      },
    },
  },
};
