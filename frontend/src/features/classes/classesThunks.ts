import type { AppDispatch } from '../../store';
import { setClasses, addClass, setClassesLoading, setClassesError } from './ClassesSlice';
import { getClasses, createClass, getClassById } from '../../services/api';
import type { ClassCreate } from '../../types/api';
import { toast } from 'react-toastify';

export const fetchClassesThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setClassesLoading());
  try {
    const data = await getClasses();
    dispatch(setClasses(data));
  } catch (err: any) {
    dispatch(setClassesError(err.message));
  }
};

export const createClassThunk = (data: ClassCreate) => async (dispatch: AppDispatch) => {
  try {
    const newClass = await createClass(data);
    dispatch(addClass(newClass));
    toast.success('Class created successfully');
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const fetchClassByIdThunk = (classId: number) => async (dispatch: AppDispatch) => {
  dispatch(setClassesLoading());
  try {
    const data = await getClassById(classId);
    dispatch(setClasses([data]));
  } catch (err: any) {
    dispatch(setClassesError(err.message));
  }
};