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
     * 检查用户名是否可用（学生端，无需token）
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
    }
};

// 其他 API 模块（学生端）保持不变，只需要替换 createAuthorizedAxios() 为 createStudentAuthorizedAxios()
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
