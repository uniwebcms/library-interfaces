/**
 * Marketing Media Interface v1.0.0
 *
 * Specialized interface for marketing websites with rich media components.
 * This interface provides components focused on rich media presentation,
 * including video, image galleries, and interactive media elements.
 * 
 * Complements marketing-core but can be implemented independently.
 */

export default {
  description: "Rich media components for marketing websites",
  category: "marketing",
  version: "1.0.0",
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
     * Data visualization components
     */
    DataVisualization: {
      description: "Visual representation of data, statistics, or metrics",
      category: "Data Presentation",
      presets: {
        "comparison": "Comparative data visualization showing relative values",
        "trends": "Time-based visualization showing patterns or trajectories",
        "breakdown": "Component breakdown visualization of a whole into parts",
        "geographic": "Location-based data visualization with spatial context",
      },
    },

    /**
     * Media interaction components
     */
    MediaPlayer: {
      description: "Audio or video player with controls and contextual information",
      category: "Media Interaction",
      presets: {
        "standard": "Standard media player with essential controls",
        "enhanced": "Feature-rich player with additional controls and information",
        "inline": "Compact player designed for in-content placement",
        "playlist": "Player supporting multiple media items in sequence",
      },
    },
  },
};
