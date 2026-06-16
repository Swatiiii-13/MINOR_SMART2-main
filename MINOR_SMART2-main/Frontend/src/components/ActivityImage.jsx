import { useState, useEffect } from 'react';

const imageCache = {};

const ActivityImage = ({ activityName, imageKeyword, destination, alt, className, fallbackSrc }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchActivityImage = async () => {
      if (!activityName) {
        if (isMounted) setSrc(fallbackSrc || 'https://picsum.photos/320/240');
        return;
      }

      // Extract key words from activity description or use imageKeyword
      const keywords = imageKeyword || activityName
        .split(' ')
        .slice(0, 4)
        .join(' ');
      
      const cacheKey = keywords;
      if (imageCache[cacheKey]) {
        if (isMounted) setSrc(imageCache[cacheKey]);
        return;
      }

      try {
        const query = encodeURIComponent(`${keywords} ${destination} India`);
        const key = import.meta.env.VITE_PIXABAY_KEY;
        if (!key || key === 'undefined' || key.includes('placeholder')) {
          const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(keywords)}/600/400`;
          imageCache[cacheKey] = fallbackUrl;
          if (isMounted) setSrc(fallbackUrl);
          return;
        }
        const res = await fetch(
          `https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&per_page=3&safesearch=true&category=travel`
        );
        const data = await res.json();
        const imageUrl = data.hits && data.hits.length > 0
          ? data.hits[0].webformatURL
          : `https://picsum.photos/seed/${encodeURIComponent(keywords)}/600/400`;
        
        imageCache[cacheKey] = imageUrl;
        if (isMounted) setSrc(imageUrl);
      } catch {
        const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(keywords)}/600/400`;
        imageCache[cacheKey] = fallbackUrl;
        if (isMounted) setSrc(fallbackUrl);
      }
    };

    fetchActivityImage();

    return () => {
      isMounted = false;
    };
  }, [activityName, imageKeyword, destination, fallbackSrc]);

  if (!src) {
    return <div className={className} style={{ backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={(e) => { 
        e.target.onerror = null; 
        e.target.src = fallbackSrc || `https://picsum.photos/seed/${activityName ? activityName.length : 5}/320/240`; 
      }}
    />
  );
};

export default ActivityImage;
