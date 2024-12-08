import axios from 'axios';
import { WalkOnGoing, UserState} from './Types'; 

const API_URL = process.env.REACT_APP_API_URL;
const GEOCODING_API_URL = process.env.REACT_APP_GEOCODING_API_URL!;

  // Fetch readable location for each walk offer
const fetchLocations = async (lat:number, lon:number) => {
    try {
          const response = await axios.get(GEOCODING_API_URL, {
            params: {
              lat: lat,
              lon: lon,
              format: 'json',
            },
          });
          return response.data.display_name;
        } catch (error) {
          console.error('Error fetching location:', error);
          return 'Location unavailable';
        }        
};

export const fetchUserState = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/user_state`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const st = response.data;

    // Fetch locations for ongoing walks as owner
    const ownerWalks = await Promise.all(st.ongoing_walks_as_owner.map(async (walk: WalkOnGoing) => ({
      ...walk,
      location: await fetchLocations(walk.location_latitude, walk.location_longitude),
    })));

    // Fetch locations for ongoing walks as buyer
    const buyerWalks = await Promise.all(st.ongoing_walks_as_buyer.map(async (walk: WalkOnGoing) => ({
      ...walk,
      location: await fetchLocations(walk.location_latitude, walk.location_longitude),
    })));

    const result  : UserState = {
      ...st,
      ongoing_walks_as_owner: ownerWalks,
      ongoing_walks_as_buyer: buyerWalks,
    };
    // Set the updated user state with resolved locations
    return result;

  } catch (error) {
    console.error("Error fetching user state:", error);
  }
};