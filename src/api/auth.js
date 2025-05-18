import request from './index';

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
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
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/api/auth/change-password',
    method: 'put',
    data
  });
}

/**
 * 检查用户名是否可用
 * @param {string} username - 用户名
 * @returns {Promise}
 */
export function checkAvailableUsername(username) {
  return request({
    url: '/api/auth/check-available-username',
    method: 'get',
    params: { username }
  });
} 