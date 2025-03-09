
import axios from 'axios';

const API_BASE_URL = 'https://chat-api-k4vi.onrender.com';

export const setUsername = async (username) => {
    try {
      console.log('Sending request to set username:', { username }); // Debug request payload
      const response = await axios.post(
        `${API_BASE_URL}/chat/username`,
        { username },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Set username response:', response.data); // Debug response
      return response.data;
    } catch (error) {
      console.error('Set username error:', error.response || error); // Detailed error logging
      throw error.response?.data || error; // Pass full error details
    }
  };

  export const getRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/rooms`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('Get rooms response:', response.data);
      return response.data; // Return the array directly
    } catch (error) {
      console.error('Get rooms error:', error.response || error);
      throw error.response?.data || error;
    }
  };

  export const createRoom = async (roomName) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/rooms`,
        { name: roomName }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Create room response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create room error:', error.response || error);
      throw error.response?.data || error;
    }
  };

export const getMessages = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    console.log('Get messages response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get messages error:', error.response || error);
    throw error.response?.data || error;
  }
};