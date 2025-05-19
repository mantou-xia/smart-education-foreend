import request, { requestWithToken } from './index';
// import { getToken } from '../utils/auth';

/**
 * 获取教师信息
 * @param {number} id - 教师ID
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getTeacherById(id, token) {
  const requestConfig = {
    url: `/api/teacher/${id}`,
    method: 'get'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 通过用户名获取教师信息
 * @param {string} username - 用户名
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getTeacherByUsername(username, token) {
  const requestConfig = {
    url: `/api/teacher/username/${username}`,
    method: 'get',
    retry: 3,  // 增加重试次数
    retryDelay: 1000  // 增加重试延迟
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 教师注册
 * @param {Object} data - 教师注册信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} data.fullName - 姓名
 * @param {string} data.phone - 电话
 * @returns {Promise}
 */
export function registerTeacher(data) {
  return request({
    url: '/api/teacher/register',
    method: 'post',
    data
  });
}

/**
 * 更新教师信息
 * @param {Object} data - 教师更新信息
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function updateTeacher(data, token) {
  const requestConfig = {
    url: '/api/teacher/update',
    method: 'put',
    data
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
} 