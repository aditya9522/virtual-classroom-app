import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ClassResponse } from '../../types/api';

interface ClassesState {
  classes: ClassResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<ClassResponse[]>) => {
      state.classes = action.payload;
      state.loading = false;
    },
    addClass: (state, action: PayloadAction<ClassResponse>) => {
      state.classes.push(action.payload);
    },
    setClassesLoading: (state) => {
      state.loading = true;
    },
    setClassesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setClasses, addClass, setClassesLoading, setClassesError } = classesSlice.actions;
export default classesSlice.reducer;