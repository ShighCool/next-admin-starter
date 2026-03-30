import { request } from '@/utils/request';

// 用户类型定义
export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
  createdAt: string;
}

// 分页响应
export interface PageResponse<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
}

// 用户列表参数
export interface UserListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  status?: string;
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * 用户登录
 */
export const login = (params: LoginParams): Promise<LoginResponse> => {
  return request.post('/auth/login', params);
};

/**
 * 获取用户列表
 */
export const getUserList = (params: UserListParams): Promise<PageResponse<User>> => {
  return request.get('/users', { params });
};

/**
 * 获取用户详情
 */
export const getUserDetail = (id: number): Promise<User> => {
  return request.get(`/users/${id}`);
};

/**
 * 创建用户
 */
export const createUser = (data: Partial<User>): Promise<User> => {
  return request.post('/users', data);
};

/**
 * 更新用户
 */
export const updateUser = (id: number, data: Partial<User>): Promise<User> => {
  return request.put(`/users/${id}`, data);
};

/**
 * 删除用户
 */
export const deleteUser = (id: number): Promise<void> => {
  return request.delete(`/users/${id}`);
};

/**
 * 批量删除用户
 */
export const batchDeleteUsers = (ids: number[]): Promise<void> => {
  return request.post('/users/batch-delete', { ids });
};
