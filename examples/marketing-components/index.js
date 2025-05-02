// examples/marketing-components/index.js

/**
 * Example implementation of the marketing/1.0.0/core interface
 */

import Hero from "./components/Hero";
import Features from "./components/Features";

// Export the components that implement the interface
export { Hero, Features };

// Library metadata
export const metadata = {
  name: "Marketing Components",
  version: "1.0.0",
  implements: ["marketing/1.0.0/core"],
};
