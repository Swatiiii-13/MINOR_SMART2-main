import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnsplashImage from './UnsplashImage';
import MapModal from './MapModal';

const HotelCard = ({ hotel, destination }) => {
  const navigate = useNavigate();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchHotelImage = async () => {
      try {
        const query = encodeURIComponent(`${hotel.location} ${destination} hotel room`);
        const key = import.meta.env.VITE_PIXABAY_KEY;
        if (!key || key === 'undefined' || key.includes('placeholder')) {
          if (isMounted) setImgUrl(`https://picsum.photos/seed/${encodeURIComponent(hotel.name)}/800/600`);
          return;
        }
        const res = await fetch(`https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&per_page=3&safesearch=true&category=travel`);
        const data = await res.json();
        if (data.hits && data.hits.length > 0) {
          if (isMounted) setImgUrl(data.hits[0].webformatURL);
        } else {
          if (isMounted) setImgUrl(`https://picsum.photos/seed/${encodeURIComponent(hotel.name)}/800/600`);
        }
      } catch (e) {
        if (isMounted) setImgUrl(`https://picsum.photos/seed/${encodeURIComponent(hotel.name)}/800/600`);
      }
    };
    fetchHotelImage();
    return () => { isMounted = false; };
  }, [hotel.name, hotel.location, destination]);

  const price = hotel.pricePerNight || hotel.price || hotel.rate || hotel.costPerNight || hotel.pricePerRoom || 0;

  return (
    <>
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      color: '#1f2937',
      fontFamily: 'sans-serif'
    }}>
      {imgUrl ? (
        <img 
          src={imgUrl} 
          alt={hotel.name} 
          style={{ width: '100%', height: '14rem', objectFit: 'cover' }} 
        />
      ) : (
        <div style={{ width: '100%', height: '14rem', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      )}
      <div style={{ backgroundColor: '#f9fafb', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', flex: 1 }}>
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{hotel.name}</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>{hotel.location}</p>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {hotel.features.map((feature, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.35rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span> {feature}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Starting from</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0' }}>{price > 0 ? `₹${price.toLocaleString('en-IN')}` : "Contact for price"}</div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>Per night</span>
          <button 
            onClick={() => navigate('/checkout', { 
              state: { hotelId: hotel._id, title: `1 Night Stay at ${hotel.name}`, provider: hotel.name, price: price > 0 ? `₹${price.toLocaleString('en-IN')}` : "Contact for price" } 
            })}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.6rem 1rem', 
              borderRadius: '0.25rem', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Select Room
          </button>
          <button 
            onClick={() => setIsMapOpen(true)}
            style={{ 
              backgroundColor: '#f3f4f6', 
              color: '#374151', 
              padding: '0.6rem 1rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #d1d5db', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            📍 View on Map
          </button>
        </div>
      </div>
    </div>
    <MapModal 
      isOpen={isMapOpen} 
      onClose={() => setIsMapOpen(false)} 
      placeName={hotel.name} 
      destination={destination || hotel.location} 
      popupContent={
        <div>
          <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '2px' }}>{hotel.location}</div>
          <div style={{ fontWeight: 'bold', color: '#10b981' }}>{price > 0 ? `₹${price.toLocaleString('en-IN')}` : "Contact for price"} / night</div>
        </div>
      }
    />
    </>
  );
};

export default HotelCard;
