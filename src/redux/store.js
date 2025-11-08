import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import filesReducer from './reducers/fileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
  },
});

export default store;
