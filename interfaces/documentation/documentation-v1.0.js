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
      description:
        "Main documentation content rendered from markdown with appropriate formatting and structure",
      category: "Content Presentation",
      presets: {
        standard:
          "General documentation page with balanced content formatting and navigation elements",
        api: "API documentation with optimized formatting for endpoints, parameters, and responses",
        guide:
          "Tutorial or guide with step-by-step instructions and explanatory content",
        reference:
          "Reference documentation with organized lookup information and specifications",
        plain:
          "Minimal content presentation without standard navigation or supplementary elements",
      },
    },

    /**
     * Navigation components
     */
    NavBar: {
      description:
        "Site navigation with documentation-specific controls including search and version selection",
      category: "Navigation",
      presets: {
        primary:
          "Main site navigation with comprehensive search and essential links",
        simple: "Simplified navigation focused on core documentation sections",
        versioned:
          "Navigation with version selection controls and version-specific content",
      },
    },

    Sidebar: {
      description:
        "Documentation navigation sidebar providing access to the content hierarchy",
      category: "Navigation",
      presets: {
        categories: "Navigation organized by logical categories and sections",
        tree: "Hierarchical tree navigation showing full content structure",
        expandable:
          "Collapsible navigation sections that can be expanded for deeper browsing",
      },
    },

    TableOfContents: {
      description:
        "Page-level table of contents providing navigation within the current document",
      category: "Navigation",
      presets: {
        floating:
          "Persistently visible table of contents that remains accessible while scrolling",
        inline:
          "Document-integrated table of contents positioned within the content flow",
        expandable:
          "Collapsible table of contents that can be toggled for visibility",
      },
    },

    /**
     * Special content sections
     */
    RelatedContent: {
      description:
        "Supplementary links and resources related to the current documentation topic",
      category: "Navigation",
      presets: {
        "next-steps":
          "Suggested continuation resources in a logical learning progression",
        "see-also":
          "Topic-related content that provides additional context or information",
        examples:
          "Practical implementation examples and sample code for reference",
      },
    },

    /**
     * Interactive components
     */
    CodeBlock: {
      description:
        "Code examples and snippets with appropriate formatting and interaction options",
      category: "Technical Content",
      presets: {
        standard:
          "Basic code presentation with syntax highlighting and formatting",
        interactive: "Editable code with options to modify and experiment",
        copyable:
          "Code optimized for easy copying with copy-to-clipboard functionality",
        annotated: "Code with integrated explanations and annotations",
      },
    },

    APIReference: {
      description:
        "Technical API documentation with structured parameter and response information",
      category: "Technical Content",
      presets: {
        endpoints:
          "REST API endpoint documentation with request/response details",
        methods:
          "Function or method documentation with parameters and return values",
        schemas: "Data structure and schema definitions with field information",
        examples:
          "Example-focused API usage with sample requests and responses",
      },
    },

    Feedback: {
      description: "User feedback collection specific to documentation content",
      category: "Engagement",
      presets: {
        helpfulness: "Simple feedback on content usefulness or relevance",
        detailed:
          "Comprehensive feedback with comments and improvement suggestions",
        issue: "Problem reporting for documentation errors or clarity issues",
        suggestion:
          "Feature or content suggestions for documentation improvement",
      },
    },

    /**
     * Learning components
     */
    Tutorial: {
      description:
        "Step-by-step instructional content for learning and implementation",
      category: "Learning",
      presets: {
        beginner: "Introductory tutorial with detailed steps for newcomers",
        advanced: "Complex tutorial assuming prior knowledge and expertise",
        quickstart: "Rapid implementation guide for essential functionality",
        project: "Complete project-based tutorial with comprehensive steps",
      },
    },

    Concept: {
      description:
        "Explanatory content that clarifies abstract or complex concepts",
      category: "Learning",
      presets: {
        overview: "High-level explanation of a concept or system",
        "deep-dive":
          "Detailed exploration of a concept with thorough explanation",
        comparison:
          "Concept explanation through comparison with familiar concepts",
        visual: "Concept explanation with emphasis on visual representation",
      },
    },
  },
};
