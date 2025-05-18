import request from './index';

/**
 * 获取问题详情
 * @param {number} id - 问题ID
 * @returns {Promise}
 */
export function getQuestionById(id) {
  return request({
    url: `/api/question/${id}`,
    method: 'get'
  });
}

/**
 * 获取教师的所有问题
 * @param {number} teacherId - 教师ID
 * @returns {Promise}
 */
export function getQuestionByTeacherId(teacherId) {
  return request({
    url: `/api/question/teacher/${teacherId}`,
    method: 'get'
  });
}

/**
 * 获取知识点下的所有问题
 * @param {number} knowledgeId - 知识点ID
 * @returns {Promise}
 */
export function getQuestionByKnowledgeId(knowledgeId) {
  return request({
    url: `/api/question/knowledge/${knowledgeId}`,
    method: 'get'
  });
}

/**
 * 搜索知识点下的问题
 * @param {number} knowledgeId - 知识点ID
 * @param {string} keyword - 关键词
 * @returns {Promise}
 */
export function searchQuestionInKnowledge(knowledgeId, keyword) {
  return request({
    url: `/api/question/knowledge/${knowledgeId}/search/content`,
    method: 'get',
    params: { keyword }
  });
}

/**
 * 按条件搜索知识点下的问题
 * @param {number} knowledgeId - 知识点ID
 * @param {Object} params - 搜索条件
 * @param {string} [params.questionType] - 问题类型
 * @param {string} [params.difficulty] - 难度
 * @param {string} [params.startTime] - 开始时间
 * @param {string} [params.endTime] - 结束时间
 * @returns {Promise}
 */
export function searchQuestionsInKnowledgeConditionally(knowledgeId, params) {
  return request({
    url: `/api/question/knowledge/${knowledgeId}/conditions`,
    method: 'get',
    params
  });
}

/**
 * 保存问题
 * @param {Object} data - 问题信息
 * @returns {Promise}
 */
export function saveQuestion(data) {
  return request({
    url: '/api/question/save',
    method: 'post',
    data
  });
}

/**
 * 更新问题
 * @param {Object} data - 问题更新信息
 * @returns {Promise}
 */
export function updateQuestion(data) {
  return request({
    url: '/api/question/update',
    method: 'put',
    data
  });
}

/**
 * 删除问题
 * @param {number} id - 问题ID
 * @returns {Promise}
 */
export function removeQuestion(id) {
  return request({
    url: `/api/question/${id}`,
    method: 'delete'
  });
} 