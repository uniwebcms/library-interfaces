// examples/marketing-components/components/Features/index.js

import React from "react";
import FeatureItem from "./FeatureItem";

function Features({ content, params = {} }) {
  const preset = params.preset || "benefits";
  const layout = params.layout || "grid";
  const columns = params.columns || 3;

  // Extract main content and items (features)
  const { title, paragraphs } = content.main;
  const { items } = content;

  return (
    <div className={`features features--${preset} layout--${layout}`}>
      <h2>{title}</h2>
      {paragraphs.map((paragraph, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}

      <div className={`features-grid columns-${columns}`}>
        {items.map((feature, i) => (
          <FeatureItem
            key={i}
            title={feature.title}
            description={feature.paragraphs[0]}
            image={feature.images[0]}
            preset={preset}
          />
        ))}
      </div>
    </div>
  );
}

export default Features;
