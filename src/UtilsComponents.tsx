import React, {useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@mui/material';


interface OnePressButtonProps {
  text : string;
  onClick: () => void;
}

export const OnePressButton: React.FC<OnePressButtonProps> = ({ text, onClick }) => {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true); // Disable the button after it's clicked
    onClick(); // Call the custom onClick function
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={disabled}
      sx={{
        backgroundColor: disabled ? 'grey' : 'black',
        color: 'white',
        
        marginTop:'5px',
        border: '1px solid white',
        '&:hover': {
          backgroundColor: disabled ? 'grey' : 'black',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {disabled ? (
        <CircularProgress
          size={20}
          sx={{
            color: 'white',
          }}
        />
      ) : (
        text
      )}
    </Button>
  );
};