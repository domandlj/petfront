import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const PAY_LINK = process.env.REACT_APP_PAY_LINK;


const MercadoPagoButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Comprar
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Realizar Pago</DialogTitle>
        <DialogContent sx={{overflowX: 'hidden' }}>

          <iframe
            src={PAY_LINK}
            width="120%"
            height="800px"  // Ensures the iframe takes the full height of the DialogContent
            
            style={{ border: "none",transform: "scale(0.85)",transformOrigin: "top left"}}  // Hide scrollbars
            title="MercadoPago"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MercadoPagoButton;
