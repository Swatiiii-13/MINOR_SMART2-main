import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapModal = ({ isOpen, onClose, placeName, destination, popupContent }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && placeName) {
      const fetchCoordinates = async () => {
        setLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName + ' ' + destination)}&format=json`);
          const data = await res.json();
          if (data && data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else {
            setCoordinates(null);
          }
        } catch (error) {
          console.error('Error fetching location', error);
          setCoordinates(null);
        } finally {
          setLoading(false);
        }
      };
      fetchCoordinates();
    }
  }, [isOpen, placeName, destination]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        color: '#1f2937'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{placeName}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>
        
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading map...</div>
        ) : coordinates ? (
          <div style={{ height: '300px', width: '100%', marginBottom: '15px', borderRadius: '4px', overflow: 'hidden' }}>
            <MapContainer center={coordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordinates}>
                <Popup>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{placeName}</div>
                  {popupContent && <div>{popupContent}</div>}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            Location not found on map.
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: '10px' }}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ' ' + destination)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '10px 15px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              border: '1px solid #d1d5db'
            }}
          >
            View on Google Maps
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeName + ' ' + destination)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
