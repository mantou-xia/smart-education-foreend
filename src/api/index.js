import axios from 'axios';
import { getToken, clearAuth, getRefreshToken, setToken, getValidToken } from '../utils/auth';
import { refreshToken as refreshTokenApi } from './auth';

// 标识是否正在刷新token
let isRefreshing = false;
// 请求等待队列
let waitingQueue = [];

/**
 * 重试请求函数
 * @param {Function} fn - axios请求函数
 * @param {Number} retriesLeft - 剩余重试次数
 * @param {Number} interval - 重试间隔(ms)
 * @param {Object} originalConfig - 原始请求配置
 */
const retryRequest = (fn, retriesLeft, interval, originalConfig) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`重试请求: ${originalConfig.url}, 剩余重试次数: ${retriesLeft}`);
      fn()
        .then(response => resolve(response))
        .catch(error => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          retryRequest(fn, retriesLeft - 1, interval, originalConfig)
            .then(response => resolve(response))
            .catch(err => reject(err));
        });
    }, interval);
  });
};

// 创建axios实例
const service = axios.create({
  baseURL: 'http://118.89.136.119:8081',
  timeout: 30000 // 请求超时时间
});

// 请求拦截器，添加token等信息
service.interceptors.request.use(
  config => {
    // 使用getValidToken函数获取最有效的token
    const token = getValidToken();
    
    // 调试信息：显示请求路径和token状态
    const tokenStatus = token ? '存在' : '不存在';
    console.log(`API请求: ${config.url}, Token ${tokenStatus}`);
    
    if (token) {
      // 确保token格式正确，始终添加Bearer前缀
      const tokenPrefix = "Bearer ";
      const formattedToken = token.startsWith(tokenPrefix) ? token : `${tokenPrefix}${token}`;
      
      // 设置Authorization请求头
      config.headers['Authorization'] = formattedToken;
      
      // 同时设置通用接受格式
      config.headers['Accept'] = 'application/json';
      
      console.log(`请求头Authorization已设置: ${formattedToken.substring(0, 15)}...`);
    } else {
      console.warn(`API请求: ${config.url} - 未找到认证token，尝试从localStorage直接读取`);
      
      // 直接从localStorage尝试获取token（备用方法，以防getToken函数失效）
      const directToken = localStorage.getItem('access_token');
      if (directToken) {
        const tokenPrefix = "Bearer ";
        const formattedDirectToken = directToken.startsWith(tokenPrefix) ? directToken : `${tokenPrefix}${directToken}`;
        config.headers['Authorization'] = formattedDirectToken;
        console.log(`使用直接从localStorage获取的token: ${formattedDirectToken.substring(0, 15)}...`);
      }
    }
    
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 执行刷新token操作
const doRefreshToken = async () => {
  try {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error('没有可用的refreshToken');
    }
    
    console.log('尝试刷新token...');
    const response = await refreshTokenApi({ refreshToken: refreshTokenValue });
    
    if (response && response.tokens && response.tokens.accessToken) {
      // 保存新的token
      setToken(response.tokens.accessToken);
      
      // 如果返回了新的refreshToken，也一并保存
      if (response.tokens.refreshToken) {
        localStorage.setItem('refresh_token', response.tokens.refreshToken);
      }
      
      console.log('token刷新成功:', response.tokens.accessToken.substring(0, 15) + '...');
      return response.tokens.accessToken;
    } else {
      throw new Error('刷新token返回数据格式错误');
    }
  } catch (error) {
    console.error('刷新token失败:', error);
    // 刷新失败，清除认证信息
    clearAuth();
    return null;
  }
};

// 响应拦截器，处理错误等
service.interceptors.response.use(
  response => {
    // 记录请求成功信息
    console.log(`API响应成功: ${response.config.url}`);
    return response.data;
  },
  async error => {
    // 错误处理
    const { response, config } = error;
    
    // 判断是否需要重试
    const shouldRetry = config && config.retry && config.retriesLeft > 0;
    
    if (response) {
      console.error(`API错误: ${config.url} - 状态码: ${response.status}`, response.data);
      
      // 处理401错误（认证失败）
      if (response.status === 401) {
        console.warn('认证失败: token可能已过期，尝试刷新token');
        
        // 如果是登录相关的API，不尝试刷新token
        if (config.url.includes('/login') || config.url.includes('/refresh')) {
          return Promise.reject(error);
        }
        
        // 如果已经在刷新token，则将请求加入等待队列
        if (isRefreshing) {
          console.log('已有token刷新请求进行中，加入等待队列:', config.url);
          return new Promise((resolve, reject) => {
            waitingQueue.push({
              resolve,
              reject,
              config
            });
          });
        }
        
        // 标记正在刷新token
        isRefreshing = true;
        
        try {
          // 执行刷新token
          const newToken = await doRefreshToken();
          
          if (newToken) {
            // 用新token重试当前请求
            if (config) {
              console.log('使用新token重试请求:', config.url);
              config.headers['Authorization'] = `Bearer ${newToken}`;
              
              // 执行所有等待中的请求
              waitingQueue.forEach(({ resolve, reject, config }) => {
                config.headers['Authorization'] = `Bearer ${newToken}`;
                axios(config).then(resolve).catch(reject);
              });
              
              // 重置等待队列
              waitingQueue = [];
              
              // 返回重试结果
              return axios(config);
            }
          } else {
            // 刷新token失败，拒绝所有等待中的请求
            waitingQueue.forEach(({ reject }) => {
              reject(error);
            });
            
            // 重置等待队列
            waitingQueue = [];
            
            // 可以在这里添加重定向到登录页面的逻辑
            // window.location.href = '/login';
            alert('您的登录信息已过期，请重新登录');
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // 重置等待队列
          waitingQueue.forEach(({ reject }) => {
            reject(refreshError);
          });
          
          waitingQueue = [];
          
          // 清除认证信息
          clearAuth();
          
          // 重定向到登录页面
          alert('您的登录信息已过期，请重新登录');
          return Promise.reject(refreshError);
        } finally {
          // 无论成功失败，都要重置刷新状态
          isRefreshing = false;
        }
      }
    } else {
      console.error(`API请求失败: ${config ? config.url : '未知请求'}`, error.message);
      
      // 如果启用了重试机制，尝试重试请求
      if (shouldRetry) {
        console.log(`将重试请求: ${config.url}, 剩余重试次数: ${config.retriesLeft}`);
        config.retriesLeft--;
        const retryFn = () => axios(config);
        return retryRequest(retryFn, config.retriesLeft, config.retryDelay || 1000, config);
      }
    }
    
    return Promise.reject(error);
  }
);

// 添加请求重试功能的扩展方法
service.interceptors.request.use(config => {
  if (config.retry && !config.retriesLeft) {
    config.retriesLeft = config.retry;
  }
  return config;
});

// 添加能够在每个请求中手动指定token的功能
const createRequestWithToken = (token) => {
  return (config) => {
    if (!config.headers) config.headers = {};
    
    // 如果提供了自定义token，则使用它，否则使用默认的getToken()获取
    const tokenToUse = token || getToken();
    
    if (tokenToUse) {
      const tokenPrefix = "Bearer ";
      config.headers['Authorization'] = tokenToUse.startsWith(tokenPrefix) 
        ? tokenToUse 
        : `${tokenPrefix}${tokenToUse}`;
      
      console.log(`使用自定义token发起请求: ${config.url}`);
    }
    
    return service(config);
  };
};

// 导出直接使用特定token的方法
export const requestWithToken = createRequestWithToken;

export default service; 