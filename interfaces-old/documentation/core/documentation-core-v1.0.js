/**
 * Documentation Core Interface v1.0
 *
 * A semantic component interface for documentation websites that provides
 * components focused on specific documentation communication purposes.
 *
 * This interface defines the essential components needed for documentation sites,
 * focusing on semantic meaning rather than visual implementation details.
 */

export default {
  description:
    "Essential components for documentation websites and knowledge bases",
  category: "documentation",
  version: "1.0.0",
  components: {
    /**
     * Primary documentation component
     */
    Document: {
      description:
        "Primary content component for documentation pages with rich content rendering support for text, headings, lists, tables, code blocks, media, and interactive elements",
      category: "Content",
      presets: {
        standard:
          "Complete documentation page with full content rendering capabilities",
        plain:
          "Simplified presentation focused on content without supplementary elements",
      },
    },

    /**
     * Navigation components
     */
    NavBar: {
      description:
        "Primary navigation for documentation sites providing access to major sections and global controls",
      category: "Navigation",
      presets: {
        standard: "Main site navigation with essential structure and controls",
        minimal: "Streamlined navigation with reduced visual emphasis",
        versioned:
          "Navigation with version selection for multi-version documentation",
      },
    },

    Sidebar: {
      description:
        "Section navigation showing the documentation structure and enabling hierarchical browsing",
      category: "Navigation",
      presets: {
        standard: "Full documentation hierarchy with expandable sections",
        categories: "Category-based navigation for grouped content",
        compact: "Space-efficient navigation optimized for content focus",
      },
    },

    TableOfContents: {
      description:
        "In-page navigation showing the structure of the current document and enabling quick jumps to sections",
      category: "Navigation",
      presets: {
        floating:
          "Persistently accessible navigation that remains visible while scrolling",
        inline:
          "Document-integrated navigation positioned within the content flow",
        expandable: "Collapsible navigation that can be toggled for visibility",
      },
    },

    /**
     * Supplementary content
     */
    RelatedContent: {
      description:
        "Suggestions for related documentation connecting the current content to other relevant resources",
      category: "Navigation",
      presets: {
        "next-steps":
          "Sequential navigation showing logical progression in learning path",
        "related-topics": "Topically related content for deeper exploration",
        essentials: "Fundamental resources related to the current content",
      },
    },
  },
};
