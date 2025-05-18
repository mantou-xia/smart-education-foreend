import request from './index';

/**
 * 获取学生的考试成绩列表
 * @param {number} studentId - 学生ID
 * @returns {Promise}
 */
export function getStudentExamScores(studentId) {
  return request({
    url: `/api/student-exam/student/${studentId}/scores`,
    method: 'get'
  });
}

/**
 * 搜索学生的考试成绩
 * @param {number} studentId - 学生ID
 * @param {string} keywords - 关键词
 * @returns {Promise}
 */
export function searchStudentExamScores(studentId, keywords) {
  return request({
    url: `/api/student-exam/student/${studentId}/scores/search`,
    method: 'get',
    params: { keywords }
  });
}

/**
 * 获取学生特定考试的答案列表
 * @param {number} studentId - 学生ID
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function getStudentExamAnswers(studentId, examId) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/${examId}`,
    method: 'get'
  });
}

/**
 * 获取考试详情
 * @param {number} studentId - 学生ID
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function getExamDetail(studentId, examId) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/${examId}/detail`,
    method: 'get'
  });
}

/**
 * 获取考试分数
 * @param {number} studentId - 学生ID
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function getExamScore(studentId, examId) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/${examId}/score`,
    method: 'get'
  });
}

/**
 * 分析考试结果
 * @param {number} studentId - 学生ID
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function analyzeExamResult(studentId, examId) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/${examId}/analysis`,
    method: 'get'
  });
}

/**
 * 生成学习建议
 * @param {number} studentId - 学生ID
 * @param {number} examId - 考试ID
 * @returns {Promise}
 */
export function generateLearningAdvice(studentId, examId) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/${examId}/advice`,
    method: 'get'
  });
}

/**
 * 通过考试标题获取学生答案列表
 * @param {number} studentId - 学生ID
 * @param {string} title - 考试标题
 * @returns {Promise}
 */
export function getStudentExamAnswersByTitle(studentId, title) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/title`,
    method: 'get',
    params: { title }
  });
}

/**
 * 通过考试标题获取分数
 * @param {number} studentId - 学生ID
 * @param {string} title - 考试标题
 * @returns {Promise}
 */
export function getExamScoreByTitle(studentId, title) {
  return request({
    url: `/api/student-exam/student/${studentId}/exam/title/score`,
    method: 'get',
    params: { title }
  });
}

/**
 * 提交学生答案
 * @param {Object} data - 学生答案信息
 * @returns {Promise}
 */
export function submitAnswer(data) {
  return request({
    url: '/api/student-exam/submit',
    method: 'post',
    data
  });
}

/**
 * 批量提交学生答案
 * @param {Array} data - 学生答案数组
 * @returns {Promise}
 */
export function batchSubmitAnswers(data) {
  return request({
    url: '/api/student-exam/batch-submit',
    method: 'post',
    data
  });
}

/**
 * 智能评估答案
 * @param {number} answerId - 答案ID
 * @returns {Promise}
 */
export function intelligentEvaluateAnswer(answerId) {
  return request({
    url: `/api/student-exam/answer/${answerId}/evaluate`,
    method: 'get'
  });
}

/**
 * 通过内容智能评估答案
 * @param {number} studentId - 学生ID
 * @param {string} title - 考试标题
 * @param {string} content - 答案内容
 * @returns {Promise}
 */
export function intelligentEvaluateAnswerByContent(studentId, title, content) {
  return request({
    url: `/api/student-exam/student/${studentId}/evaluate-by-content`,
    method: 'get',
    params: { title, content }
  });
}
