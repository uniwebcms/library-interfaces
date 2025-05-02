/**
 * Marketing Interface v1.1
 *
 * A semantic component interface for marketing websites that provides
 * components focused on specific marketing communication purposes.
 *
 * It extends v1.0 "Essential components for marketing websites" with advanced
 * components for blogs, media galleries, timelines, and more.
 */

export default {
  description: "Advanced components for marketing websites",
  category: "marketing",
  version: "1.1.0",
  components: {
    /**
     * Blogging and information articles
     */
    Article: {
      description: "Full blog article or content piece display",
      category: "Content Presentation",
      presets: [
        "standard", // Standard article layout
        "featured", // Featured or spotlight article
        "longform", // Long-form content with enhanced readability
        "media-rich", // Article with prominent media elements
      ],
    },

    BlogPreview: {
      description: "Preview of blog posts or articles",
      category: "Content Presentation",
      presets: [
        "latest", // Latest posts
        "featured", // Highlighted posts
        "related", // Related content
        "categorized", // Posts by category
      ],
    },

    /**
     * Media players
     */
    MediaGallery: {
      description: "Collection of images or videos",
      category: "Playable Media",
      presets: [
        "products", // Product gallery
        "portfolio", // Work examples
        "cases", // Case studies
        "interactive", // Interactive media gallery
      ],
    },

    /**
     * Interactive & multimedia components
     */
    VideoFeature: {
      description: "Featured video content with supporting information",
      category: "Playable Media",
      presets: [
        "demo", // Product demonstration
        "testimonial", // Video testimonial
        "explainer", // Explainer or how-to video
        "brand", // Brand or company video
      ],
    },

    /**
     * Chronology and data visualization
     */
    DataVisualization: {
      description: "Graphical representation of data or metrics",
      category: "Rich Data",
      presets: [
        "performance", // Performance metrics
        "comparison", // Comparative data
        "growth", // Growth or trends
        "survey", // Survey or research results
      ],
    },

    Timeline: {
      description: "Chronological progression of events",
      category: "Rich Data",
      presets: [
        "history", // Company history
        "roadmap", // Product roadmap
        "process", // Step-by-step process
        "milestones", // Key achievement milestones
      ],
    },
  },
};
