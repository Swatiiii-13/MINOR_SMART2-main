import React from 'react';

const UnsplashImage = ({ query, fallbackSrc, alt, style, className }) => {
  // Use Picsum with the query as the seed to generate a consistent, random image
  // This bypasses the need for API keys and won't fail with rate limits
  const seed = encodeURIComponent(query || 'travel');
  const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      style={style} 
      className={className}
      onError={(e) => { e.target.onerror = null; e.target.src = fallbackSrc || 'https://picsum.photos/800/600'; }}
    />
  );
};

export default UnsplashImage;
