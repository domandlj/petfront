import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Screen, WalkOffer } from './Types';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import { mainColor } from './Style';


const API_URL = process.env.REACT_APP_API_URL;
const GEOCODING_API_URL = process.env.REACT_APP_GEOCODING_API_URL!;

const dogIcon = L.divIcon({
  html: `<div style="display: flex; justify-content: center; align-items: center; 
                    width: 40px; height: 40px; background-color: white; 
                    border-radius: 50%; border: 2px solid green; font-size: 24px; 
                    color: #ff5722)">
           🦮
         </div>`,
  className: 'custom-dog-icon',
  iconSize: [40, 40],  // Adjust icon size as needed
  iconAnchor: [20, 40], // Anchor point of the icon
  popupAnchor: [0, -40], // Position for the popup relative to the icon
});

interface WalksProps {
  setScreen: (screen: Screen) => void;
}

export const WalksList: React.FC = () => {
  const [walkOffers, setWalkOffers] = useState<WalkOffer[]>([]);
  const [locations, setLocations] = useState<{ [key: number]: string }>({});
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); // Track the view mode

  // Fetch walk offers
  useEffect(() => {
    const fetchWalkOffers = () => {
      axios
        .get(`${API_URL}/walks/walk_offers`)
        .then((response) => {
          setWalkOffers(response.data);
          fetchLocations(response.data);
        })
        .catch((error) => {
          console.error('Error fetching walk offers:', error);
        });
    };

    fetchWalkOffers();
  }, []);



  // Fetch readable location for each walk offer
  const fetchLocations = async (walkOffers: WalkOffer[]) => {
    try {
      const locationPromises = walkOffers.map(async (walk, index) => {
        try {
          const response = await axios.get(GEOCODING_API_URL, {
            params: {
              lat: walk.location_latitude,
              lon: walk.location_longitude,
              format: 'json',
            },
          });
          return { index, location: response.data.display_name };
        } catch (error) {
          console.error('Error fetching location:', error);
          return { index, location: 'Location unavailable' };
        }
      });

      const locationResults = await Promise.all(locationPromises);
      const newLocations = locationResults.reduce((acc, { index, location }) => {
        acc[index] = location;
        return acc;
      }, {} as { [key: number]: string });

      setLocations(newLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Function to handle buying a walk
  const handleBuyWalk = (offerId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing. Please log in.');
      return;
    }  
    axios
      .post(
        `${API_URL}/walks/walk_offers/${offerId}/buy`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log('Walk purchased successfully!');
        setWalkOffers(walkOffers.filter((offer) => offer.id !== offerId));
      })
      .catch((error) => {
        console.error('Error buying walk offer:', error);
      });
  };

  return (
    <>
      <Grid container direction="column" alignItems="center">
      <IconButton  style={{ marginBottom: '15px' }} onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} color="primary">
          {viewMode === 'list' ? <MapIcon style={{color:'white'}} /> : <ListIcon style={{color:'white'}}  />}
        </IconButton>
        
        

        {viewMode === 'list' ? (
          <Grid container direction="column" spacing={2} style={{ width: '100%' }}>
            {walkOffers.length === 0 ? (
              <Typography style={{color:'white'}}>No hay ningún paseo disponible :( </Typography>
            ) : (
              walkOffers.map((walk, index) => (
                <Paper key={index} elevation={2} variant='outlined' style={{ borderColor:'white',color:'white',backgroundColor:'black',padding: '10px', marginBottom: '10px' }}>
                  <Typography variant="body1"><strong>Ofrece:</strong> {walk.owner_name}</Typography>
                  <Typography variant="body1"><strong>Precio:</strong> ${walk.price}</Typography>
                  <Typography variant="body1"><strong>Ubicación:</strong> {locations[index] || 'Loading...'}</Typography>
                  <Typography variant="body1"><strong>Horario:</strong> {walk.schedule}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyWalk(walk.id)}
                    style={{ backgroundColor:mainColor, marginTop: '10px' }}
                  >
                    Comprar
                  </Button>
                </Paper>
              ))
            )}
          </Grid>
        ) : (
          <MapContainer center={[-31.4020814,-64.1833276]} zoom={20} style={{ height: '400px', width: '100%', borderRadius: '15px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {walkOffers.map((walk, index) => (
              <Marker
                icon={dogIcon}
                key={index}
                position={[walk.location_latitude, walk.location_longitude]}
              >
                <Popup>
                  <Typography variant="body1"><strong>Ofrece:</strong> {walk.owner_name}</Typography>
                  <Typography variant="body1"><strong>Precio:</strong> ${walk.price}</Typography>
                  <Typography variant="body1"><strong>Ubicación:</strong> {locations[index] || 'Loading...'}</Typography>
                  <Typography variant="body1"><strong>Horario:</strong> {walk.schedule}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyWalk(walk.id)}
                    style={{ marginTop: '10px' }}
                  >
                    Comprar
                  </Button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </Grid>
    </>
  );
};
export const Walks: React.FC<WalksProps> = ({ setScreen }) => (
  <Grid container spacing={3} justifyContent="center" style={{ backgroundColor:'black',color:'white', marginTop: '40px' }}>
    <Grid item xs={12} sm={8} md={6} lg={4}>
      <Paper
        elevation={4}
        variant='outlined'
        style={{
          backgroundColor:'black',
          color:'white',
          borderColor:'white',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '10px',
          transition: 'transform 0.2s ease',
        }}
        onClick={() => setScreen(Screen.CreateWalk)}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Typography variant="h4" style={{ fontWeight: 'bold' }}>Ofertar Paseo</Typography>
      </Paper>
    </Grid>

    <Grid item xs={12} sm={8} md={6} lg={4}>
      <Paper
        elevation={4}
        variant='outlined'
        style={{
          backgroundColor:'black',
          color:'white',
          borderColor:'white',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '10px',
          transition: 'transform 0.2s ease',
        }}
        onClick={() => setScreen(Screen.ViewWalks)}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Typography variant="h4" style={{ fontWeight: 'bold' }}>Ver Paseos</Typography>
      </Paper>
    </Grid>
  </Grid>
);