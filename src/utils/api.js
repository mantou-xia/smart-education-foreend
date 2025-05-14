/**
 * API服务
 * 模拟前后端交互，实际项目中会替换为真实的API调用
 */

import { authenticateUser } from './mockUsers';

// 模拟API请求延迟
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API服务
const apiService = {
  auth: {
    /**
     * 用户登录
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Promise<Object>} 登录结果
     */
    async login(username, password) {
      // 模拟网络延迟
      await simulateDelay();
      
      try {
        const user = authenticateUser(username, password);
        
        if (user) {
          return {
            success: true,
            user,
            message: '登录成功'
          };
        } else {
          return {
            success: false,
            message: '用户名或密码错误'
          };
        }
      } catch (error) {
        console.error('登录过程发生错误:', error);
        return {
          success: false,
          message: '登录失败，请稍后再试'
        };
      }
    },
    
    /**
     * 用户登出
     * @returns {Promise<Object>} 登出结果
     */
    async logout() {
      await simulateDelay();
      
      // 清除本地存储的用户数据
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      
      return {
        success: true,
        message: '已成功登出'
      };
    }
  }
};

export default apiService; 