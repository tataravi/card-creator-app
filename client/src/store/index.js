import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cardReducer from './slices/cardSlice';
import collectionReducer from './slices/collectionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardReducer,
    collections: collectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
