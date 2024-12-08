import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import axios from 'axios';
import { UserState } from './Types';
import {mainColor} from './Style';

const API_URL = process.env.REACT_APP_API_URL!;



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
  },
  "& .MuiInputBase-input": {
    color: "white", // White input text color
  },
  "& .MuiOutlinedInput-input": {
    color: "white", // White input text color for outlined inputs
  },
  "& .MuiInputLabel-root": {
    color: "white", // White label color
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // White label color when focused
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px black inset", // Black background for autofill
    WebkitTextFillColor: "white", // White text color for autofill
  },
};


interface LoginProps {
  onLoginSuccess: (userState : UserState) => void;
}


const randomNum = (max : number, min : number) : number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/users/token`,
        new URLSearchParams({
          username,
          password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
  
      localStorage.setItem('token', response.data.access_token); // Store the access token
      onLoginSuccess(
          { 
            name : username,
            credit : randomNum(100000, 2000) ,
            ongoing_walks_as_owner: [],
            ongoing_walks_as_buyer: []
          }); // Navigate to the home page or other secure pages
          
    } catch (error) {
      setError('Invalid username or password');
    }
  };
  

  return (
    <Container>
      <Typography style={{color:"white"}}variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        sx={textFieldStyle}

      />
      <TextField 
        style={{borderColor:"white",color : 'white' }} 
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        sx={textFieldStyle}
      />
      <Button variant="contained" style={{backgroundColor:mainColor, borderColor:"white",color : 'white' }} 
        color="primary" onClick={handleLogin} fullWidth>
        Ingresar
      </Button>
    </Container>
  );
};

export default Login;
