// BottomTabBar.tsx
import React from 'react';
import { AppBar, Toolbar, Tab, Tabs } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import {mainColor} from './Style';

interface BottomTabBarProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ value, onChange }) => {
  return (
    <AppBar position="fixed" style={{ top: 'auto', bottom: 0 }}>
      <Toolbar style={{ backgroundColor:mainColor, justifyContent: 'center' }}>
        <Tabs
          value={value}
          onChange={onChange}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="primary"
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'white', // Change the indicator color to white
            },
          }}
        >
          <Tab label="Pasealo" />
          <Tab icon={<PetsIcon />} />
          <Tab label="Cuidalo" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default BottomTabBar;
