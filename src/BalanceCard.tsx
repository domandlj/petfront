import React from 'react';
import { Card, CardContent, Typography, CardActions } from '@mui/material';
import MercadoPagoButton from './MercadoPagoButton';

interface BalanceCardProps {
  balance: number;
  //onDeposit: () => void;
  //onWithdraw: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <Card sx={{ backgroundColor: 'black',color:'white', width: '95%' }}>
      <CardContent>
        <Typography style={{color:'white'}} variant="h6" component="div">
          Saldo
        </Typography>
        <Typography style={{color:'white'}}  variant="h4" color="text.primary">
          ${balance.toFixed(2)} ARS
        </Typography>
      </CardContent>
      <CardActions>
        
        <MercadoPagoButton  />
        </CardActions>
    </Card>
  );
};

export default BalanceCard;
