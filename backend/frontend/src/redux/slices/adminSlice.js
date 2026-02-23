import { configureStore } from '@reduxjs/toolkit';


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
