export enum Tab {
  Walks = 0,
  Home = 1,
  TakeCare = 2,
  None = 3
}

export type UserState = {
  name: string;
  credit: number;
  ongoing_walks_as_owner: WalkOnGoing[];
  ongoing_walks_as_buyer: WalkOnGoing[];
};

export enum Screen {
  CreateWalk,
  ViewWalks,
  Home,
  Login,
  Register,
  None  
}

export interface WalkOffer {
  id: number;
  price: number;
  location_latitude: number;
  location_longitude: number;
  location : string;
  schedule: string;
  owner_name: string;
}

export type WalkState =
  | "JustBought" 
  | "GoingToPickUpDog" 
  | "Running" 
  | "WaitingForWalkEnd" 
  | "GoingToBringBackDog"
  | "Terminated";

export interface WalkOnGoing {
  id: number;
  price: number;
  location_latitude: number;
  location_longitude: number;
  location : string;
  schedule: string;
  owner_name: string;
  buyer_name: string;
  state:WalkState;
}

export type MsgClient =
  | "GiveMeDogBack"
  | "TerminateWalk";

export type MsgWalker =
  | "GoingToPickUpDog"
  | "GoingToReturnDog"
  | "OkBringMeMyDog"
  | "IWantToGiveDogBack";


export type Msg = MsgClient | MsgWalker;

export interface Message {
  id:number;
  sender_username: string;
  recipient_username: string;
  body: string;
}