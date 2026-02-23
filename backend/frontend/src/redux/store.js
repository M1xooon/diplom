import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import filesReducer from './slices/filesSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
