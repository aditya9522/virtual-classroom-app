import axios from 'axios';
import type { UserCreate, UserUpdate , LoginRequest, Token, UserResponse, ClassCreate, ClassResponse, EnrollmentResponse, MessageCreate, MessageResponse, DeleteItemResponse } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const signup = async (data: UserCreate): Promise<UserResponse> => {
  const response = await api.post<UserResponse>('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<Token> => {
  const response = await api.post<Token>('/auth/login', data);
  return response.data;
};

export const updateProfile = async (data: UserUpdate): Promise<UserResponse> => {
  const response = await api.patch<UserResponse>('/auth/me', data);
  return response.data;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>('/auth/users');
  return response.data;
};

export const getMe = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/auth/me');
  return response.data;
};

export const deleteUser = async (userId: number): Promise<DeleteItemResponse> => {
  const response = await api.delete<DeleteItemResponse>(`/auth/users/${userId}`);
  return response.data;
}

export const createClass = async (data: ClassCreate): Promise<ClassResponse> => {
  const response = await api.post<ClassResponse>('/classes', data);
  return response.data;
};

export const deleteClass = async (classId: number): Promise<DeleteItemResponse> => {
  const response = await api.delete<DeleteItemResponse>(`/classes/${classId}`);
  return response.data;
};

export const getClasses = async (skip = 0, limit = 100): Promise<ClassResponse[]> => {
  const response = await api.get<ClassResponse[]>(`/classes?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getClassById = async (classId: number): Promise<ClassResponse> => {
  const response = await api.get<ClassResponse>(`/classes/${classId}`);
  return response.data;
};

export const enrollInClass = async (classId: number): Promise<EnrollmentResponse> => {
  const response = await api.post<EnrollmentResponse>(`/classes/${classId}/enrollments`);
  return response.data;
};

export const unenrollFromClass = async (classId: number): Promise<EnrollmentResponse> => {
  const response = await api.delete<EnrollmentResponse>(`/classes/${classId}/enrollments`);
  return response.data;
};

export const getEnrollments = async (classId: number): Promise<EnrollmentResponse[]> => {
  const response = await api.get<EnrollmentResponse[]>(`/classes/${classId}/enrollments`);
  return response.data;
};

export const getMessages = async (classId: number, skip = 0, limit = 200): Promise<MessageResponse[]> => {
  const response = await api.get<MessageResponse[]>(`/classes/${classId}/messages?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const sendMessage = async (classId: number, data: MessageCreate): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(`/classes/${classId}/messages`, data);
  return response.data;
};