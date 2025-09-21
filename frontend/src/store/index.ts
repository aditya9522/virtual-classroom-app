import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import classesReducer from '../features/classes/ClassesSlice';
import enrollmentsReducer from '../features/enrollments/EnrollmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classesReducer,
    enrollments: enrollmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;