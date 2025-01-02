import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, Chip } from '@mui/material';
import { UserState, Message} from './Types'; 
import TagFacesIcon from '@mui/icons-material/TagFaces';
import {fetchMessages} from './Messages'; 
import VerticalWalkStepper from './WalkStepper';
import {fetchUserState} from './UserMethods';
import {sendGoingToReturnDog,sendOkBringMyDog, sendOkComeToPickUpDog,
  sendGiveMeDogBack, sendIWantToGiveDogBack, sendFinishWalk, sendDogGiven, sendGoingToPickUpDog} from './WalkMessages';

import {OnePressButton} from './UtilsComponents';
import Chat from './Chat';


const UserStateCard: React.FC = () => {
  const [userState, setUserState] = useState<UserState >(
    {  
      name: "",
      credit: 0.0,
      ongoing_walks_as_owner: [],
      ongoing_walks_as_buyer: []
    });
  
  
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  console.log(sentMessages);


  const fetchMessagesWrapped = async () => {
    try {
      const messages = await fetchMessages();
      setReceivedMessages(messages.received_messages);
      setSentMessages(messages.sent_messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const fetchUserStateWrapped = async () => {
    try {
      const response  = await fetchUserState();
      if (response){
        setUserState(response);
      }
    } catch (error) {
      console.error("Error fetching user state:", error);
    }
  };

  const applyAndUpdate = async (f:any, x: any) => {f(x); fetchUserStateWrapped()};

  useEffect(() => {
      
      
      const fetchData = async () => {
        await fetchUserStateWrapped();
        await fetchMessagesWrapped();
      };

      // Initial fetch
      fetchData();


      // Set up interval to fetch data every 5 seconds
      const intervalId = setInterval(fetchData, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
    
    

  if (!userState) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ color: 'white', backgroundColor:'black' ,marginTop: '5px' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Paseo vigente 🦮
        </Typography>
        {userState.ongoing_walks_as_owner.length + userState.ongoing_walks_as_buyer.length  === 0 && (
           <Typography>Ninguno</Typography>
        )}

        {/* You're walking a dog */}
        {userState.ongoing_walks_as_owner.length === 0 ? (
          <Typography></Typography>
        ) : (
          userState.ongoing_walks_as_owner.map((walk) => (
            <div key={walk.id}>
              <VerticalWalkStepper currentState={walk.state} />
              <Typography variant="body1" component="div">
              Estás paseando el perro de <Chip sx={{ borderColor:'white' , color:'white'}} 
                variant="outlined" icon={<TagFacesIcon style={{color:'white'}} />}  label={walk.buyer_name} />       

              </Typography>
              <Typography >
               Horario: {walk.schedule}
              </Typography>
              <Typography >
                Ubicación: {walk.location}
              </Typography>
              {walk.state==="JustBought"&&(<OnePressButton onClick={() => applyAndUpdate(sendGoingToPickUpDog, walk)} text="Voy a buscarlo"/>)}
              {walk.state==="Running"&&(<OnePressButton onClick={() => applyAndUpdate(sendIWantToGiveDogBack,walk)}text="Devolver"/>)}
              <Chat userA={walk.owner_name} userB={walk.buyer_name} />

              <Divider sx={{ marginY: 1 }} />
            </div>
          ))
        )}
        
        {/* Your dog is being walked */}
        {userState.ongoing_walks_as_buyer.length === 0 ? (
          <Typography></Typography>
        ) : (
          userState.ongoing_walks_as_buyer.map((walk) => (
            <div key={walk.id}>
              <VerticalWalkStepper currentState={walk.state} />
              <Typography variant="body1" component="div">
                Tu perro es paseado por <Chip  variant="outlined" style={{color:'white'}} icon={<TagFacesIcon />} label={walk.owner_name} />       

              </Typography>
            
              <Typography >
               Horario: {walk.schedule}
              </Typography>
              <Typography>
                Ubicación: {walk.location}
              </Typography>
              {walk.state==="Running"&&(<OnePressButton onClick={() => sendGiveMeDogBack(walk) } text="Traemelo"/>)}
              {walk.state==="WaitingForWalkEnd"&&(<OnePressButton onClick={() => {sendFinishWalk(receivedMessages, walk); fetchUserStateWrapped()} } text="Finalizar"/>)}
              {walk.state==="GoingToPickUpDog"&&(<OnePressButton onClick={() => {sendDogGiven(receivedMessages, walk); fetchUserStateWrapped()} } text="Perro entregado"/>)}
              <Chat userA={walk.buyer_name} userB={walk.owner_name} />

              <Divider sx={{ marginY: 1 }} />
            </div>
          ))
        )}

        {/* Received Messages */}
        <Typography variant="h6" component="div" gutterBottom sx={{ marginTop: '20px' }}>
          Notificaciones 🔔
        </Typography>
        {receivedMessages.length === 0 ? (
          <Typography>Nada nuevo</Typography>
        ) : (
          receivedMessages.map((msg) => (
            <div key={msg.id}>
              <Typography variant="body1" component="div">
                <strong>De: {msg.sender_username}</strong>
              </Typography>
              {/* buyer inbox*/}
              {msg.body === "GoingToReturnDog"&&(<Typography>Perro en camino</Typography>)}
              {msg.body === "IWantToGiveDogBack"&&(<Typography>Quiere devolver el perro</Typography>)}
              {msg.body === "IWantToGiveDogBack"&&(<OnePressButton onClick={() => applyAndUpdate(sendOkBringMyDog, msg)} text="Traemelo"/>)}
              {msg.body === "GoingToPickUpDog"&&(<Typography>Quiere buscar el perro</Typography>)}
              {msg.body === "GoingToPickUpDog" &&(<OnePressButton onClick={() => applyAndUpdate(sendOkComeToPickUpDog,msg)} text="Veni a buscarlo" />)}

              {/* walker inbox*/}
              {msg.body === "GiveMeDogBack" &&(<Typography>Necesito el perro de vuelta</Typography>)}
              {msg.body === "GiveMeDogBack" &&(<OnePressButton onClick={() => applyAndUpdate(sendGoingToReturnDog,msg)}  text="Te lo llevo"/>)}
              {msg.body === "OkBringMeMyDog"&&(<Typography>Ok, traeme el perro</Typography>)}
              {msg.body === "OkBringMeMyDog" &&(<OnePressButton onClick={() => {applyAndUpdate(sendGoingToReturnDog,msg)}} text="Te lo llevo"/>)}
              


              


              <Divider sx={{ marginY: 1 }} />
            </div>

          ))
        )}

        


        {/* Sent Messages 
        <Typography variant="h6" component="div" gutterBottom sx={{ marginTop: '20px' }}>
          Mensajes Enviados
        </Typography>
        {sentMessages.length === 0 ? (
          <Typography>No tienes mensajes enviados</Typography>
        ) : (
          sentMessages.map((msg) => (
            <div key={msg.id}>
              <Typography variant="body1" component="div">
                <strong>A: {msg.recipient_username}</strong>
              </Typography>
              <Typography>{msg.body}</Typography>
              <Divider sx={{ marginY: 1 }} />
            </div>
          ))
        )}
        */}
      </CardContent>
    </Card>
  );
};

export default UserStateCard;
