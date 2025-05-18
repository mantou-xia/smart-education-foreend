import request from './index';

/**
 * 获取所有课程
 * @returns {Promise}
 */
export function getAllCourses() {
  return request({
    url: '/api/course/all',
    method: 'get'
  });
}

/**
 * 获取课程详情
 * @param {number} courseId - 课程ID
 * @returns {Promise}
 */
export function getCourseById(courseId) {
  return request({
    url: `/api/course/${courseId}`,
    method: 'get'
  });
}

/**
 * 通过名称获取课程
 * @param {string} name - 课程名称
 * @returns {Promise}
 */
export function getCourseByName(name) {
  return request({
    url: `/api/course/name/${name}`,
    method: 'get'
  });
}

/**
 * 通过代码获取课程
 * @param {string} code - 课程代码
 * @returns {Promise}
 */
export function getCourseByCode(code) {
  return request({
    url: `/api/course/code/${code}`,
    method: 'get'
  });
}

/**
 * 通过分类获取课程列表
 * @param {string} category - 分类名称
 * @returns {Promise}
 */
export function getCoursesByCategory(category) {
  return request({
    url: `/api/course/category/${category}`,
    method: 'get'
  });
}

/**
 * 模糊搜索课程名
 * @param {string} name - 课程名称关键字
 * @returns {Promise}
 */
export function getCoursesByNameLike(name) {
  return request({
    url: '/api/course/search/name',
    method: 'get',
    params: { name }
  });
}

/**
 * 搜索课程
 * @param {Object} params - 搜索条件
 * @param {string} params.keywords - 关键词
 * @param {string} [params.category] - 分类
 * @returns {Promise}
 */
export function searchCourses(params) {
  return request({
    url: '/api/course/search',
    method: 'get',
    params
  });
}

/**
 * 保存或更新课程
 * @param {Object} data - 课程信息
 * @returns {Promise}
 */
export function saveOrUpdateCourse(data) {
  return request({
    url: '/api/course/save',
    method: 'post',
    data
  });
}

/**
 * 删除课程
 * @param {number} courseId - 课程ID
 * @returns {Promise}
 */
export function deleteCourse(courseId) {
  return request({
    url: `/api/course/${courseId}`,
    method: 'delete'
  });
}

/**
 * 批量删除课程
 * @param {number[]} courseIds - 课程ID数组
 * @returns {Promise}
 */
export function batchDeleteCourses(courseIds) {
  return request({
    url: '/api/course/batch',
    method: 'delete',
    data: courseIds
  });
}