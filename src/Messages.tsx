import axios from 'axios';
import {Msg} from './Types';  // Adjust the import based on the correct file path

const API_URL = process.env.REACT_APP_API_URL;


interface MessageDeletedSchema {
  id: number;
}


export const sendMessage = async (recipientUsername: string, msg : Msg) => {
  const senderToken = localStorage.getItem('token');
  if (!senderToken) {
    console.error('No token found');
    return;
  }

  const messageData = {
    recipient_username: recipientUsername,
    body: msg, // The message content
  };

  try {
    const response = await axios.post(
      `${API_URL}/msgs/send`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${senderToken}`,
        },
      }
    );
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


export const deleteMessage = async (messageId: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.delete<MessageDeletedSchema>(`${API_URL}/msgs/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios specific errors
      console.error('Error deleting message:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};



export const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/msgs/rcv`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    return response.data;
    //setReceivedMessages(messages.received_messages);
    //setSentMessages(messages.sent_messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};