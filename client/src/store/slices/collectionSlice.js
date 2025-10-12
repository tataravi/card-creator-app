import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching collections
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/collections', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

// Async thunk for creating a collection
export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (collectionData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/collections', collectionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create collection');
    }
  }
);

const initialState = {
  collections: [],
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    addCollection: (state, action) => {
      state.collections.unshift(action.payload);
    },
    updateCollection: (state, action) => {
      const index = state.collections.findIndex(collection => collection._id === action.payload._id);
      if (index !== -1) {
        state.collections[index] = action.payload;
      }
    },
    deleteCollection: (state, action) => {
      state.collections = state.collections.filter(collection => collection._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload.collections || action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections.unshift(action.payload);
      });
  },
});

export const {
  addCollection,
  updateCollection,
  deleteCollection,
} = collectionSlice.actions;

export default collectionSlice.reducer;
