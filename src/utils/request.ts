import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 根据后端返回的数据结构进行调整
    const { data } = response;

    // 假设后端返回格式: { code: 200, data: {}, message: 'success' }
    if (data.code === 200 || data.success === true) {
      return data.data || data;
    }

    // 处理业务错误
    const message = data.message || data.msg || '请求失败';
    return Promise.reject(new Error(message));
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求地址不存在';
          break;
        case 500:
          error.message = '服务器内部错误';
          break;
        default:
          error.message = data?.message || data?.msg || '请求失败';
      }
    } else if (error.request) {
      error.message = '网络错误，请检查网络连接';
    } else {
      error.message = error.message || '请求失败';
    }

    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config);
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch(url, data, config);
  },
};

export default instance;
