import request from './index';

/**
 * 获取知识点信息
 * @param {number} id - 知识点ID
 * @returns {Promise}
 */
export function getKnowledgeById(id) {
  return request({
    url: `/api/knowledge/${id}`,
    method: 'get'
  });
}

/**
 * 获取教师的所有知识点
 * @param {number} teacherId - 教师ID
 * @returns {Promise}
 */
export function getKnowledgeByTeacherId(teacherId) {
  return request({
    url: `/api/knowledge/teacher/${teacherId}`,
    method: 'get'
  });
}

/**
 * 获取课程的所有知识点
 * @param {number} courseId - 课程ID
 * @returns {Promise}
 */
export function getKnowledgeByCourseId(courseId) {
  return request({
    url: `/api/knowledge/course/${courseId}`,
    method: 'get'
  });
}

/**
 * 获取教师在某课程下的所有知识点
 * @param {number} courseId - 课程ID
 * @param {number} teacherId - 教师ID
 * @returns {Promise}
 */
export function getKnowledgeByTeacherInCourse(courseId, teacherId) {
  return request({
    url: `/api/knowledge/course/${courseId}/teacher/${teacherId}`,
    method: 'get'
  });
}

/**
 * 保存知识点
 * @param {Object} data - 知识点信息
 * @returns {Promise}
 */
export function saveKnowledge(data) {
  return request({
    url: '/api/knowledge/save',
    method: 'post',
    data
  });
}

/**
 * 更新知识点
 * @param {Object} data - 知识点更新信息
 * @returns {Promise}
 */
export function updateKnowledge(data) {
  return request({
    url: '/api/knowledge/update',
    method: 'put',
    data
  });
}

/**
 * 删除知识点
 * @param {number} id - 知识点ID
 * @returns {Promise}
 */
export function deleteKnowledge(id) {
  return request({
    url: `/api/knowledge/${id}`,
    method: 'delete'
  });
} 