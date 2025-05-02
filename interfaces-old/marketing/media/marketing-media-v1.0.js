/**
 * Marketing Media Extension Interface v1.0
 *
 * Extension interface for marketing websites with rich media components.
 * This extension adds components focused on rich media presentation, including
 * video, image galleries, and interactive media elements.
 * 
 * Implements as an extension to marketing-core-v1.0.
 */

export default {
  description: "Rich media extension components for marketing websites",
  category: "marketing",
  version: "1.0.0",
  extends: ["marketing-core-v1.0"],
  components: {
    /**
     * Rich media components
     */
    MediaGallery: {
      description: "Organized collection of media assets presented in a structured format",
      category: "Media Presentation",
      presets: {
        "portfolio": "Showcase of creative work or projects with visual emphasis",
        "product": "Product imagery collection focused on features and details",
        "interactive": "Media collection with interactive elements for user engagement",
        "immersive": "Full-screen or expanded media presentation for impact",
      },
    },

    VideoFeature: {
      description: "Featured video content with appropriate context and controls",
      category: "Media Presentation",
      presets: {
        "hero": "Primary video featured prominently as a hero element",
        "testimonial": "Customer or user testimonial in video format",
        "product": "Product demonstration or feature highlight video",
        "background": "Ambient video used as a background design element",
      },
    },

    InteractiveDemo: {
      description: "Interactive product or feature demonstration with user participation",
      category: "Media Presentation",
      presets: {
        "product": "Interactive product feature demonstration",
        "configurator": "Product configuration or customization experience",
        "simulator": "Product simulation allowing virtual experience",
        "guided": "Guided walkthrough of features or capabilities",
      },
    },

    /**
     * Extended components for existing categories
     */
    DataVisualization: {
      description: "Visual representation of data, statistics, or metrics",
      category: "Value Communication",
      presets: {
        "comparison": "Comparative data visualization showing relative values",
        "trends": "Time-based visualization showing patterns or trajectories",
        "breakdown": "Component breakdown visualization of a whole into parts",
        "geographic": "Location-based data visualization with spatial context",
      },
    },

    /**
     * Enhanced presets for core components
     * Note: These would be merged with the core interface
     */
    Pricing: {
      description: "Product or service pricing information presented to facilitate purchase decisions",
      category: "Conversion",
      presets: {
        "calculator": "Interactive tool for customized pricing based on configuration options",
      },
    },

    FAQ: {
      description: "Frequently asked questions that address common customer concerns and objections",
      category: "Conversion",
      presets: {
        "categories": "Questions organized into logical categories for improved navigation",
      },
    },

    ContactInfo: {
      description: "Company contact information and communication options for customer inquiries",
      category: "Conversion",
      presets: {
        "locations": "Contact information organized by geographic locations or offices",
      },
    },
  },
};
