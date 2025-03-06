export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string;
  completed?: boolean; // 互換性のために残す
  category_id?: string;
  category?: Category;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string;
  category_id?: string;
  tags?: string[];
}

export interface CategoryFormData {
  name: string;
  color: string;
}

export interface TagFormData {
  name: string;
}

export interface UserFormData {
  email: string;
  password: string;
  display_name?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface UpdatePasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
