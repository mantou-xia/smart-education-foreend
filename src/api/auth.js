import request, { requestWithToken } from './index';

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  console.log(`尝试登录: ${data.username}`);
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
    transformResponse: [
      (data) => {
        // 尝试解析响应数据
        try {
          const response = JSON.parse(data);
          if (response && response.tokens && response.tokens.accessToken) {
            console.log(`登录成功，token长度: ${response.tokens.accessToken.length}`);
          } else {
            console.warn('登录响应缺少token信息');
          }
          return response;
        } catch (e) {
          console.error('解析登录响应失败:', e);
          return data;
        }
      }
    ]
  });
}

/**
 * 刷新token
 * @param {Object} data - refreshToken
 * @param {string} data.refreshToken - 刷新token
 * @returns {Promise}
 */
export function refreshToken(data) {
  return request({
    url: '/api/auth/refresh',
    method: 'post',
    data
  });
}

/**
 * 修改密码
 * @param {Object} data - 密码信息
 * @param {string} data.username - 用户名
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function changePassword(data, token) {
  const requestConfig = {
    url: '/api/auth/change-password',
    method: 'put',
    data
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 检查用户名是否可用
 * @param {string} username - 用户名
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function checkAvailableUsername(username, token) {
  const requestConfig = {
    url: '/api/auth/check-available-username',
    method: 'get',
    params: { username }
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 教师注册
 * @param {Object} data - 注册信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} data.fullname - 姓名
 * @param {string} data.phone - 手机号
 * @returns {Promise}
 */
export function registerTeacher(data) {
  console.log(`尝试注册教师: ${data.username}`);
  return request({
    url: '/api/teacher/register',
    method: 'post',
    data,
    transformResponse: [
      (responseData) => {
        try {
          const response = JSON.parse(responseData);
          if (response && response.accessToken) {
            console.log(`教师注册成功，accessToken长度: ${response.accessToken.length}`);
          } else {
            console.warn('教师注册响应缺少accessToken信息');
          }
          return response;
        } catch (e) {
          console.error('解析教师注册响应失败:', e);
          return responseData;
        }
      }
    ]
  });
}

/**
 * 学生注册
 * @param {Object} data - 注册信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} data.fullname - 姓名
 * @param {string} data.phone - 手机号
 * @returns {Promise}
 */
export function registerStudent(data) {
  console.log(`尝试注册学生: ${data.username}`);
  return request({
    url: '/api/student/register',
    method: 'post',
    data,
    transformResponse: [
      (responseData) => {
        try {
          const response = JSON.parse(responseData);
          if (response && response.accessToken) {
            console.log(`学生注册成功，accessToken长度: ${response.accessToken.length}`);
          } else {
            console.warn('学生注册响应缺少accessToken信息');
          }
          return response;
        } catch (e) {
          console.error('解析学生注册响应失败:', e);
          return responseData;
        }
      }
    ]
  });
} 