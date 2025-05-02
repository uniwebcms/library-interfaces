// examples/marketing-components/components/Hero/index.js

/**
 * Example implementation of the Hero component from marketing/1.0.0/core
 */

import React from "react";
import BrandHero from "./variants/BrandHero";
import ProductHero from "./variants/ProductHero";
import CampaignHero from "./variants/CampaignHero";
import MinimalHero from "./variants/MinimalHero";

// User-facing component implementing the Hero interface
function Hero({ content, params = {} }) {
  // Extract the preset or default to "brand"
  const preset = params.preset || "brand";

  // Choose the appropriate implementation based on preset
  switch (preset) {
    case "brand":
      return <BrandHero content={content} params={params} />;
    case "product":
      return <ProductHero content={content} params={params} />;
    case "campaign":
      return <CampaignHero content={content} params={params} />;
    case "minimal":
      return <MinimalHero content={content} params={params} />;
    default:
      return <BrandHero content={content} params={params} />;
  }
}

export default Hero;
