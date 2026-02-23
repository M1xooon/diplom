import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { logIn, logOut, userMe, getCsrfCookie } from '../../api/requests';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await logIn(email, password);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      const userResponse = await userMe();
      const userData = await userResponse.json();

      return {
        username: userData.username,
        isAdmin: userData.isAdmin,
        sessionId: Cookies.get('sessionid'),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logOut();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      // Проверяем есть ли sessionId
      if (!Cookies.get('sessionid')) {
        return rejectWithValue('No session');
      }
      
      const response = await userMe();
      
      // Если ответ не успешный, значит пользователь не авторизован
      if (!response.ok) {
        return rejectWithValue('Not authenticated');
      }
      
      const data = await response.json();

      return {
        username: data.username,
        isAdmin: data.isAdmin,
        sessionId: Cookies.get('sessionid'),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeCsrf = createAsyncThunk(
  'auth/initializeCsrf',
  async () => {
    if (!Cookies.get('csrftoken')) {
      await getCsrfCookie();
    }
    return null;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: null,
    isAdmin: false,
    sessionId: null,
    currentStorageUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentStorageUser: (state, action) => {
      state.currentStorageUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.isAdmin = action.payload.isAdmin;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.username = null;
        state.isAdmin = false;
        state.sessionId = null;
        state.currentStorageUser = null;
      })

      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.isAdmin = action.payload.isAdmin;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentStorageUser, clearError } = authSlice.actions;
export default authSlice.reducer;
