/**
 * Documentation Learning Interface v1.0.0
 *
 * A specialized extension to the documentation core interface focused on
 * educational content, tutorials, and learning-oriented documentation.
 *
 * This interface provides components specifically designed for structuring
 * educational content while maintaining clear boundaries with other
 * documentation components.
 */

export default {
  description: "Specialized components for educational documentation and learning resources",
  category: "documentation",
  version: "1.0.0",
  components: {
    /**
     * Learning path components
     */
    Tutorial: {
      description: "Structured learning content that guides users through a complete process with defined learning objectives",
      category: "Learning",
      presets: {
        "standard": "Complete tutorial with all educational elements",
        "quickstart": "Accelerated tutorial focused on essential concepts",
        "project": "Project-based tutorial building a complete example",
      },
    },

    Concept: {
      description: "Explanatory content that presents theoretical information and foundational knowledge",
      category: "Learning",
      presets: {
        "standard": "Comprehensive concept explanation with context",
        "reference": "Concise reference-style concept definition",
        "visual": "Visually-enhanced concept explanation with diagrams",
      },
    },

    Exercise: {
      description: "Interactive practice activity that reinforces learning through application",
      category: "Learning",
      presets: {
        "standard": "Guided exercise with instructions and solution",
        "challenge": "More difficult exercise to test deeper understanding",
        "interactive": "Exercise with built-in validation and feedback",
      },
    },

    /**
     * Learning support components
     */
    Glossary: {
      description: "Definition collection explaining terminology in a structured reference format",
      category: "Reference",
      presets: {
        "standard": "Complete terminology glossary with definitions",
        "inline": "Context-sensitive glossary integrated with content",
        "categorical": "Category-organized glossary grouping related terms",
      },
    },

    Assessment: {
      description: "Knowledge verification that measures understanding of presented concepts",
      category: "Learning",
      presets: {
        "quiz": "Knowledge-testing questions with immediate feedback",
        "checklist": "Self-assessment list for reviewing comprehension",
        "practical": "Applied assessment requiring demonstration of skills",
      },
    },
  },
};
