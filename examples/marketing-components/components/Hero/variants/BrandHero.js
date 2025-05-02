// examples/marketing-components/components/Hero/variants/BrandHero.js

import React from "react";

function BrandHero({ content, params }) {
  const { title, paragraphs, images, links } = content.main;

  return (
    <div className="hero hero--brand">
      <div className="container">
        <h1 className="brand-title">{title}</h1>
        <div className="content">
          {paragraphs.map((text, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: text }} />
          ))}
        </div>
        {images && images.length > 0 && (
          <div className="brand-image">
            <img src={images[0].src} alt={images[0].alt || ""} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandHero;
