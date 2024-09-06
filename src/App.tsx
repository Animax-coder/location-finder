import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set custom marker icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 }); // Default location (London)
  const [zoom, setZoom] = useState(13);
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch(
          `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
          setZoom(13); // Zoom in to the searched location
        } else {
          alert('Location not found');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        alert('Something went wrong. Please try again.');
      }
    }
  };
  
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Location Finder</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px' }}>
          Search
        </button>
      </div>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={zoom}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            {searchQuery} is located here.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
