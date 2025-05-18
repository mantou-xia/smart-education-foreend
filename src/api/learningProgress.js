import request from './index';

/**
 * 获取学生的所有学习进度
 * @param {number} studentId - 学生ID
 * @returns {Promise}
 */
export function getStudentProgress(studentId) {
  return request({
    url: `/api/learning-progress/student/${studentId}`,
    method: 'get'
  });
}

/**
 * 获取学生的学习进度统计
 * @param {number} studentId - 学生ID
 * @returns {Promise}
 */
export function getProgressStatistics(studentId) {
  return request({
    url: `/api/learning-progress/student/${studentId}/statistics`,
    method: 'get'
  });
}

/**
 * 获取学生的整体学习进度
 * @param {number} studentId - 学生ID
 * @returns {Promise}
 */
export function getOverallProgress(studentId) {
  return request({
    url: `/api/learning-progress/student/${studentId}/overall-progress`,
    method: 'get'
  });
}

/**
 * 获取学生特定知识点的进度
 * @param {number} studentId - 学生ID
 * @param {number} knowledgeId - 知识点ID
 * @returns {Promise}
 */
export function getStudentKnowledgeProgress(studentId, knowledgeId) {
  return request({
    url: `/api/learning-progress/student/${studentId}/knowledge/${knowledgeId}`,
    method: 'get'
  });
}

/**
 * 通过知识点名称获取学生进度
 * @param {number} studentId - 学生ID
 * @param {string} name - 知识点名称
 * @returns {Promise}
 */
export function getStudentKnowledgeProgressByName(studentId, name) {
  return request({
    url: `/api/learning-progress/student/${studentId}/knowledge/name`,
    method: 'get',
    params: { name }
  });
}

/**
 * 获取学生在特定课程的所有进度
 * @param {number} studentId - 学生ID
 * @param {number} courseId - 课程ID
 * @returns {Promise}
 */
export function getStudentCourseProgress(studentId, courseId) {
  return request({
    url: `/api/learning-progress/student/${studentId}/course/${courseId}`,
    method: 'get'
  });
}

/**
 * 获取学生在特定课程的进度统计
 * @param {number} studentId - 学生ID
 * @param {number} courseId - 课程ID
 * @returns {Promise}
 */
export function getCourseProgress(studentId, courseId) {
  return request({
    url: `/api/learning-progress/student/${studentId}/course/${courseId}/progress`,
    method: 'get'
  });
}

/**
 * 通过课程名获取学生进度
 * @param {number} studentId - 学生ID
 * @param {string} name - 课程名称
 * @returns {Promise}
 */
export function getStudentCourseProgressByName(studentId, name) {
  return request({
    url: `/api/learning-progress/student/${studentId}/course/name`,
    method: 'get',
    params: { name }
  });
}

/**
 * 通过课程名获取进度统计
 * @param {number} studentId - 学生ID
 * @param {string} name - 课程名称
 * @returns {Promise}
 */
export function getProgressStatisticsByCourseName(studentId, name) {
  return request({
    url: `/api/learning-progress/student/${studentId}/course/statistics`,
    method: 'get',
    params: { name }
  });
}

/**
 * 通过课程名获取进度详情
 * @param {number} studentId - 学生ID
 * @param {string} name - 课程名称
 * @returns {Promise}
 */
export function getCourseProgressByName(studentId, name) {
  return request({
    url: `/api/learning-progress/student/${studentId}/course/progress`,
    method: 'get',
    params: { name }
  });
}

/**
 * 更新学习进度
 * @param {Object} data - 学习进度信息
 * @returns {Promise}
 */
export function updateLearningProgress(data) {
  return request({
    url: '/api/learning-progress/update',
    method: 'post',
    data
  });
}

/**
 * 批量更新学习进度
 * @param {Array} data - 学习进度数组
 * @returns {Promise}
 */
export function batchUpdateLearningProgress(data) {
  return request({
    url: '/api/learning-progress/batch-update',
    method: 'post',
    data
  });
}

/**
 * 更新学生特定知识点的掌握度
 * @param {number} studentId - 学生ID
 * @param {number} knowledgeId - 知识点ID
 * @param {number} score - 分数
 * @returns {Promise}
 */
export function updateMasteryLevel(studentId, knowledgeId, score) {
  return request({
    url: `/api/learning-progress/student/${studentId}/knowledge/${knowledgeId}/mastery`,
    method: 'post',
    params: { score }
  });
}

/**
 * 通过知识点名称更新掌握度
 * @param {number} studentId - 学生ID
 * @param {string} name - 知识点名称
 * @param {number} score - 分数
 * @returns {Promise}
 */
export function updateMasteryLevelByName(studentId, name, score) {
  return request({
    url: `/api/learning-progress/student/${studentId}/knowledge/mastery`,
    method: 'post',
    params: { name, score }
  });
} 