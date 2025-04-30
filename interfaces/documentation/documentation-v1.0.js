/**
 * Documentation Interface v1.0
 *
 * A semantic component interface for documentation websites that provides
 * components focused on specific documentation communication purposes.
 *
 * This interface focuses on semantic meaning rather than visual implementation,
 * allowing different libraries to implement these components in unique ways
 * while maintaining content compatibility.
 */

export default {
  description: "Essential components for documentation websites",
  category: "documentation",
  version: "1.0.0",
  components: {
    /**
     * Core documentation components
     */
    Document: {
      description: "Main documentation content rendered from markdown",
      category: "Content Presentation",
      presets: [
        "standard", // Standard documentation page
        "api", // API documentation-optimized page
        "guide", // Tutorial or guide-optimized page
        "reference", // Reference documentation-optimized page
        "plain", // Minimal page without standard navigation elements
      ],
    },

    /**
     * Navigation components
     */
    NavBar: {
      description: "Site navigation and search component",
      category: "Navigation",
      presets: [
        "primary", // Main site navigation with search
        "simple", // Simplified navigation
        "versioned", // Navigation with version selection
      ],
    },

    Sidebar: {
      description: "Documentation navigation sidebar",
      category: "Navigation",
      presets: [
        "categories", // Category-based navigation
        "tree", // Hierarchical tree navigation
        "expandable", // Expandable/collapsible navigation
      ],
    },

    TableOfContents: {
      description: "Page-level table of contents",
      category: "Navigation",
      presets: [
        "floating", // Floating/sticky table of contents
        "inline", // Inline table of contents
        "expandable", // Expandable/collapsible table of contents
      ],
    },

    /**
     * Special content sections
     */
    RelatedContent: {
      description: "Related documentation links",
      category: "Navigation",
      presets: [
        "next-steps", // Next steps in a learning path
        "see-also", // Related topics
        "examples", // Example implementations
      ],
    },
  },
};
