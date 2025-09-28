export interface UserCreate {
  email: string;
  password: string;
  full_name?: string | null;
  role: 'student' | 'teacher' | 'admin';
}

export interface UserUpdate {
  full_name?: string | null;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface Token {
  token: string;
  token_type: 'bearer';
}

export interface UserResponse extends Token {
  id: number;
  email: string;
  full_name: string | null;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface DeleteItemResponse {
  message: string;
}

export interface ClassCreate {
  title: string;
  description?: string | null;
  scheduled_at?: string | null;  // ISO 8601
  teacher_id?: number | null;
}

export interface ClassResponse {
  id: number;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  teacher_id: number | null;
  created_at: string;
}

export interface EnrollmentResponse {
  id: number;
  class_id: number;
  student_id: number;
  enrolled_at: string;
}

export interface MessageCreate {
  content: string;
}

export interface MessageResponse {
  id: number;
  class_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}