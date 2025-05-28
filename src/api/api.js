import axios from 'axios';
import { getToken } from '@/utils/auth';
import qs from 'qs';

// 学生端 Axios 实例
const studentAxios = axios.create({
    baseURL: 'http://118.89.136.119:8082', // 学生端端口
    timeout: 10000,
});

// 教师端 Axios 实例
const teacherAxios = axios.create({
    baseURL: 'http://118.89.136.119:8081', // 教师端端口
    timeout: 10000,
});

// 创建带有拦截器的学生端 Axios 实例
const createStudentAuthorizedAxios = () => {
    const instance = axios.create({
        baseURL: 'http://118.89.136.119:8082',
        timeout: 10000,
    });

    // 请求拦截器：添加 token
    instance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return instance;
};

// 创建带有拦截器的教师端 Axios 实例
const createTeacherAuthorizedAxios = () => {
    const instance = axios.create({
        baseURL: 'http://118.89.136.119:8081',
        timeout: 10000,
    });

    // 请求拦截器：添加 token
    instance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return instance;
};

// ref兼容辅助函数
function getValue(v) {
    return (v && typeof v === 'object' && 'value' in v) ? v.value : v;
}

// 认证相关 API
export const authAPI = {
    /**
     * 学生登录接口
     * @param {string|object} username 用户名（支持ref/普通类型）
     * @param {string|object} password 密码（支持ref/普通类型）
     * @returns {Promise<{tokens: {accessToken: string, refreshToken: string}, roles: string[]}>} 登录响应，包含token和角色
     */
    async studentLogin(username, password) {
        const response = await studentAxios.post('/api/auth/login', { username: getValue(username), password: getValue(password) });
        return response.data;
    },

    /**
     * 教师登录接口
     * @param {string|object} username 用户名（支持ref/普通类型）
     * @param {string|object} password 密码（支持ref/普通类型）
     * @returns {Promise<{tokens: {accessToken: string, refreshToken: string}, roles: string[]}>} 登录响应，包含token和角色
     */
    async teacherLogin(username, password) {
        const response = await teacherAxios.post('/api/auth/login', { username: getValue(username), password: getValue(password) });
        return response.data;
    },

    /**
     * 学生注册接口
     * @param {Object} studentData 注册信息
     * @param {string} studentData.username 用户名
     * @param {string} studentData.password 密码
     * @param {string} [studentData.email] 邮箱
     * @param {string} [studentData.fullName] 姓名
     * @param {string} [studentData.phone] 电话
     * @returns {Promise<{accessToken: string, refreshToken: string}>} 注册成功返回token
     */
    async studentRegister(studentData) {
        const response = await studentAxios.post('/api/student/register', studentData);
        return response.data;
    },

    /**
     * 教师注册（不需要token）
     * @param {Object} teacherData 教师注册信息
     * @param {string} teacherData.username 用户名
     * @param {string} teacherData.password 密码
     * @param {string} teacherData.email 邮箱
     * @param {string} teacherData.fullName 姓名
     * @param {string} teacherData.phone 电话
     * @returns {Promise<{accessToken: string, refreshToken: string}>} 注册成功返回token
     */
    async registerTeacher(teacherData) {
        const response = await teacherAxios.post('/api/teacher/register', teacherData);
        return response.data;
    },

    /**
     * 学生修改密码（需要token）
     * @param {Object} changePasswordData 修改密码信息
     * @param {string} changePasswordData.username 用户名
     * @param {string} changePasswordData.oldPassword 旧密码
     * @param {string} changePasswordData.newPassword 新密码
     * @returns {Promise<{accessToken: string, refreshToken: string}>} 修改密码后返回新token
     */
    async changeStudentPassword(changePasswordData) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.put('/api/auth/change-password', changePasswordData);
        return response.data;
    },

    /**
     * 教师修改密码（需要token）
     * @param {Object} changePasswordData 修改密码信息
     * @param {string} changePasswordData.username 用户名
     * @param {string} changePasswordData.oldPassword 旧密码
     * @param {string} changePasswordData.newPassword 新密码
     * @returns {Promise<{accessToken: string, refreshToken: string}>} 修改密码后返回新token
     */
    async changeTeacherPassword(changePasswordData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.put('/api/auth/change-password', changePasswordData);
        return response.data;
    },

    /**
       * 检查学生端用户名是否可用（无需token）
       * @param {string} username - 要检查的用户名
       * @returns {Promise<boolean>} 用户名可用返回true，不可用返回false
       */
    async checkAvailableUsername(username) {
        const response = await studentAxios.get('/api/auth/check-available-username', {
            params: { username }
        });
        return response.data;
    },

    /**
     * 检查教师端用户名是否可用（不需要token）
     * @param {string} username 要检查的用户名
     * @returns {Promise<boolean>} 用户名可用返回true，不可用返回false
     * 返回值：
     *   - true: 用户名可用
     *   - false: 用户名不可用
     */
    async checkAvailableUsernameForTeacher(username) {
        const response = await teacherAxios.get('/api/auth/check-available-username', {
            params: { username }
        });
        return response.data;
    },

    /**
     * 刷新学生端token（无需token）
     * @param {Object} refreshData 刷新参数
     * @param {string} refreshData.refreshToken 刷新token
     * @returns {Promise<Object>} 新token
     * 返回字段：
     *   - accessToken: string 新的访问token
     *   - refreshToken: string 新的刷新token
     */
    async studentRefreshToken(refreshData) {
        const response = await studentAxios.post('/api/auth/refresh', refreshData);
        return response.data;
    },

    /**
     * 刷新教师端token（无需token）
     * @param {Object} refreshData 刷新参数
     * @param {string} refreshData.refreshToken 刷新token
     * @returns {Promise<Object>} 新token
     * 返回字段：
     *   - accessToken: string 新的访问token
     *   - refreshToken: string 新的刷新token
     */
    async teacherRefreshToken(refreshData) {
        const response = await teacherAxios.post('/api/auth/refresh', refreshData);
        return response.data;
    },
};

// 学生相关 API（使用学生端端口）
export const studentAPI = {
    /**
     * 新增或更新学生信息（需要token）
     * @param {Object} studentData 学生信息
     * @param {string} studentData.username 用户名
     * @param {string} studentData.password 密码
     * @param {string} [studentData.email] 邮箱
     * @param {string} [studentData.fullName] 姓名
     * @param {string} [studentData.phone] 电话
     * @param {string} [studentData.grade] 年级
     * @param {string} [studentData.className] 班级
     * @returns {Promise<Object>} 新增或更新后的学生信息
     * 返回字段：
     *   - studentId: number 学生ID
     *   - username: string 用户名
     *   - password: string 密码
     *   - email: string 邮箱
     *   - fullName: string 姓名
     *   - phone: string 电话
     *   - grade: string 年级
     *   - className: string 班级
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async saveOrUpdateStudent(studentData) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post('/api/student/save', studentData);
        return response.data;
    },

    /**
     * 根据学生ID获取学生信息（需要token）
     * @param {string|number} studentId 学生ID（建议传字符串，防止精度丢失）
     * @returns {Promise<Object>} 学生信息
     */
    async getStudentById(studentId) {
        const axios = createStudentAuthorizedAxios();
        // 强制转字符串，防止大整数精度丢失
        const idStr = String(studentId);
        const response = await axios.get(`/api/student/${idStr}`);
        return response.data;
    },

    /**
     * 根据用户名获取学生信息（需要token）
     * @param {string} username 用户名
     * @returns {Promise<Object>} 学生信息
     * 返回字段：同 saveOrUpdateStudent 返回字段
     */
    async getStudentByUsername(username) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student/username/${username}`);
        return response.data;
    },

    /**
     * 获取当前登录学生的自身信息（需要token）
     * @returns {Promise<Object>} 学生自身信息
     * 返回字段：同 saveOrUpdateStudent 返回字段
     */
    async getSelfStudentInfo() {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/student/self');
        return response.data;
    },

    /**
     * 搜索学生（需要token）
     * @param {Object} params 查询参数
     * @param {string} [params.keywords] 关键词（可选）
     * @param {string} [params.grade] 年级（可选）
     * @param {string} [params.className] 班级（可选）
     * @returns {Promise<Array<Object>>} 学生列表
     * 每项字段：同 saveOrUpdateStudent 返回字段
     */
    async searchStudents(params) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/student/search', { params });
        return response.data;
    },

    /**
     * 根据姓名获取学生列表（需要token）
     * @param {string} fullName 姓名
     * @returns {Promise<Array<Object>>} 学生列表
     * 每项字段：同 saveOrUpdateStudent 返回字段
     */
    async getStudentsByFullName(fullName) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/student/search/name', { params: { fullName } });
        return response.data;
    },

    /**
     * 根据年级和班级获取学生列表（需要token）
     * @param {Object} params 查询参数
     * @param {string} [params.grade] 年级（可选）
     * @param {string} [params.className] 班级（可选）
     * @returns {Promise<Array<Object>>} 学生列表
     * 每项字段：同 saveOrUpdateStudent 返回字段
     */
    async getStudentsByClass(params) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/student/class', { params });
        return response.data;
    },

    /**
     * 检查邮箱是否已被注册（需要token）
     * @param {string} email 邮箱
     * @returns {Promise<Object>} 检查结果
     * 返回字段：由后端返回，通常包含邮箱是否可用等信息
     */
    async checkEmail(email) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/student/check/email', { params: { email } });
        return response.data;
    }
};

// 课程相关 API（使用学生端端口）
export const courseAPI = {
    /**
     * 新增或更新课程（需要token）
     * @param {Object} courseData 课程信息
     * @param {number} [courseData.id] 课程ID（可选，更新时填写）
     * @param {string} courseData.name 课程名称
     * @param {string} courseData.code 课程编码
     * @param {string} [courseData.description] 课程描述（可选）
     * @param {number} [courseData.credit] 学分（可选）
     * @param {string} [courseData.category] 课程类别（可选）
     * @param {string} [courseData.createTime] 创建时间（可选，ISO格式）
     * @param {string} [courseData.updateTime] 更新时间（可选，ISO格式）
     * @param {number} [courseData.status] 状态（可选）
     * @param {string} [courseData.remark] 备注（可选）
     * @returns {Promise<Object>} 新增或更新后的课程信息
     * 返回字段：
     *   - id: number 课程ID
     *   - name: string 课程名称
     *   - code: string 课程编码
     *   - description: string 课程描述
     *   - credit: number 学分
     *   - category: string 课程类别
     *   - createTime: string 创建时间（ISO格式）
     *   - updateTime: string 更新时间（ISO格式）
     *   - status: number 状态
     *   - remark: string 备注
     */
    async saveOrUpdateCourse(courseData) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post('/api/course/save', courseData);
        return response.data;
    },

    /**
     * 根据课程ID获取课程信息（需要token）
     * @param {number} courseId 课程ID
     * @returns {Promise<Object>} 课程信息
     * 返回字段：同 saveOrUpdateCourse 返回字段
     */
    async getCourseById(courseId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/course/${courseId}`);
        return response.data;
    },

    /**
     * 删除课程（需要token）
     * @param {number} courseId 课程ID
     * @returns {Promise<Object>} 删除结果
     * 返回字段：
     *   - success: boolean 是否删除成功
     *   - message: string 提示信息
     */
    async deleteCourse(courseId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.delete(`/api/course/${courseId}`);
        return response.data;
    },

    /**
     * 搜索课程（需要token）
     * @param {string} keywords 关键词
     * @param {string} [category] 课程类别（可选）
     * @returns {Promise<Array<Object>>} 课程列表
     * 每项字段：同 saveOrUpdateCourse 返回字段
     */
    async searchCourses(keywords, category) {
        const axios = createStudentAuthorizedAxios();
        const params = { keywords };
        if (category) params.category = category;
        const response = await axios.get('/api/course/search', { params });
        return response.data;
    },

    /**
     * 按名称模糊搜索课程（需要token）
     * @param {string} name 课程名称
     * @returns {Promise<Array<Object>>} 课程列表
     * 每项字段：同 saveOrUpdateCourse 返回字段
     */
    async getCoursesByNameLike(name) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/course/search/name', { params: { name } });
        return response.data;
    },

    /**
     * 根据课程名称获取课程信息（需要token）
     * @param {string} name 课程名称
     * @returns {Promise<Object>} 课程信息
     * 返回字段：同 saveOrUpdateCourse 返回字段
     */
    async getCourseByName(name) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/course/name/${name}`);
        return response.data;
    },

    /**
     * 根据课程编码获取课程信息（需要token）
     * @param {string} code 课程编码
     * @returns {Promise<Object>} 课程信息
     * 返回字段：同 saveOrUpdateCourse 返回字段
     */
    async getCourseByCode(code) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/course/code/${code}`);
        return response.data;
    },

    /**
     * 根据课程类别获取课程列表（需要token）
     * @param {string} category 课程类别
     * @returns {Promise<Array<Object>>} 课程列表
     * 每项字段：同 saveOrUpdateCourse 返回字段
     */
    async getCoursesByCategory(category) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/course/category/${category}`);
        return response.data;
    },

    /**
     * 获取所有课程（需要token）
     * @returns {Promise<Array<Object>>} 课程列表
     * 每项字段：同 saveOrUpdateCourse 返回字段
     */
    async getAllCourses() {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/course/all');
        return response.data;
    },

    /**
     * 批量删除课程（需要token）
     * @param {Array<number>} courseIdList 课程ID数组
     * @returns {Promise<Object>} 删除结果
     * 返回字段：
     *   - success: boolean 是否删除成功
     *   - message: string 提示信息
     */
    async batchDeleteCourses(courseIdList) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.delete('/api/course/batch', { data: courseIdList });
        return response.data;
    }
};

// 教师相关 API（使用教师端端口）
export const teacherAPI = {
    /**
     * 根据用户名获取教师信息（需要token）
     * @param {string} username 用户名
     * @returns {Promise<{teacherId: number, username: string, email?: string, fullName?: string, phone?: string, createdAt?: string, updatedAt?: string}>} 教师信息
     */
    async getTeacherByUsername(username) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/teacher/username/${username}`);
        return response.data;
    },

    /**
     * 获取当前登录教师的自身信息（需要token）
     * @returns {Promise<{teacherId: number, username: string, email?: string, fullName?: string, phone?: string, createdAt?: string, updatedAt?: string}>} 教师自身信息
     */
    async getSelfTeacherInfo() {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get('/api/teacher/self');
        return response.data;
    },

    /**
     * 更新教师信息（需要token）
     * @param {Object} updateTeacherData 教师信息对象
     * @param {string} updateTeacherData.username 用户名
     * @param {string} updateTeacherData.email 邮箱
     * @param {string} updateTeacherData.fullName 姓名
     * @param {string} updateTeacherData.phone 电话
     * @returns {Promise<Object>} 更新后的教师信息
     */
    async updateTeacher(updateTeacherData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.put('/api/teacher/update', updateTeacherData);
        return response.data;
    },

    /**
     * 根据教师ID获取教师信息（需要token）
     * @param {number} id 教师ID
     * @returns {Promise<{teacherId: number, username: string, email?: string, fullName?: string, phone?: string, createdAt?: string, updatedAt?: string}>} 教师信息
     */
    async getTeacherById(id) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/teacher/${id}`);
        return response.data;
    }
};
// 学习进度api模块
export const learningProgressAPI = {
    /**
     * 获取学生整体学习进度（需要token）
     * @param {number} studentId 学生ID
     * @returns {Promise<Array<Object>>} 学生学习进度列表
     */
    async getStudentProgress(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}`);
        return response.data;
    },

    /**
     * 获取学生学习进度统计（需要token）
     * @param {number} studentId 学生ID
     * @returns {Promise<Object>} 统计信息
     */
    async getProgressStatistics(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/statistics`);
        return response.data;
    },

    /**
     * 获取推荐学习资源（需要token）
     * @param {number} studentId 学生ID
     * @param {number} [limit] 返回条数（可选）
     * @returns {Promise<Array<Object>>} 资源列表
     */
    async getRecommendedResources(studentId, limit) {
        const axios = createStudentAuthorizedAxios();
        const params = {};
        if (limit) params.limit = limit;
        const response = await axios.get(`/api/learning-progress/student/${studentId}/resources`, { params });
        return response.data;
    },

    /**
     * 搜索推荐学习资源（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @param {number} [limit] 返回条数（可选）
     * @returns {Promise<Array<Object>>} 资源列表
     */
    async searchRecommendedResources(studentId, keywords, limit) {
        const axios = createStudentAuthorizedAxios();
        const params = { keywords };
        if (limit) params.limit = limit;
        const response = await axios.get(`/api/learning-progress/student/${studentId}/resources/search`, { params });
        return response.data;
    },

    /**
     * 获取学生整体进度（需要token）
     * @param {number} studentId 学生ID
     * @returns {Promise<Object>} 整体进度信息
     */
    async getOverallProgress(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/overall-progress`);
        return response.data;
    },

    /**
     * 获取学生某知识点的进度（需要token）
     * @param {number} studentId 学生ID
     * @param {number} knowledgeId 知识点ID
     * @returns {Promise<Object>} 进度信息
     */
    async getStudentKnowledgeProgress(studentId, knowledgeId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/knowledge/${knowledgeId}`);
        return response.data;
    },

    /**
     * 按知识点名称获取学生知识点进度（需要token）
     * @param {number} studentId 学生ID
     * @param {string} name 知识点名称
     * @returns {Promise<Array<Object>>} 进度列表
     */
    async getStudentKnowledgeProgressByName(studentId, name) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/knowledge/name`, { params: { name } });
        return response.data;
    },

    /**
     * 获取学生某课程的进度（需要token）
     * @param {number} studentId 学生ID
     * @param {number} courseId 课程ID
     * @returns {Promise<Array<Object>>} 进度列表
     */
    async getStudentCourseProgress(studentId, courseId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/${courseId}`);
        return response.data;
    },

    /**
     * 获取学生某课程的进度（对象形式，需token）
     * @param {number} studentId 学生ID
     * @param {number} courseId 课程ID
     * @returns {Promise<Object>} 进度信息
     */
    async getCourseProgress(studentId, courseId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/${courseId}/progress`);
        return response.data;
    },

    /**
     * 获取学生某课程的学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {number} courseId 课程ID
     * @returns {Promise<Object>} 学习计划
     */
    async generateLearningPlan(studentId, courseId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/${courseId}/plan`);
        return response.data;
    },

    /**
     * 获取学生某课程的进度统计（需要token）
     * @param {number} studentId 学生ID
     * @param {number} courseId 课程ID
     * @returns {Promise<Object>} 统计信息
     */
    async getProgressStatisticsByCourse(studentId, courseId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/${courseId}/statistics`);
        return response.data;
    },

    /**
     * 按课程名称获取学生课程进度（需要token）
     * @param {number} studentId 学生ID
     * @param {string} name 课程名称
     * @returns {Promise<Array<Object>>} 进度列表
     */
    async getStudentCourseProgressByName(studentId, name) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/name`, { params: { name } });
        return response.data;
    },

    /**
     * 按课程名称获取学生课程进度（对象形式，需token）
     * @param {number} studentId 学生ID
     * @param {string} name 课程名称
     * @returns {Promise<Object>} 进度信息
     */
    async getCourseProgressByName(studentId, name) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/progress`, { params: { name } });
        return response.data;
    },

    /**
     * 按课程名称获取学生学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {string} name 课程名称
     * @param {number} days 天数
     * @returns {Promise<Object>} 学习计划
     */
    async generateLearningPlanByCourseName(studentId, name, days) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}/course/plan`, { params: { name, days } });
        return response.data;
    },

    /**
     * 更新学习进度（需要token）
     * @param {Object} progressData 学习进度信息
     * @param {number} [progressData.progressId] 进度ID（可选，更新时填写）
     * @param {number} progressData.studentId 学生ID
     * @param {number} progressData.courseId 课程ID
     * @param {number} progressData.knowledgeId 知识点ID
     * @param {number} progressData.masteryLevel 掌握程度
     * @param {string} [progressData.learningStatus] 学习状态（可选）
     * @param {string} [progressData.lastReviewedAt] 最近复习时间（可选，ISO格式）
     * @param {number} [progressData.reviewCount] 复习次数（可选）
     * @param {string} [progressData.createdAt] 创建时间（可选，ISO格式）
     * @param {string} [progressData.updatedAt] 更新时间（可选，ISO格式）
     * @param {string} [progressData.courseName] 课程名称（可选）
     * @param {string} [progressData.knowledgeName] 知识点名称（可选）
     * @param {boolean} [progressData.mastered] 是否已掌握（可选）
     * @returns {Promise<Object>} 更新后的学习进度
     * 返回字段：
     *   - progressId: number 进度ID
     *   - studentId: number 学生ID
     *   - courseId: number 课程ID
     *   - knowledgeId: number 知识点ID
     *   - masteryLevel: number 掌握程度
     *   - learningStatus: string 学习状态
     *   - lastReviewedAt: string 最近复习时间（ISO格式）
     *   - reviewCount: number 复习次数
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     *   - courseName: string 课程名称
     *   - knowledgeName: string 知识点名称
     *   - mastered: boolean 是否已掌握
     */
    async updateLearningProgress(progressData) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post('/api/learning-progress/update', progressData);
        return response.data;
    },

    /**
     * 更新某学生某知识点的掌握程度（需要token）
     * @param {number} studentId 学生ID
     * @param {number} knowledgeId 知识点ID
     * @param {number} score 掌握分数
     * @returns {Promise<Object>} 更新后的进度信息
     */
    async updateMasteryLevel(studentId, knowledgeId, score) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(`/api/learning-progress/student/${studentId}/knowledge/${knowledgeId}/mastery`, null, { params: { score } });
        return response.data;
    },

    /**
     * 按知识点名称更新掌握程度（需要token）
     * @param {number} studentId 学生ID
     * @param {string} name 知识点名称
     * @param {number} score 掌握分数
     * @returns {Promise<Object>} 更新后的进度信息
     */
    async updateMasteryLevelByName(studentId, name, score) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(`/api/learning-progress/student/${studentId}/knowledge/mastery`, null, { params: { name, score } });
        return response.data;
    },

    /**
     * 批量更新学习进度（需要token）
     * @param {Array<Object>} progressList 学习进度数组，每项结构如下：
     *   - progressId: number 进度ID（可选）
     *   - studentId: number 学生ID
     *   - courseId: number 课程ID
     *   - knowledgeId: number 知识点ID
     *   - masteryLevel: number 掌握程度
     *   - learningStatus: string 学习状态（可选）
     *   - lastReviewedAt: string 最近复习时间（可选，ISO格式）
     *   - reviewCount: number 复习次数（可选）
     *   - createdAt: string 创建时间（可选，ISO格式）
     *   - updatedAt: string 更新时间（可选，ISO格式）
     *   - courseName: string 课程名称（可选）
     *   - knowledgeName: string 知识点名称（可选）
     *   - mastered: boolean 是否已掌握（可选）
     * @returns {Promise<Object>} 批量更新结果
     */
    async batchUpdateLearningProgress(progressList) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(
            '/api/learning-progress/batch-update',
            progressList,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    },
};

// 知识点api模块（教师端）
export const knowledgeAPI = {
    /**
     * 更新知识点（需要token）
     * @param {Object} updateKnowledgeData 知识点信息
     * @param {number} updateKnowledgeData.knowledgeId 知识点ID
     * @param {string} updateKnowledgeData.name 知识点名称
     * @param {string} updateKnowledgeData.description 知识点描述
     * @param {string} updateKnowledgeData.difficultyLevel 难度等级
     * @param {string} updateKnowledgeData.teachPlan 教学计划
     * @returns {Promise<Object>} 更新后的知识点信息
     * 返回字段：
     *   - knowledgeId: number 知识点ID
     *   - name: string 知识点名称
     *   - description: string 知识点描述
     *   - difficultyLevel: string 难度等级
     *   - teacherId: number 教师ID
     *   - courseId: number 课程ID
     *   - teachPlan: string 教学计划
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async updateKnowledge(updateKnowledgeData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.put('/api/knowledge/update', updateKnowledgeData);
        return response.data;
    },

    /**
     * 新增知识点（需要token）
     * @param {Object} knowledgeData 知识点信息
     * @param {string} knowledgeData.name 知识点名称
     * @param {string} knowledgeData.description 知识点描述
     * @param {string} knowledgeData.difficultyLevel 难度等级
     * @param {number} knowledgeData.teacherId 教师ID
     * @param {number} knowledgeData.courseId 课程ID
     * @param {string} knowledgeData.teachPlan 教学计划
     * @returns {Promise<Object>} 新增后的知识点信息
     * 返回字段：
     *   - knowledgeId: number 知识点ID
     *   - name: string 知识点名称
     *   - description: string 知识点描述
     *   - difficultyLevel: string 难度等级
     *   - teacherId: number 教师ID
     *   - courseId: number 课程ID
     *   - teachPlan: string 教学计划
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async saveKnowledge(knowledgeData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.post('/api/knowledge/save', knowledgeData);
        return response.data;
    },

    /**
     * 根据知识点ID获取知识点信息（需要token）
     * @param {number} id 知识点ID
     * @returns {Promise<Object>} 知识点信息
     * 返回字段：
     *   - knowledgeId: number 知识点ID
     *   - name: string 知识点名称
     *   - description: string 知识点描述
     *   - difficultyLevel: string 难度等级
     *   - teacherId: number 教师ID
     *   - courseId: number 课程ID
     *   - teachPlan: string 教学计划
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getKnowledgeById(id) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/knowledge/${id}`);
        return response.data;
    },

    /**
     * 删除知识点（需要token）
     * @param {number} id 知识点ID
     * @returns {Promise<Object>} 删除结果
     * 返回字段：
     *   - success: boolean 是否删除成功
     *   - message: string 提示信息
     */
    async deleteKnowledgeById(id) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.delete(`/api/knowledge/${id}`);
        return response.data;
    },

    /**
     * 根据教师ID获取知识点列表（需要token）
     * @param {number} teacherId 教师ID
     * @returns {Promise<Array<Object>>} 知识点列表
     * 每项字段：
     *   - knowledgeId: number 知识点ID
     *   - name: string 知识点名称
     *   - description: string 知识点描述
     *   - difficultyLevel: string 难度等级
     *   - teacherId: number 教师ID
     *   - courseId: number 课程ID
     *   - teachPlan: string 教学计划
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getKnowledgeByTeacherId(teacherId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/knowledge/teacher/${teacherId}`);
        return response.data;
    },

    /**
     * 根据课程ID获取知识点列表（需要token）
     * @param {number} courseId 课程ID
     * @returns {Promise<Array<Object>>} 知识点列表
     * 每项字段：
     *   - knowledgeId: number 知识点ID
     *   - name: string 知识点名称
     *   - description: string 知识点描述
     *   - difficultyLevel: string 难度等级
     *   - teacherId: number 教师ID
     *   - courseId: number 课程ID
     *   - teachPlan: string 教学计划
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getKnowledgeByCourseId(courseId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/knowledge/course/${courseId}`);
        return response.data;
    },

    /**
     * 根据课程ID和教师ID获取知识点列表（需要token）
     * @param {number} courseId 课程ID
     * @param {number} teacherId 教师ID
     * @returns {Promise<Array<Object>>} 知识点列表
     * 每项字段：
     *   - knowledgeId: number 知识点ID
     *   - name: string 知识点名称
     *   - description: string 知识点描述
     *   - difficultyLevel: string 难度等级
     *   - teacherId: number 教师ID
     *   - courseId: number 课程ID
     *   - teachPlan: string 教学计划
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getKnowledgeByTeacherInCourse(courseId, teacherId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/knowledge/course/${courseId}/teacher/${teacherId}`);
        return response.data;
    }
};

export const teachingAssistantAPI = {
    /**
     * 生成智能备课方案（需要token）
     * @param {Object} lessonData 备课参数
     * @param {string} lessonData.subjectType 学科类型
     * @param {string} lessonData.courseOutline 课程大纲
     * @param {Array<string>} lessonData.courseDocuments 课程相关文档（字符串数组）
     * @param {number} lessonData.duration 课程时长（分钟）
     * @param {string} lessonData.difficultyLevel 难度等级
     * @param {string} lessonData.teachingStyle 教学风格
     * @returns {Promise<Object>} 智能备课生成结果
     * 返回字段：
     *   - additionalProp1: Object 备课相关内容（具体结构由后端返回）
     *   - additionalProp2: Object 备课相关内容（具体结构由后端返回）
     *   - additionalProp3: Object 备课相关内容（具体结构由后端返回）
     */
    async generateLesson(lessonData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.post('/api/teaching-assistant/lesson/generate', lessonData);
        return response.data;
    }
};

export const questionAPI = {
    /**
     * 更新问题（需要token）
     * @param {Object} updateQuestionData 问题信息
     * @param {number} updateQuestionData.questionId 问题ID
     * @param {string} updateQuestionData.content 问题内容
     * @param {string} updateQuestionData.questionType 问题类型
     * @param {string} updateQuestionData.difficulty 难度
     * @param {string} updateQuestionData.referenceAnswer 参考答案
     * @param {number} updateQuestionData.scorePoints 分值
     * @param {string} updateQuestionData.answer 答案
     * @returns {Promise<Object>} 更新后的问题信息
     * 返回字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async updateQuestion(updateQuestionData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.put('/api/question/update', updateQuestionData);
        return response.data;
    },

    /**
     * 新增问题（需要token）
     * @param {Object} questionData 问题信息
     * @param {number} questionData.teacherId 教师ID
     * @param {string} questionData.content 问题内容
     * @param {string} questionData.questionType 问题类型
     * @param {string} questionData.difficulty 难度
     * @param {number} questionData.knowledgeId 知识点ID
     * @param {string} questionData.referenceAnswer 参考答案
     * @param {number} questionData.scorePoints 分值
     * @param {string} questionData.answer 答案
     * @returns {Promise<Object>} 新增后的问题信息
     * 返回字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async saveQuestion(questionData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.post('/api/question/save', questionData);
        return response.data;
    },

    /**
     * 根据问题ID获取问题信息（需要token）
     * @param {number} id 问题ID
     * @returns {Promise<Object>} 问题信息
     * 返回字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getQuestionById(id) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/question/${id}`);
        return response.data;
    },

    /**
     * 删除问题（需要token）
     * @param {number} id 问题ID
     * @returns {Promise<Object>} 删除结果
     * 返回字段：
     *   - success: boolean 是否删除成功
     *   - message: string 提示信息
     */
    async deleteQuestionById(id) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.delete(`/api/question/${id}`);
        return response.data;
    },

    /**
     * 根据教师ID获取问题列表（需要token）
     * @param {number} teacherId 教师ID
     * @returns {Promise<Array<Object>>} 问题列表
     * 每项字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getQuestionsByTeacherId(teacherId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/question/teacher/${teacherId}`);
        return response.data;
    },

    /**
     * 根据知识点ID获取问题列表（需要token）
     * @param {number} knowledgeId 知识点ID
     * @returns {Promise<Array<Object>>} 问题列表
     * 每项字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getQuestionsByKnowledgeId(knowledgeId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/question/knowledge/${knowledgeId}`);
        return response.data;
    },

    /**
     * 根据知识点ID和内容关键词搜索问题（需要token）
     * @param {number} knowledgeId 知识点ID
     * @param {string} keyword 关键词
     * @returns {Promise<Array<Object>>} 问题列表
     * 每项字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async searchQuestionsInKnowledge(knowledgeId, keyword) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/question/knowledge/${knowledgeId}/search/content`, {
            params: { keyword }
        });
        return response.data;
    },

    /**
     * 根据知识点ID和条件查询问题（需要token）
     * @param {number} knowledgeId 知识点ID
     * @param {Object} questionQueryDTO 查询条件对象
     * @param {string} [questionQueryDTO.questionType] 问题类型
     * @param {string} [questionQueryDTO.difficulty] 难度
     * @param {string} [questionQueryDTO.startTime] 起始时间（可选，日期字符串）
     * @param {string} [questionQueryDTO.endTime] 结束时间（可选，日期字符串）
     * @returns {Promise<Array<Object>>} 问题列表
     * 每项字段：
     *   - questionId: number 问题ID
     *   - teacherId: number 教师ID
     *   - content: string 问题内容
     *   - questionType: string 问题类型
     *   - difficulty: string 难度
     *   - knowledgeId: number 知识点ID
     *   - referenceAnswer: string 参考答案
     *   - scorePoints: number 分值
     *   - answer: string 答案
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async searchQuestionsInKnowledgeConditionally(knowledgeId, questionQueryDTO) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/question/knowledge/${knowledgeId}/conditions`, {
            params: questionQueryDTO
        });
        return response.data;
    }
};

export const examAPI = {
    /**
     * 更新考试（需要token）
     * @param {Object} updateExamData 考试信息
     * @param {number} updateExamData.examId 考试ID
     * @param {string} updateExamData.title 考试标题
     * @param {string} updateExamData.description 描述
     * @param {number} updateExamData.courseId 课程ID
     * @param {number} updateExamData.teacherId 教师ID
     * @param {number} updateExamData.totalScore 总分
     * @param {number} updateExamData.durationMinutes 时长（分钟）
     * @param {string} updateExamData.startTime 开始时间（ISO格式）
     * @param {string} updateExamData.endTime 结束时间（ISO格式）
     * @param {string} updateExamData.status 状态
     * @returns {Promise<Object>} 更新后的考试信息
     * 返回字段：
     *   - examId: number 考试ID
     *   - title: string 考试标题
     *   - description: string 描述
     *   - courseId: number 课程ID
     *   - teacherId: number 教师ID
     *   - totalScore: number 总分
     *   - durationMinutes: number 时长（分钟）
     *   - startTime: string 开始时间（ISO格式）
     *   - endTime: string 结束时间（ISO格式）
     *   - status: string 状态
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async updateExam(updateExamData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.put('/api/exam/update', updateExamData);
        return response.data;
    },

    /**
     * 新增考试（需要token）
     * @param {Object} examData 考试信息
     * @param {string} examData.title 考试标题
     * @param {string} examData.description 描述
     * @param {number} examData.courseId 课程ID
     * @param {number} examData.teacherId 教师ID
     * @param {number} examData.totalScore 总分
     * @param {number} examData.durationMinutes 时长（分钟）
     * @param {string} examData.startTime 开始时间（ISO格式）
     * @param {string} examData.endTime 结束时间（ISO格式）
     * @param {string} examData.status 状态
     * @returns {Promise<Object>} 新增后的考试信息
     * 返回字段：
     *   - examId: number 考试ID
     *   - title: string 考试标题
     *   - description: string 描述
     *   - courseId: number 课程ID
     *   - teacherId: number 教师ID
     *   - totalScore: number 总分
     *   - durationMinutes: number 时长（分钟）
     *   - startTime: string 开始时间（ISO格式）
     *   - endTime: string 结束时间（ISO格式）
     *   - status: string 状态
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async saveExam(examData) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.post('/api/exam/save', examData);
        return response.data;
    },

    /**
     * 根据考试ID获取考试信息（需要token）
     * @param {number} examId 考试ID
     * @returns {Promise<Object>} 考试信息
     * 返回字段：
     *   - examId: number 考试ID
     *   - title: string 考试标题
     *   - description: string 描述
     *   - courseId: number 课程ID
     *   - teacherId: number 教师ID
     *   - totalScore: number 总分
     *   - durationMinutes: number 时长（分钟）
     *   - startTime: string 开始时间（ISO格式）
     *   - endTime: string 结束时间（ISO格式）
     *   - status: string 状态
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getExamById(examId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/exam/${examId}`);
        return response.data;
    },

    /**
     * 根据教师ID获取考试列表（需要token）
     * @param {number} teacherId 教师ID
     * @returns {Promise<Array<Object>>} 考试列表
     * 每项字段：
     *   - examId: number 考试ID
     *   - title: string 考试标题
     *   - description: string 描述
     *   - courseId: number 课程ID
     *   - teacherId: number 教师ID
     *   - totalScore: number 总分
     *   - durationMinutes: number 时长（分钟）
     *   - startTime: string 开始时间（ISO格式）
     *   - endTime: string 结束时间（ISO格式）
     *   - status: string 状态
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getExamsByTeacher(teacherId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/exam/teacher/${teacherId}`);
        return response.data;
    },

    /**
     * 根据课程ID获取考试列表（需要token）
     * @param {number} courseId 课程ID
     * @returns {Promise<Array<Object>>} 考试列表
     * 每项字段：
     *   - examId: number 考试ID
     *   - title: string 考试标题
     *   - description: string 描述
     *   - courseId: number 课程ID
     *   - teacherId: number 教师ID
     *   - totalScore: number 总分
     *   - durationMinutes: number 时长（分钟）
     *   - startTime: string 开始时间（ISO格式）
     *   - endTime: string 结束时间（ISO格式）
     *   - status: string 状态
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getExamsInCourse(courseId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/exam/course/${courseId}`);
        return response.data;
    },

    /**
     * 根据课程ID和教师ID获取考试列表（需要token）
     * @param {number} courseId 课程ID
     * @param {number} teacherId 教师ID
     * @returns {Promise<Array<Object>>} 考试列表
     * 每项字段：
     *   - examId: number 考试ID
     *   - title: string 考试标题
     *   - description: string 描述
     *   - courseId: number 课程ID
     *   - teacherId: number 教师ID
     *   - totalScore: number 总分
     *   - durationMinutes: number 时长（分钟）
     *   - startTime: string 开始时间（ISO格式）
     *   - endTime: string 结束时间（ISO格式）
     *   - status: string 状态
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     */
    async getExamsInCourseByTeacher(courseId, teacherId) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.get(`/api/exam/course/${courseId}/teacher/${teacherId}`);
        return response.data;
    },

    /**
     * 删除考试（需要token）
     * @param {number} id 考试ID
     * @returns {Promise<Object>} 删除结果
     * 返回字段：
     *   - success: boolean 是否删除成功
     *   - message: string 提示信息
     */
    async deleteExamById(id) {
        const axios = createTeacherAuthorizedAxios();
        const response = await axios.delete(`/api/exam/${id}`);
        return response.data;
    }
};

export const learningPlanAPI = {
    /**
     * 更新学习计划进度（需要token）
     * @param {Object} params 查询参数
     * @param {string} params.planId 学习计划ID
     * @param {string} params.activityId 活动ID
     * @param {string} params.status 状态
     * @param {string} [params.feedback] 反馈（可选）
     * @returns {Promise<Object>} 更新结果
     * 返回字段：由后端返回，通常包含进度相关信息
     */
    async updatePlanProgress(params) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.put('/api/learning-plan/update-progress', null, { params });
        return response.data;
    },

    /**
     * 获取学习计划推荐资源（需要token）
     * @param {string} planId 学习计划ID
     * @returns {Promise<Array<Object>>} 推荐资源列表
     * 每项字段：由后端返回，通常包含资源相关信息
     */
    async getPlanRecommendedResources(planId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/${planId}/resources`);
        return response.data;
    },

    /**
     * 搜索学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @returns {Promise<Array<Object>>} 学习计划列表
     * 每项字段：由后端返回，通常包含计划相关信息
     */
    async searchLearningPlans(studentId, keywords) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/search`, { params: { keywords } });
        return response.data;
    },

    /**
     * 搜索学习计划推荐资源（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @returns {Promise<Array<Object>>} 推荐资源列表
     * 每项字段：由后端返回，通常包含资源相关信息
     */
    async searchPlanResources(studentId, keywords) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/resources/search`, { params: { keywords } });
        return response.data;
    },

    /**
     * 根据计划名称获取推荐资源（需要token）
     * @param {number} studentId 学生ID
     * @param {string} planName 计划名称
     * @returns {Promise<Array<Object>>} 推荐资源列表
     * 每项字段：由后端返回，通常包含资源相关信息
     */
    async getPlanResourcesByName(studentId, planName) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/resources/by-name`, { params: { planName } });
        return response.data;
    },

    /**
     * 获取学习计划历史（需要token）
     * @param {number} studentId 学生ID
     * @returns {Promise<Array<Object>>} 历史计划列表
     * 每项字段：由后端返回，通常包含计划相关信息
     */
    async getLearningPlanHistory(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/history`);
        return response.data;
    },

    /**
     * 生成学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {string} targetGoal 目标
     * @param {number} timeFrame 时间范围（天）
     * @param {Array<number>} [courseIds] 课程ID数组（可选）
     * @param {Array<number>} [knowledgeIds] 知识点ID数组（可选）
     * @returns {Promise<Object>} 生成的学习计划
     * 字段：由后端返回，通常包含计划相关信息
     */
    async generateLearningPlan(studentId, targetGoal, timeFrame, courseIds, knowledgeIds) {
        const axios = createStudentAuthorizedAxios();
        const params = { targetGoal, timeFrame };
        if (courseIds) params.courseIds = courseIds;
        if (knowledgeIds) params.knowledgeIds = knowledgeIds;
        const response = await axios.get(
            `/api/learning-plan/student/${studentId}/generate`,
            {
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            }
        );
        return response.data;
    },

    /**
     * 通过知识点名称生成学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {string} targetGoal 目标
     * @param {number} timeFrame 时间范围（天）
     * @param {Array<string>} knowledgeNames 知识点名称数组
     * @returns {Promise<Object>} 生成的学习计划
     * 字段：由后端返回，通常包含计划相关信息
     */
    async generateLearningPlanByKnowledgeName(studentId, targetGoal, timeFrame, knowledgeNames) {
        const axios = createStudentAuthorizedAxios();
        const params = { targetGoal, timeFrame, knowledgeNames };
        const response = await axios.get(
            `/api/learning-plan/student/${studentId}/generate/knowledge-names`,
            {
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            }
        );
        return response.data;
    },

    /**
     * 通过课程名称生成学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {string} targetGoal 目标
     * @param {number} timeFrame 时间范围（天）
     * @param {Array<string>} courseNames 课程名称数组
     * @returns {Promise<Object>} 生成的学习计划
     * 字段：由后端返回，通常包含计划相关信息
     */
    async generateLearningPlanByCourseName(studentId, targetGoal, timeFrame, courseNames) {
        const axios = createStudentAuthorizedAxios();
        const params = { targetGoal, timeFrame, courseNames };
        const response = await axios.get(
            `/api/learning-plan/student/${studentId}/generate/course-names`,
            {
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            }
        );
        return response.data;
    },

    /**
     * 获取每日学习计划活动（需要token）
     * @param {number} studentId 学生ID
     * @param {string} date 日期（YYYY-MM-DD）
     * @returns {Promise<Array<Object>>} 每日活动列表
     * 每项字段：由后端返回，通常包含活动相关信息
     */
    async getDailyPlanActivities(studentId, date) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/daily`, { params: { date } });
        return response.data;
    },

    /**
     * 通过计划名称获取每日学习计划（需要token）
     * @param {number} studentId 学生ID
     * @param {string} planName 计划名称
     * @param {string} date 日期（YYYY-MM-DD）
     * @returns {Promise<Array<Object>>} 每日活动列表
     * 每项字段：由后端返回，通常包含活动相关信息
     */
    async getDailyPlanByName(studentId, planName, date) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/daily/by-name`, { params: { planName, date } });
        return response.data;
    },

    /**
     * 获取当前学习计划（需要token）
     * @param {number} studentId 学生ID
     * @returns {Promise<Object>} 当前学习计划
     * 字段：由后端返回，通常包含计划相关信息
     */
    async getCurrentLearningPlan(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-plan/student/${studentId}/current`);
        return response.data;
    }
};

export const attendanceAPI = {
    /**
     * 更新考勤状态（需要token）
     * @param {number|string|object} attendanceId 考勤ID（支持ref/普通类型）
     * @param {string|object} status 状态（支持ref/普通类型）
     * @param {string|object} [remark] 备注（支持ref/普通类型）
     * @returns {Promise<Object>} 更新结果
     */
    async updateAttendanceStatus(attendanceId, status, remark) {
        const axios = createStudentAuthorizedAxios();
        const id = getValue(attendanceId);
        const stat = getValue(status);
        const rem = getValue(remark);
        const params = { status: stat };
        if (rem !== undefined && rem !== null && rem !== '') params.remark = rem;
        const response = await axios.put(`/api/attendance/${id}/status`, null, { params });
        return response.data;
    },

    /**
     * 按课程名称更新考勤（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {string|object} courseName 课程名称（支持ref/普通类型）
     * @param {string|object} date 日期（YYYY-MM-DD，支持ref/普通类型）
     * @param {string|object} status 状态（支持ref/普通类型）
     * @param {string|object} [remark] 备注（支持ref/普通类型，可选）
     * @returns {Promise<Object>} 更新结果
     * 返回字段：由后端返回，通常包含考勤相关信息
     */
    async updateAttendanceByCourseName(studentId, courseName, date, status, remark) {
        const axios = createStudentAuthorizedAxios();
        const params = {
            courseName: getValue(courseName),
            date: getValue(date),
            status: getValue(status)
        };
        const rem = getValue(remark);
        if (rem !== undefined && rem !== null && rem !== '') params.remark = rem;
        const response = await axios.put(`/api/attendance/student/${getValue(studentId)}/course/update`, null, { params });
        return response.data;
    },

    /**
     * 新增考勤（需要token）
     * @param {Object} attendanceData 考勤信息
     * @returns {Promise<Object>} 新增后的考勤信息
     */
    async saveAttendance(attendanceData) {
        const axios = createStudentAuthorizedAxios();
        const data = getValue(attendanceData);
        const response = await axios.post('/api/attendance/save', data);
        return response.data;
    },

    /**
     * 批量新增考勤（需要token）
     * @param {Array<Object>|object} attendanceList 考勤信息数组（支持ref/普通类型）
     * @returns {Promise<Object>} 批量新增结果
     */
    async batchSaveAttendance(attendanceList) {
        const axios = createStudentAuthorizedAxios();
        // 自动去除响应式
        const pureList = JSON.parse(JSON.stringify(getValue(attendanceList)));
        const response = await axios.post('/api/attendance/batch-save', pureList);
        return response.data;
    },

    /**
     * 获取学生考勤记录（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @returns {Promise<Array<Object>>} 考勤记录列表
     */
    async getStudentAttendance(studentId) {
        const axios = createStudentAuthorizedAxios();
        const id = getValue(studentId);
        const response = await axios.get(`/api/attendance/student/${id}`);
        return response.data;
    },

    /**
     * 根据状态获取学生考勤记录（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {string|object} status 状态（支持ref/普通类型）
     * @returns {Promise<Array<Object>>} 考勤记录列表
     */
    async getStudentAttendanceByStatus(studentId, status) {
        const axios = createStudentAuthorizedAxios();
        const id = getValue(studentId);
        const stat = getValue(status);
        const response = await axios.get(`/api/attendance/student/${id}/status/${stat}`);
        return response.data;
    },

    /**
     * 获取学生考勤统计（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @returns {Promise<Object>} 统计信息
     */
    async getAttendanceStatistics(studentId) {
        const axios = createStudentAuthorizedAxios();
        const id = getValue(studentId);
        const response = await axios.get(`/api/attendance/student/${id}/statistics`);
        return response.data;
    },

    /**
     * 搜索考勤记录（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {Object|object} params 查询参数（支持ref/普通类型）
     * @returns {Promise<Array<Object>>} 考勤记录列表
     */
    async searchAttendance(studentId, params) {
        const axios = createStudentAuthorizedAxios();
        const id = getValue(studentId);
        const p = getValue(params);
        const response = await axios.get(`/api/attendance/student/${id}/search`, { params: p });
        return response.data;
    },

    /**
     * 按日期范围获取学生考勤记录（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {string|object} startDate 起始日期（支持ref/普通类型）
     * @param {string|object} endDate 结束日期（支持ref/普通类型）
     * @returns {Promise<Array<Object>>} 考勤记录列表
     */
    async getStudentAttendanceByDateRange(studentId, startDate, endDate) {
        const axios = createStudentAuthorizedAxios();
        const id = getValue(studentId);
        const start = getValue(startDate);
        const end = getValue(endDate);
        const response = await axios.get(`/api/attendance/student/${id}/date-range`, { params: { startDate: start, endDate: end } });
        return response.data;
    },

    /**
     * 获取学生某课程的考勤记录（需要token）
     * @param {number} studentId 学生ID
     * @param {number} courseId 课程ID
     * @returns {Promise<Array<Object>>} 考勤记录列表
     * 每项字段：同 saveAttendance 返回字段
     */
    async getStudentCourseAttendance(studentId, courseId) {
        const axios = createStudentAuthorizedAxios();
        const sid = getValue(studentId);
        const cid = getValue(courseId);
        const response = await axios.get(`/api/attendance/student/${sid}/course/${cid}`);
        return response.data;
    },

    /**
     * 获取学生某课程的考勤统计（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {number|object} courseId 课程ID（支持ref/普通类型）
     * @returns {Promise<Object>} 统计信息
     * 字段：由后端返回，通常包含统计相关信息
     */
    async getCourseAttendanceStatistics(studentId, courseId) {
        const axios = createStudentAuthorizedAxios();
        const sid = getValue(studentId);
        const cid = getValue(courseId);
        const response = await axios.get(`/api/attendance/student/${sid}/course/${cid}/statistics`);
        return response.data;
    },

    /**
     * 按课程名称获取考勤统计（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {string|object} courseName 课程名称（支持ref/普通类型）
     * @returns {Promise<Object>} 统计信息
     * 字段：由后端返回，通常包含统计相关信息
     */
    async getAttendanceStatisticsByCourseName(studentId, courseName) {
        const axios = createStudentAuthorizedAxios();
        const sid = getValue(studentId);
        const cname = getValue(courseName);
        const response = await axios.get(`/api/attendance/student/${sid}/course/statistics`, { params: { courseName: cname } });
        return response.data;
    },

    /**
     * 按课程名称获取考勤记录（需要token）
     * @param {number|object} studentId 学生ID（支持ref/普通类型）
     * @param {string|object} courseName 课程名称（支持ref/普通类型）
     * @returns {Promise<Array<Object>>} 考勤记录列表
     * 返回字段：
     *   - attendanceId: number 考勤ID
     *   - courseId: number 课程ID
     *   - studentId: number 学生ID
     *   - status: string 状态
     *   - attendanceDate: string 考勤日期
     *   - remark: string 备注
     *   - recordedBy: number 记录人ID
     *   - createdAt: string 创建时间（ISO格式）
     *   - updatedAt: string 更新时间（ISO格式）
     *   - courseName: string 课程名称
     *   - studentName: string 学生姓名
     *   - recorderName: string 记录人姓名
     *   - absent: boolean 是否缺勤
     *   - late: boolean 是否迟到
     *   - present: boolean 是否出勤
     */
    async getStudentAttendanceByCourseName(studentId, courseName) {
        const axios = createStudentAuthorizedAxios();
        const sid = getValue(studentId);
        const cname = getValue(courseName);
        const response = await axios.get(`/api/attendance/student/${sid}/course/name`, { params: { courseName: cname } });
        return response.data;
    }
};

// 学生考试相关 API（使用学生端端口）
export const studentExamAPI = {
    /**
     * 提交单份考试答卷（需要token）
     * @param {Object} answerData 答卷信息
     * @param {number} answerData.answerId 答案ID（可选，提交新答卷时可不填）
     * @param {number} answerData.examId 考试ID
     * @param {number} answerData.questionId 题目ID
     * @param {number} answerData.studentId 学生ID
     * @param {string} answerData.studentAnswer 学生作答内容
     * @param {number} [answerData.score] 得分（可选，主观题可由教师批改后填写）
     * @param {string} [answerData.feedback] 反馈（可选）
     * @param {number} [answerData.gradedBy] 批改教师ID（可选）
     * @param {string} [answerData.gradedAt] 批改时间（可选，ISO格式）
     * @param {string} [answerData.createdAt] 创建时间（可选，ISO格式）
     * @param {string} [answerData.updatedAt] 更新时间（可选，ISO格式）
     * @param {string} [answerData.examTitle] 考试标题（可选）
     * @param {string} [answerData.questionContent] 题目内容（可选）
     * @param {string} [answerData.questionType] 题目类型（可选）
     * @param {string} [answerData.referenceAnswer] 参考答案（可选）
     * @param {string} [answerData.teacherName] 批改教师姓名（可选）
     * @param {boolean} [answerData.graded] 是否已批改（可选）
     * @returns {Promise<Object>} 提交结果，由后端返回
     */
    async submitAnswer(answerData) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post('/api/student-exam/submit', answerData);
        return response.data;
    },

    /**
     * 批量提交考试答卷（需要token）
     * @param {Array<Object>} answerList 答卷信息数组，每项结构如下：
     *   - answerId: number 答案ID（可选）
     *   - examId: number 考试ID
     *   - questionId: number 题目ID
     *   - studentId: number 学生ID
     *   - studentAnswer: string 学生作答内容
     *   - score: number 得分（可选）
     *   - feedback: string 反馈（可选）
     *   - gradedBy: number 批改教师ID（可选）
     *   - gradedAt: string 批改时间（可选，ISO格式）
     *   - createdAt: string 创建时间（可选，ISO格式）
     *   - updatedAt: string 更新时间（可选，ISO格式）
     *   - examTitle: string 考试标题（可选）
     *   - questionContent: string 题目内容（可选）
     *   - questionType: string 题目类型（可选）
     *   - referenceAnswer: string 参考答案（可选）
     *   - teacherName: string 批改教师姓名（可选）
     *   - graded: boolean 是否已批改（可选）
     * @returns {Promise<Object>} 批量提交结果，由后端返回
     */
    async batchSubmitAnswers(answerList) {
        const axios = createStudentAuthorizedAxios();
        const data = JSON.parse(JSON.stringify(getValue(answerList)));
        const response = await axios.post(
            '/api/student-exam/batch-submit',
            data,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    },

    /**
     * 搜索考试及试题（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @returns {Promise<Object>} 搜索结果，由后端返回
     */
    async searchExamsAndQuestions(studentId, keywords) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/search-exams`, { params: { keywords } });
        return response.data;
    },

    /**
     * 获取学生所有考试成绩（需要token）
     * @param {number} studentId 学生ID
     * @returns {Promise<Array<Object>>} 成绩列表
     */
    async getStudentExamScores(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/scores`);
        return response.data;
    },

    /**
     * 按关键词搜索学生考试成绩（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @returns {Promise<Array<Object>>} 成绩列表
     */
    async searchStudentExamScores(studentId, keywords) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/scores/search`, { params: { keywords } });
        return response.data;
    },

    /**
     * 获取学生某场考试的所有答卷（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @returns {Promise<Array<Object>>} 答卷列表
     */
    async getStudentExamAnswers(studentId, examId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}`);
        return response.data;
    },

    /**
     * 按题目内容搜索学生某场考试的答卷（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @param {string} content 题目内容关键词
     * @returns {Promise<Array<Object>>} 答卷列表
     */
    async getStudentAnswersByQuestionContent(studentId, examId, content) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}/search`, { params: { content } });
        return response.data;
    },

    /**
     * 获取学生某场考试的总成绩（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @returns {Promise<Object>} 成绩对象
     */
    async getExamScore(studentId, examId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}/score`);
        return response.data;
    },

    /**
     * 获取学生某场考试某题的答卷（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @param {number} questionId 题目ID
     * @returns {Promise<Object>} 答卷信息
     */
    async getStudentQuestionAnswer(studentId, examId, questionId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}/question/${questionId}`);
        return response.data;
    },

    /**
     * 获取学生某场考试详情（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @returns {Promise<Object>} 考试详情
     */
    async getExamDetail(studentId, examId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}/detail`);
        return response.data;
    },

    /**
     * 获取学生某场考试的智能分析（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @returns {Promise<Object>} 分析结果
     */
    async analyzeExamResult(studentId, examId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}/analysis`);
        return response.data;
    },

    /**
     * 获取学生某场考试的学习建议（需要token）
     * @param {number} studentId 学生ID
     * @param {number} examId 考试ID
     * @returns {Promise<Array<string>>} 建议列表
     */
    async generateLearningAdvice(studentId, examId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/${examId}/advice`);
        return response.data;
    },

    /**
     * 按考试标题获取学生答卷（需要token）
     * @param {number} studentId 学生ID
     * @param {string} title 考试标题
     * @returns {Promise<Array<Object>>} 答卷列表
     */
    async getStudentExamAnswersByTitle(studentId, title) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/title`, { params: { title } });
        return response.data;
    },

    /**
     * 按考试标题获取学生成绩（需要token）
     * @param {number} studentId 学生ID
     * @param {string} title 考试标题
     * @returns {Promise<Object>} 成绩对象
     */
    async getExamScoreByTitle(studentId, title) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/title/score`, { params: { title } });
        return response.data;
    },

    /**
     * 按考试标题获取考试详情（需要token）
     * @param {number} studentId 学生ID
     * @param {string} title 考试标题
     * @returns {Promise<Object>} 考试详情
     */
    async getExamDetailByTitle(studentId, title) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/title/detail`, { params: { title } });
        return response.data;
    },

    /**
     * 按考试标题获取智能分析（需要token）
     * @param {number} studentId 学生ID
     * @param {string} title 考试标题
     * @returns {Promise<Object>} 分析结果
     */
    async analyzeExamResultByTitle(studentId, title) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/title/analysis`, { params: { title } });
        return response.data;
    },

    /**
     * 按考试标题获取学习建议（需要token）
     * @param {number} studentId 学生ID
     * @param {string} title 考试标题
     * @returns {Promise<Array<string>>} 建议列表
     */
    async generateLearningAdviceByTitle(studentId, title) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/exam/title/advice`, { params: { title } });
        return response.data;
    },

    /**
     * 智能评测学生答卷（按内容，需token）
     * @param {number} studentId 学生ID
     * @param {string} title 考试标题
     * @param {string} content 答案内容
     * @returns {Promise<Array<Object>>} 评测结果
     */
    async intelligentEvaluateAnswerByContent(studentId, title, content) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/student/${studentId}/evaluate-by-content`, { params: { title, content } });
        return response.data;
    },

    /**
     * 智能评测学生答卷（按答卷ID，需token）
     * @param {number} answerId 答卷ID
     * @returns {Promise<Object>} 评测结果
     */
    async intelligentEvaluateAnswer(answerId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-exam/answer/${answerId}/evaluate`);
        return response.data;
    }
};

// 学生智能助理相关 API（使用学生端端口）
export const studentAssistantAPI = {
    /**
     * 提交练习答案（需要token）
     * @param {number} studentId 学生ID
     * @param {string} exerciseId 练习ID
     * @param {Object} answers 答案对象，key为题目ID，value为答案字符串
     *   - 例如: { "questionId1": "答案1", "questionId2": "答案2" }
     * @returns {Promise<Object>} 提交结果，由后端返回
     */
    async submitExerciseAnswers(studentId, exerciseId, answers) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(`/api/student-assistant/student/${studentId}/submit-answers`, answers, { params: { exerciseId } });
        return response.data;
    },

    /**
     * 获取实时答题提示（需要token）
     * @param {number} studentId 学生ID
     * @param {string} questionId 题目ID
     * @param {string} partialAnswer 当前作答内容
     * @returns {Promise<Object>} 提示信息，由后端返回
     */
    async getRealTimeHint(studentId, questionId, partialAnswer) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(`/api/student-assistant/student/${studentId}/hint`, null, { params: { questionId, partialAnswer } });
        return response.data;
    },

    /**
     * 向智能助理提问（需要token）
     * @param {number} studentId 学生ID
     * @param {string} question 问题内容
     * @param {number} [courseId] 课程ID（可选）
     * @returns {Promise<Object>} 答复，由后端返回
     */
    async askQuestion(studentId, question, courseId) {
        const axios = createStudentAuthorizedAxios();
        const params = { question };
        if (courseId !== undefined) params.courseId = courseId;
        const response = await axios.post(`/api/student-assistant/student/${studentId}/ask`, null, { params });
        return response.data;
    },

    /**
     * 按知识点名称向智能助理提问（需要token）
     * @param {number} studentId 学生ID
     * @param {string} question 问题内容
     * @param {string} knowledgeName 知识点名称
     * @returns {Promise<Object>} 答复，由后端返回
     */
    async askQuestionByKnowledgeName(studentId, question, knowledgeName) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(`/api/student-assistant/student/${studentId}/ask/by-knowledge`, null, { params: { question, knowledgeName } });
        return response.data;
    },

    /**
     * 按课程名称向智能助理提问（需要token）
     * @param {number} studentId 学生ID
     * @param {string} question 问题内容
     * @param {string} courseName 课程名称
     * @returns {Promise<Object>} 答复，由后端返回
     */
    async askQuestionByCourseName(studentId, question, courseName) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.post(`/api/student-assistant/student/${studentId}/ask/by-course-name`, null, { params: { question, courseName } });
        return response.data;
    },

    /**
     * 搜索历史提问（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @param {number} [limit=20] 返回条数（可选，默认20）
     * @returns {Promise<Array<Object>>} 历史问题列表
     */
    async searchQuestionHistory(studentId, keywords, limit = 20) {
        const axios = createStudentAuthorizedAxios();
        const params = { keywords };
        if (limit) params.limit = limit;
        const response = await axios.get(`/api/student-assistant/student/${studentId}/search-questions`, { params });
        return response.data;
    },

    /**
     * 获取推荐学习资源（需要token）
     * @param {number} studentId 学生ID
     * @param {string} keywords 关键词
     * @param {string} [resourceType] 资源类型（可选）
     * @param {number} [limit=10] 返回条数（可选，默认10）
     * @returns {Promise<Array<Object>>} 资源列表
     */
    async searchLearningResources(studentId, keywords, resourceType, limit = 10) {
        const axios = createStudentAuthorizedAxios();
        const params = { keywords };
        if (resourceType) params.resourceType = resourceType;
        if (limit) params.limit = limit;
        const response = await axios.get(`/api/student-assistant/student/${studentId}/resources`, { params });
        return response.data;
    },

    /**
     * 获取历史提问记录（需要token）
     * @param {number} studentId 学生ID
     * @param {number} [limit=20] 返回条数（可选，默认20）
     * @returns {Promise<Array<Object>>} 历史问题列表
     */
    async getQuestionHistory(studentId, limit = 20) {
        const axios = createStudentAuthorizedAxios();
        const params = {};
        if (limit) params.limit = limit;
        const response = await axios.get(`/api/student-assistant/student/${studentId}/question-history`, { params });
        return response.data;
    },

    /**
     * 生成智能练习（需要token）
     * @param {number} studentId 学生ID
     * @param {number} courseId 课程ID
     * @param {Array<number>} [knowledgeIds] 知识点ID数组（可选）
     * @param {string} [difficultyLevel] 难度等级（可选）
     * @param {number} questionCount 题目数量
     * @returns {Promise<Object>} 练习生成结果
     */
    async generateExercise(studentId, courseId, knowledgeIds, difficultyLevel, questionCount) {
        const axios = createStudentAuthorizedAxios();
        const params = { courseId, questionCount };
        if (knowledgeIds) params.knowledgeIds = knowledgeIds;
        if (difficultyLevel) params.difficultyLevel = difficultyLevel;
        const response = await axios.get(`/api/student-assistant/student/${studentId}/generate-exercise`, { params });
        return response.data;
    },

    /**
     * 针对薄弱知识点生成练习（需要token）
     * @param {number} studentId 学生ID
     * @param {number} questionCount 题目数量
     * @returns {Promise<Object>} 练习生成结果
     */
    async generateWeakPointsExercise(studentId, questionCount) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student-assistant/student/${studentId}/generate-exercise/weak-points`, { params: { questionCount } });
        return response.data;
    },

    /**
     * 按知识点名称生成练习（需要token）
     * @param {number} studentId 学生ID
     * @param {Array<string>} knowledgeNames 知识点名称数组
     * @param {string} [difficultyLevel] 难度等级（可选）
     * @param {number} questionCount 题目数量
     * @returns {Promise<Object>} 练习生成结果
     */
    async generateExerciseByKnowledgeNames(studentId, knowledgeNames, difficultyLevel, questionCount) {
        const axios = createStudentAuthorizedAxios();
        const params = { knowledgeNames, questionCount };
        if (difficultyLevel) params.difficultyLevel = difficultyLevel;
        const response = await axios.get(`/api/student-assistant/student/${studentId}/generate-exercise/by-knowledge`, { params });
        return response.data;
    },

    /**
     * 按课程名称生成练习（需要token）
     * @param {number} studentId 学生ID
     * @param {string} courseName 课程名称
     * @param {string} [difficultyLevel] 难度等级（可选）
     * @param {number} questionCount 题目数量
     * @returns {Promise<Object>} 练习生成结果
     */
    async generateExerciseByCourseName(studentId, courseName, difficultyLevel, questionCount) {
        const axios = createStudentAuthorizedAxios();
        const params = { courseName, questionCount };
        if (difficultyLevel) params.difficultyLevel = difficultyLevel;
        const response = await axios.get(`/api/student-assistant/student/${studentId}/generate-exercise/by-course`, { params });
        return response.data;
    }
};
