import axios from 'axios';
import { getToken } from '../utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: 'http://118.89.136.119:8081',
  timeout: 30000 // 请求超时时间
});

// 请求拦截器，添加token等信息
service.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误等
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 错误处理
    const { response } = error;
    if (response) {
      // 根据状态码处理不同错误
      if (response.status === 401) {
        // token过期，需要重新登录
        // 可以在这里调用登出函数清除本地token等信息
      }
    }
    return Promise.reject(error);
  }
);

export default service; 