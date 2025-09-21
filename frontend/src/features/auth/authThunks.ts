import type { AppDispatch } from '../../store';
import { setUser, logout, setLoading, setError } from './AuthSlice';
import { login, signup, getMe } from '../../services/api';
import type { LoginRequest, UserCreate } from '../../types/api';

export const loginThunk = (credentials: LoginRequest) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const { token } = await login(credentials);
    localStorage.setItem('token', token);
    const user = await getMe();
    dispatch(setUser(user));
    return user;
  } catch (err: any) {
    const error = err.response?.data?.detail || 'Login failed';
    dispatch(setError(error));
    throw error;
  }
};

export const signupThunk = (data: UserCreate) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    await signup(data);
    const user = await getMe();
    dispatch(setUser(user));
  } catch (err: any) {
    dispatch(setError(err.response?.data?.detail || 'Signup failed'));
  }
};

export const fetchUserThunk = () => async (dispatch: AppDispatch) => {
  if (localStorage.getItem('token')) {
    dispatch(setLoading());
    try {
      const user = await getMe();
      dispatch(setUser(user));
    } catch (err) {
      dispatch(logout());
    }
  }
};