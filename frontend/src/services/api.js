const API_URL = 'http://localhost:5000/api';

export const api = {
  getHotels: async (query = '') => {
    const response = await fetch(`${API_URL}/hotels${query}`);
    return response.json();
  },

  getHotelById: async (id) => {
    const response = await fetch(`${API_URL}/hotels/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch hotel details.');
    }

    return data.hotel;
  },
};
