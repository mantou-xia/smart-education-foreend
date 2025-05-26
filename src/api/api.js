import axios from 'axios';
import { getToken } from '@/utils/auth';

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

// 认证相关 API
export const authAPI = {
    /**
     * 学生登录接口
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Promise<{tokens: {accessToken: string, refreshToken: string}, roles: string[]}>} 登录响应，包含token和角色
     */
    async studentLogin(username, password) {
        const response = await studentAxios.post('/api/auth/login', { username, password });
        return response.data;
    },

    /**
     * 教师登录接口
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Promise<{tokens: {accessToken: string, refreshToken: string}, roles: string[]}>} 登录响应，包含token和角色
     */
    async teacherLogin(username, password) {
        const response = await teacherAxios.post('/api/auth/login', { username, password });
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
    }
};

// 学生相关 API（使用学生端端口）
export const studentAPI = {
    /**
     * 根据用户名获取学生信息（需要token）
     * @param {string} username 用户名
     * @returns {Promise<{studentId: number, username: string, email?: string, fullName?: string, grade?: string, className?: string, createdAt?: string, updatedAt?: string}>} 学生信息
     */
    async getStudentByUsername(username) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/student/username/${username}`);
        return response.data;
    },

    /**
     * 获取当前登录学生的自身信息（需要token）
     * @returns {Promise<{studentId: number, username: string, email?: string, fullName?: string, grade?: string, className?: string, createdAt?: string, updatedAt?: string}>} 学生自身信息
     */
    async getSelfStudentInfo() {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/student/self');
        return response.data;
    }
};

// 课程相关 API（使用学生端端口）
export const courseAPI = {
    /**
     * 获取所有课程（需要token）
     * @returns {Promise<Array<{id: number, name: string, code: string, description?: string, credit?: number, category?: string, createTime?: string, updateTime?: string, status?: number, remark?: string}>>} 课程列表
     */
    async getAllCourses() {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get('/api/course/all');
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
     * @returns {Promise<Array<{progressId?: number, studentId?: number, courseId?: number, knowledgeId?: number, masteryLevel?: number, learningStatus?: string, courseName?: string, knowledgeName?: string, lastReviewedAt?: string, reviewCount?: number, mastered?: boolean}>>} 学生学习进度列表
     */
    async getStudentProgress(studentId) {
        const axios = createStudentAuthorizedAxios();
        const response = await axios.get(`/api/learning-progress/student/${studentId}`);
        return response.data;
    },
    // ... 其他方法
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
