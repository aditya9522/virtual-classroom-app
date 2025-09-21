import type { AppDispatch } from '../../store';
import { setEnrollments, addEnrollment, removeEnrollment, setEnrollmentsLoading, setEnrollmentsError } from './EnrollmentsSlice';
import { getEnrollments, enrollInClass, unenrollFromClass } from '../../services/api';
import { toast } from 'react-toastify';

export const fetchEnrollmentsThunk = (classId: number) => async (dispatch: AppDispatch) => {
  dispatch(setEnrollmentsLoading());
  try {
    const data = await getEnrollments(classId);
    dispatch(setEnrollments(data));
  } catch (err: any) {
    dispatch(setEnrollmentsError(err.message));
  }
};

export const enrollThunk = (classId: number) => async (dispatch: AppDispatch) => {
  try {
    const enrollment = await enrollInClass(classId);
    dispatch(addEnrollment(enrollment));
    toast.success('Enrolled successfully');
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const unenrollThunk = (classId: number) => async (dispatch: AppDispatch) => {
  try {
    const enrollment = await unenrollFromClass(classId);
    dispatch(removeEnrollment(enrollment.id));
    toast.success('Unenrolled successfully');
  } catch (err: any) {
    toast.error(err.message);
  }
};