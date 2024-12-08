import {sendMessage, deleteMessage} from './Messages'; 
import {deleteOngoingWalk, updateWalkState} from './WalksMethods';
import { WalkOnGoing, Message} from './Types'; 

export const sendGoingToReturnDog = async (msg: Message) => {
  await sendMessage(msg.sender_username,"GoingToReturnDog");
  await deleteMessage(msg.id);
}

export const sendOkBringMyDog = async (msg: Message) => {
  await sendMessage(msg.sender_username,"OkBringMeMyDog");
  await deleteMessage(msg.id);
}

export const sendOkComeToPickUpDog = async (msg : Message) => {
  await deleteMessage(msg.id);
}

export const sendGiveMeDogBack = async (walk : WalkOnGoing) => {
  await sendMessage(walk.owner_name,"GiveMeDogBack");
  await updateWalkState(walk.id,"WaitingForWalkEnd");
}

export const sendIWantToGiveDogBack = async (walk : WalkOnGoing) => {
  await sendMessage(walk.buyer_name,"IWantToGiveDogBack");
  await updateWalkState(walk.id,"WaitingForWalkEnd");
}

export const cleanMsgs = async (receivedMessages : Message[], walk:WalkOnGoing) => {
  receivedMessages.map(msg => 
    msg.sender_username === walk.owner_name && deleteMessage(msg.id));
}
export const sendFinishWalk = async (receivedMessages : Message[], walk:WalkOnGoing) => {
  await cleanMsgs(receivedMessages, walk);
  await deleteOngoingWalk(walk.id);
}

export const sendDogGiven = async  (receivedMessages : Message[], walk:WalkOnGoing) => {
  await cleanMsgs(receivedMessages, walk);
  await updateWalkState(walk.id,"Running");
}

export const sendGoingToPickUpDog = async (walk : WalkOnGoing) => {
  await sendMessage(walk.buyer_name,"GoingToPickUpDog");
  await updateWalkState(walk.id,"GoingToPickUpDog");
}