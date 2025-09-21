import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EnrollmentResponse } from '../../types/api';

interface EnrollmentsState {
  enrollments: EnrollmentResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    setEnrollments: (state, action: PayloadAction<EnrollmentResponse[]>) => {
      state.enrollments = action.payload;
      state.loading = false;
    },
    addEnrollment: (state, action: PayloadAction<EnrollmentResponse>) => {
      state.enrollments.push(action.payload);
    },
    removeEnrollment: (state, action: PayloadAction<number>) => {
      state.enrollments = state.enrollments.filter((e) => e.id !== action.payload);
    },
    setEnrollmentsLoading: (state) => {
      state.loading = true;
    },
    setEnrollmentsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setEnrollments, addEnrollment, removeEnrollment, setEnrollmentsLoading, setEnrollmentsError } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;