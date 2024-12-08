import axios from 'axios';
import { WalkState} from './Types'; 
const API_URL = process.env.REACT_APP_API_URL;


// HTTP: PUT
export const updateWalkState = async (walkId: number, state: WalkState) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token is missing. Please log in.');
    return;
  }

  axios
    .put(
      `${API_URL}/walks/walk_ongoing/${walkId}`,
      {"state": state},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data.message);
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        console.error(`Error: ${error.response?.data?.detail || 'Unknown error'}`);
      } else {
        console.error('Unexpected error occurred');
      }
    });
};
// HTTP: DELETE
export const deleteOngoingWalk = async (walkId: number) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  if (!token) {
    return Promise.reject('Authentication token is missing');
  }

  axios
    .delete(`${API_URL}/walks/walk_ongoing/${walkId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
    .then((response) => {
      return response.data.message; // Return the success message from the response
    })
    .catch((error: any) => {
      if (error.response) {
        // If there is a response from the server, handle the error accordingly
        return Promise.reject(error.response.data.detail || 'Error occurred while deleting the ongoing walk');
      } else {
        // If there's no response, it's likely a network issue or the token is missing
        return Promise.reject(error.message || 'An unexpected error occurred');
      }
    });
};