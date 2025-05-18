import request from './index';

/**
 * 获取教师信息
 * @param {number} id - 教师ID
 * @returns {Promise}
 */
export function getTeacherById(id) {
  return request({
    url: `/api/teacher/${id}`,
    method: 'get'
  });
}

/**
 * 通过用户名获取教师信息
 * @param {string} username - 用户名
 * @returns {Promise}
 */
export function getTeacherByUsername(username) {
  return request({
    url: `/api/teacher/username/${username}`,
    method: 'get'
  });
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
 * @returns {Promise}
 */
export function updateTeacher(data) {
  return request({
    url: '/api/teacher/update',
    method: 'put',
    data
  });
} 