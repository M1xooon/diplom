import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserList, deleteUser, patchUser } from '../../api/requests';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserList();
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch users');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeUser = createAsyncThunk(
  'admin/removeUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await deleteUser(userId);
      
      if (!response.ok) {
        return rejectWithValue('Failed to delete user');
      }
      
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserAdminStatus = createAsyncThunk(
  'admin/toggleUserAdminStatus',
  async ({ userId, isStaff }, { rejectWithValue }) => {
    try {
      const response = await patchUser(userId, !isStaff);
      
      if (!response.ok) {
        return rejectWithValue('Failed to update user');
      }
      
      return { userId, isStaff: !isStaff };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove user
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle admin status
      .addCase(toggleUserAdminStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserAdminStatus.fulfilled, (state, action) => {
        state.loading = false;
        const user = state.users.find(u => u.id === action.payload.userId);
        if (user) {
          user.is_staff = action.payload.isStaff;
        }
      })
      .addCase(toggleUserAdminStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
