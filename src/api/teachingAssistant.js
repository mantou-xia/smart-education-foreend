import request from './index';

/**
 * 生成教学计划
 * @param {Object} data - 教学请求信息
 * @param {string} data.subjectType - 学科类型
 * @param {string} data.courseOutline - 课程大纲
 * @param {string[]} data.courseDocuments - 课程文档
 * @param {number} data.duration - 时长
 * @param {string} data.difficultyLevel - 难度级别
 * @param {string} data.teachingStyle - 教学风格
 * @returns {Promise}
 */
export function generateTeachingPlan(data) {
  return request({
    url: '/api/teaching-assistant/lesson/generate',
    method: 'post',
    data
  });
} 