// examples/marketing-components/components/Features/FeatureItem.js

import React from "react";

function FeatureItem({ title, description, image, preset }) {
  return (
    <div className={`feature-item feature-item--${preset}`}>
      {image && (
        <img src={image.src} alt={image.alt} className="feature-icon" />
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default FeatureItem;
