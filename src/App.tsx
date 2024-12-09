// App.tsx
import React, { useState, useEffect } from 'react';
import {  Card, CardMedia, CardContent, Container, AppBar, Toolbar, Typography, IconButton, Chip, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BottomTabBar from './BottomTabBar';
import { Walks, WalksList } from './Walks';
import { Tab, Screen, UserState } from './Types';
import CreateWalkForm from './CreateWalkForm';
import Login from './Login'; 
import BalanceCard from './BalanceCard';  
import TagFacesIcon from '@mui/icons-material/TagFaces';
import UserStateCard from './UserStateCard';
import {mainColor} from './Style';





interface UserChipProps {
  name: string;
}

function UserChip({ name }: UserChipProps) {
  return (
      <Chip sx={{ borderColor:'white' , color:'white'}}variant="outlined" icon={<TagFacesIcon style={{color:'white'}} />} label={name} />
  );
}


function PetCard({ name }: UserChipProps) {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchDogImage = async () => {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        if (data.status === "success") {
          setImageUrl(data.message);
        } else {
          console.error("Failed to fetch dog image");
        }
      } catch (error) {
        console.error("Error fetching dog image:", error);
      }
    };

    fetchDogImage();
  }, []);

  return (
    <Card sx={{ backgroundColor: "black", maxWidth: 200, marginBottom: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="150"
        image={imageUrl || "https://via.placeholder.com/150"} // Fallback image
        alt="pet"
      />
      <CardContent>
        <UserChip name={name} />
      </CardContent>
    </Card>
  );
}



interface HomeProps {
  userState: UserState;
}

const Home : React.FC<HomeProps>=({userState }) => {
  return(
    <div>
      <Stack direction="row" spacing={1} >
      <PetCard name={userState.name}/>
      <BalanceCard balance={userState.credit}/>
      </Stack>
      <UserStateCard/>

      <p></p>
    </div>
  )
}

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>(Tab.None);
  const [screen, setScreen] = useState<Screen>(Screen.Login);

  const [userState, setUserState] = useState<UserState>({
    name: "",
    credit: 0.0,
    ongoing_walks_as_owner: [],
    ongoing_walks_as_buyer: []
  });

  const handleLoginSuccess = (ustate : UserState) => {
    setScreen(Screen.Home); // Redirect to the home page upon successful login
    setTab(Tab.Home);
    setUserState(ustate);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setScreen(Screen.None);
  };

  const goBack = () => {
    setScreen(Screen.None);
  };

  const getAppBarTitle = () => {
    if (screen === Screen.Login) return 'Iniciar Sesión';
    if (screen === Screen.Register) return 'Register';
    if (screen === Screen.CreateWalk) return 'Ofertar Paseo';
    if (screen === Screen.ViewWalks) return 'Lista Paseos';
    if (tab === Tab.Home) return 'Inicio';
    if (tab === Tab.Walks) return 'Paseos';
    return 'App Paseos';
  };

  return (
    <>
      {/* Top AppBar */}
      <AppBar style={{backgroundColor:mainColor}} position="fixed">
        <Toolbar>
          {  ([Screen.ViewWalks, Screen.CreateWalk].includes(screen)) && (
            <IconButton edge="start" color="inherit" onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {getAppBarTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container style={{ paddingBottom: '60px', paddingTop: '90px' }}>
        {/* Login */}
        {screen === Screen.Login && <Login onLoginSuccess={handleLoginSuccess} />}

        {/* Home */}
        {tab === Tab.Home && <Home userState={userState} />}

        {/* Walks */}
        {tab === Tab.Walks && screen === Screen.None && <Walks setScreen={setScreen} />}

        {/* Create Walk */}
        {tab === Tab.Walks && screen === Screen.CreateWalk && (
          <CreateWalkForm onSuccess={() => setScreen(Screen.ViewWalks)} />
        )}
        {tab === Tab.Walks && screen === Screen.ViewWalks && (
          <div>
            <WalksList />
          </div>
        )}

        {/*Take Care */}
        {tab === Tab.TakeCare && (
          <><div style={{color:"white"}}>En desarrollo... 🚧</div></>
        )}
      </Container>

      {/* Bottom Tab Bar */}
      
      {screen !== Screen.Login &&(<BottomTabBar value={tab} onChange={handleChange} />)}
    </>
  );
};

export default App;
