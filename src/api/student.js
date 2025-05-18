import request from './index';

/**
 * 获取学生信息
 * @param {number} studentId - 学生ID
 * @returns {Promise}
 */
export function getStudentById(studentId) {
  return request({
    url: `/api/student/${studentId}`,
    method: 'get'
  });
}

/**
 * 通过用户名获取学生信息
 * @param {string} username - 用户名
 * @returns {Promise}
 */
export function getStudentByUsername(username) {
  return request({
    url: `/api/student/username/${username}`,
    method: 'get'
  });
}

/**
 * 学生注册
 * @param {Object} data - 学生注册信息
 * @returns {Promise}
 */
export function registerStudent(data) {
  return request({
    url: '/api/student/register',
    method: 'post',
    data
  });
}

/**
 * 保存或更新学生信息
 * @param {Object} data - 学生信息
 * @returns {Promise}
 */
export function saveOrUpdateStudent(data) {
  return request({
    url: '/api/student/save',
    method: 'post',
    data
  });
}

/**
 * 搜索学生
 * @param {Object} params - 搜索参数
 * @param {string} [params.keywords] - 关键词
 * @param {string} [params.grade] - 年级
 * @param {string} [params.className] - 班级名称
 * @returns {Promise}
 */
export function searchStudents(params) {
  return request({
    url: '/api/student/search',
    method: 'get',
    params
  });
}

/**
 * 通过姓名获取学生列表
 * @param {string} fullName - 学生姓名
 * @returns {Promise}
 */
export function getStudentsByFullName(fullName) {
  return request({
    url: '/api/student/search/name',
    method: 'get',
    params: { fullName }
  });
}

/**
 * 获取班级学生列表
 * @param {Object} params - 参数
 * @param {string} [params.grade] - 年级
 * @param {string} [params.className] - 班级名称
 * @returns {Promise}
 */
export function getStudentsByClass(params) {
  return request({
    url: '/api/student/class',
    method: 'get',
    params
  });
}

/**
 * 检查邮箱是否可用
 * @param {string} email - 邮箱
 * @returns {Promise}
 */
export function checkEmail(email) {
  return request({
    url: '/api/student/check/email',
    method: 'get',
    params: { email }
  });
} 