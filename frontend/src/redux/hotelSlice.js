import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  hotels: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (query = '', { rejectWithValue }) => {
    try {
      const normalizedQuery = query
        ? (query.startsWith('?') ? query : `?${query}`)
        : '?page=1&limit=6';

      const response = await fetch(`http://localhost:5000/api/hotels${normalizedQuery}`);

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addHotel = createAsyncThunk(
  'hotels/addHotel',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/hotels', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add hotel');
      }

      const data = await response.json();
      return data.hotel;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update hotel');
      }

      const data = await response.json();
      return data.hotel;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete hotel');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.hotels || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.hotels.unshift(action.payload);
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const hotel = action.payload;
        state.hotels = state.hotels.map((item) => (item.id === hotel.id ? hotel : item));
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.hotels = state.hotels.filter((hotel) => String(hotel.id) !== String(action.payload));
      });
  },
});

export const { setHotels, setTotal, setLoading, setError } = hotelSlice.actions;
export default hotelSlice.reducer;
