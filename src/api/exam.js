import request from './index';

/**
 * 获取考试信息
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function getExamById(examId) {
  return request({
    url: `/api/exam/${examId}`,
    method: 'get'
  });
}

/**
 * 获取教师的所有考试
 * @param {number} teacherId - 教师ID
 * @returns {Promise}
 */
export function getExamsByTeacher(teacherId) {
  return request({
    url: `/api/exam/teacher/${teacherId}`,
    method: 'get'
  });
}

/**
 * 获取课程的所有考试
 * @param {number} courseId - 课程ID
 * @returns {Promise}
 */
export function getExamsInCourse(courseId) {
  return request({
    url: `/api/exam/course/${courseId}`,
    method: 'get'
  });
}

/**
 * 获取教师在某课程下的所有考试
 * @param {number} courseId - 课程ID
 * @param {number} teacherId - 教师ID
 * @returns {Promise}
 */
export function getExamsInCourseByTeacher(courseId, teacherId) {
  return request({
    url: `/api/exam/course/${courseId}/teacher/${teacherId}`,
    method: 'get'
  });
}

/**
 * 保存考试
 * @param {Object} data - 考试信息
 * @returns {Promise}
 */
export function saveExam(data) {
  return request({
    url: '/api/exam/save',
    method: 'post',
    data
  });
}

/**
 * 更新考试
 * @param {Object} data - 考试更新信息
 * @returns {Promise}
 */
export function updateExam(data) {
  return request({
    url: '/api/exam/update',
    method: 'put',
    data
  });
}

/**
 * 删除考试
 * @param {number} id - 考试ID
 * @returns {Promise}
 */
export function deleteExam(id) {
  return request({
    url: `/api/exam/${id}`,
    method: 'delete'
  });
} 