import request, { requestWithToken } from './index';
// import { getToken } from '../utils/auth';

/**
 * 获取所有课程
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getAllCourses(token) {
  const requestConfig = {
    url: '/api/course/all',
    method: 'get'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 获取课程详情
 * @param {number} courseId - 课程ID
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getCourseById(courseId, token) {
  const requestConfig = {
    url: `/api/course/${courseId}`,
    method: 'get'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 通过名称获取课程
 * @param {string} name - 课程名称
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getCourseByName(name, token) {
  const requestConfig = {
    url: `/api/course/name/${name}`,
    method: 'get'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 通过代码获取课程
 * @param {string} code - 课程代码
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getCourseByCode(code, token) {
  const requestConfig = {
    url: `/api/course/code/${code}`,
    method: 'get'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 通过分类获取课程列表
 * @param {string} category - 分类名称
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getCoursesByCategory(category, token) {
  const requestConfig = {
    url: `/api/course/category/${category}`,
    method: 'get'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 模糊搜索课程名
 * @param {string} name - 课程名称关键字
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function getCoursesByNameLike(name, token) {
  const requestConfig = {
    url: '/api/course/search/name',
    method: 'get',
    params: { name }
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 搜索课程
 * @param {Object} params - 搜索条件
 * @param {string} params.keywords - 关键词
 * @param {string} [params.category] - 分类
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function searchCourses(params, token) {
  const requestConfig = {
    url: '/api/course/search',
    method: 'get',
    params
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 保存或更新课程
 * @param {Object} data - 课程信息
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function saveOrUpdateCourse(data, token) {
  const requestConfig = {
    url: '/api/course/save',
    method: 'post',
    data
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 删除课程
 * @param {number} courseId - 课程ID
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function deleteCourse(courseId, token) {
  const requestConfig = {
    url: `/api/course/${courseId}`,
    method: 'delete'
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}

/**
 * 批量删除课程
 * @param {number[]} courseIds - 课程ID数组
 * @param {string} [token] - 可选的认证token
 * @returns {Promise}
 */
export function batchDeleteCourses(courseIds, token) {
  const requestConfig = {
    url: '/api/course/batch',
    method: 'delete',
    data: courseIds
  };
  
  if (token) {
    return requestWithToken(token)(requestConfig);
  }
  
  return request(requestConfig);
}