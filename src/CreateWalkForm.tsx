import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { mainColor } from './Style';

const API_URL = process.env.REACT_APP_API_URL;

interface WalkOfferFormProps {
  onSuccess: () => void;  // Function to call after successful creation
}


const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white", // Default white border
    },
    "&:hover fieldset": {
      borderColor: "white", // White border on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "white", // White border when focused
    },
    "& input": {
      color: "white", // White text input
    },
  },
  "& .MuiInputLabel-root": {
    color: "white", // White label color
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // White label when focused
  },
};


const CreateWalkForm: React.FC<WalkOfferFormProps> = ({ onSuccess }) => {
  const [price, setPrice] = useState('');
  const [locationLatitude, setLocationLatitude] = useState<number >(0);
  const [locationLongitude, setLocationLongitude] = useState<number>(0);
  const [schedule, setSchedule] = useState('');

  useEffect(() => {
    // Use Geolocation API to get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLatitude(position.coords.latitude);
        setLocationLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(
        `${API_URL}/walks/walk_offers`,
        { 
          id : Math.floor(Math.random()),
          owner_id: Math.floor(Math.random()), 
          price: parseFloat(price),
          location_latitude: locationLatitude,
          location_longitude: locationLongitude,
          schedule: schedule,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onSuccess();
    } catch (error) {
      console.error('Error creating walk offer:', error);
    }
  };
  
  return (
    <Paper elevation={3} style={{ backgroundColor: "black", color: "white",padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">Ofrecer un paseo</Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Precio"
              variant="outlined"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Horario"
              variant="outlined"
              fullWidth
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              required
              sx={textFieldStyle}

            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="outlined" color="primary" style={{backgroundColor:mainColor,  borderColor: "white", color: "white"}}fullWidth disabled={locationLatitude === null || locationLongitude === null}>
              Ofrecer
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateWalkForm;
