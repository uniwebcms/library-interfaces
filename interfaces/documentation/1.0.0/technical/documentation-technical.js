/**
 * Documentation Technical Interface v1.0.0
 *
 * A specialized extension to the documentation core interface focused on
 * technical documentation needs such as API references, code examples,
 * and technical specifications.
 *
 * This interface provides components specifically designed for technical
 * content while maintaining clear boundaries with the core documentation
 * components.
 */

export default {
  description: "Specialized components for technical documentation and developer resources",
  category: "documentation",
  version: "1.0.0",
  components: {
    /**
     * Technical documentation components
     */
    APIReference: {
      description: "Structured API documentation presenting endpoints, methods, parameters, and responses in a developer-friendly format",
      category: "Technical Content",
      presets: {
        "standard": "Complete API documentation with all reference elements",
        "endpoints": "REST API endpoint-focused documentation",
        "functions": "Programming function or method documentation",
      },
    },

    CodeExample: {
      description: "Executable code examples with explanations demonstrating implementation techniques or usage patterns",
      category: "Technical Content",
      presets: {
        "standard": "Code example with explanation and context",
        "interactive": "Runnable code example with user modification capabilities",
        "tutorial": "Step-by-step code walkthrough with explanations",
      },
    },

    SpecTable: {
      description: "Technical specification table presenting structured data about properties, options, or configurations",
      category: "Technical Content",
      presets: {
        "standard": "Complete specification table with all details",
        "parameters": "Parameter-focused specification for function inputs",
        "properties": "Property listing for object or component documentation",
      },
    },

    /**
     * Integration components
     */
    SDKSetup: {
      description: "Software development kit installation and configuration instructions",
      category: "Implementation",
      presets: {
        "standard": "Complete SDK setup instructions with prerequisites",
        "quickstart": "Minimal setup for rapid implementation",
        "environments": "Environment-specific setup instructions",
      },
    },

    Playground: {
      description: "Interactive development environment for experimenting with code or APIs directly in documentation",
      category: "Implementation",
      presets: {
        "standard": "General purpose code playground with execution",
        "api-console": "API testing console for endpoint exploration",
        "sandbox": "Isolated testing environment with safety constraints",
      },
    },
  },
};
