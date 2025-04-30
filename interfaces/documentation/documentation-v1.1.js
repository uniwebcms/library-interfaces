/**
 * Uniweb Documentation Interface v1.0
 *
 * A lean, focused component interface for documentation websites.
 *
 * This interface recognizes that most documentation content is effectively handled
 * through standard markdown, which already supports headings, paragraphs, lists,
 * code blocks, tables, images, callouts, and more. The components defined here
 * focus on elements that require specialized functionality beyond markdown.
 */

export default {
  description: "Advanced components for documentation websites",
  category: "documentation",
  version: "1.1.0",
  components: {
    /**
     * Footer elements
     */
    Footer: {
      description: "Documentation site footer",
      category: "Navigation",
      presets: [
        "standard", // Standard documentation footer
        "minimal", // Minimalist footer
        "community", // Community and contribution-focused footer
      ],
    },
  },
};
