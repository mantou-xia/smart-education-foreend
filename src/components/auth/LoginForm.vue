<template>
  <form class="login-form" @submit.prevent="submitForm">
    <div class="form-group">
      <label for="username">用户名</label>
      <input 
        id="username" 
        v-model="form.username" 
        type="text" 
        placeholder="请输入用户名"
        :class="{ 'input-error': errors.username }"
        @blur="validateUsername"
      />
      <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
    </div>
    
    <div class="form-group">
      <label for="password">密码</label>
      <div class="password-input">
        <input 
          id="password" 
          v-model="form.password" 
          :type="showPassword ? 'text' : 'password'" 
          placeholder="请输入密码"
          :class="{ 'input-error': errors.password }"
          @blur="validatePassword"
        />
        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
          {{ showPassword ? '隐藏' : '显示' }}
        </button>
      </div>
      <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
    </div>
    
    <div v-if="loginError" class="login-error">
      {{ loginError }}
    </div>
    
    <div class="form-option">
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.remember" />
        <span>记住我</span>
      </label>
      <a href="#" class="forgot-password">忘记密码？</a>
    </div>
    
    <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
      {{ isSubmitting ? '登录中...' : '登录' }}
    </button>
    
    <div class="role-selector">
      <label>选择角色：</label>
      <div class="radio-group">
        <label>
          <input type="radio" v-model="userType" value="student" />
          学生
        </label>
        <label>
          <input type="radio" v-model="userType" value="teacher" />
          教师
        </label>
      </div>
    </div>
    
    <div class="test-accounts">
      <p>测试账号:</p>
      <ul>
        <li>教师: teacher1 / 123456</li>
        <li>学生: student1 / 123456</li>
      </ul>
    </div>
  </form>
</template>

<script>
import { ref, reactive } from 'vue';
import { authAPI } from '@/api/api';  // 使用 authAPI
import { 
  setToken, 
  setRefreshToken, 
  setUserInfo, 
  setStudentInfo, 
  cleanRedundantAuth 
} from '@/utils/auth';
import { studentAPI } from '@/api/api';

// 根据用户角色获取默认首页路径
function getHomePageByRole(role) {
  const roleStr = String(role).toUpperCase();
  if (roleStr.includes('TEACHER')) {
    return '/teacher/lesson-designer';
  } else if (roleStr.includes('STUDENT')) {
    return '/student/courses';
  } else {
    return '/';
  }
}

// 格式化角色名称
function formatRoleName(role) {
  const roleStr = String(role || '').toUpperCase();
  
  if (roleStr.includes('ROLE_TEACHER') || roleStr.includes('TEACHER')) {
    return 'teacher';
  } else if (roleStr.includes('ROLE_STUDENT') || roleStr.includes('STUDENT')) {
    return 'student';
  } else if (roleStr.includes('ROLE_ADMIN') || roleStr.includes('ADMIN')) {
    return 'admin';
  } else {
    const roleMatch = roleStr.match(/ROLE_(.+)/);
    return roleMatch ? roleMatch[1].toLowerCase() : (role || '').toLowerCase();
  }
}

export default {
  name: 'LoginForm',
  emits: ['login'],
  setup(props, { emit }) {
    const form = reactive({
      username: '',
      password: '',
      remember: false
    });
    
    const errors = reactive({
      username: '',
      password: ''
    });
    
    const showPassword = ref(false);
    const isSubmitting = ref(false);
    const loginError = ref('');
    const userType = ref('student');
    
    const validateUsername = () => {
      if (!form.username) {
        errors.username = '请输入用户名';
        return false;
      }
      errors.username = '';
      return true;
    };
    
    const validatePassword = () => {
      if (!form.password) {
        errors.password = '请输入密码';
        return false;
      }
      if (form.password.length < 6) {
        errors.password = '密码长度不能少于6位';
        return false;
      }
      errors.password = '';
      return true;
    };
    
    const validateForm = () => {
      return validateUsername() && validatePassword();
    };
    
    const submitForm = async () => {
      loginError.value = '';
      
      if (validateForm()) {
        isSubmitting.value = true;
        
        try {
          // 根据用户类型选择登录 API
          let loginResponse;
          if (userType.value === 'student') {
            loginResponse = await authAPI.studentLogin(form.username, form.password);
          } else if (userType.value === 'teacher') {
            loginResponse = await authAPI.teacherLogin(form.username, form.password);
          } else {
            throw new Error('无效的用户角色');
          }
          
          // 检查并处理登录响应
          const { tokens, roles } = loginResponse;
          
          if (!tokens || !tokens.accessToken) {
            throw new Error('服务器未返回有效的token');
          }
          
          // 清理冗余认证信息
          cleanRedundantAuth();
          
          // 保存 token
          setToken(tokens.accessToken);
          if (tokens.refreshToken) {
            setRefreshToken(tokens.refreshToken);
          }
          
          // 创建基本用户信息
          const userInfo = {
            username: form.username,
            roles,
            userType: userType.value
          };
          
          // 如果是学生用户，获取更多学生详细信息
          if (userType.value === 'student') {
            try {
              const studentInfo = await studentAPI.getStudentByUsername(form.username);
              if (studentInfo && studentInfo.studentId) {
                userInfo.studentId = studentInfo.studentId;
                userInfo.studentInfo = studentInfo;
                setStudentInfo(studentInfo);
              }
            } catch (e) {
              console.error('获取学生详细信息失败:', e);
              userInfo.studentInfoError = true;
            }
          }
          
          // 保存用户信息
          setUserInfo(userInfo);
          localStorage.setItem('isLoggedIn', 'true');
          
          // 格式化角色名称
          const formattedRole = formatRoleName(roles[0] || userType.value);
          
          // 准备存储的用户数据
          const userDataToStore = {
            username: form.username,
            name: form.username,
            role: formattedRole
          };
          
          // 如果有学生信息，添加学生相关数据
          if (userInfo.studentInfo) {
            userDataToStore.studentId = userInfo.studentInfo.studentId;
            if (userInfo.studentInfo.fullName) {
              userDataToStore.name = userInfo.studentInfo.fullName;
            }
          }
          
          localStorage.setItem('userData', JSON.stringify(userDataToStore));
          
          // 获取首页路径
          const homePage = getHomePageByRole(roles[0] || userType.value);
          
          // 通知父组件登录成功
          emit('login', { 
            user: userInfo, 
            homePage 
          });
        } catch (error) {
          console.error('登录失败:', error);
          loginError.value = error.response?.data?.message || '用户名或密码错误';
        } finally {
          isSubmitting.value = false;
        }
      }
    };
    
    return {
      form,
      errors,
      showPassword,
      isSubmitting,
      loginError,
      userType,
      validateUsername,
      validatePassword,
      submitForm
    };
  }
};
</script>

<style scoped>
.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3f51b5;
}

.input-error {
  border-color: #f44336 !important;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.login-error {
  color: #f44336;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
  padding: 8px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
}

.form-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

.forgot-password {
  color: #3f51b5;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
}

.role-selector {
  margin: 20px 0;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.radio-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-group input {
  margin-right: 8px;
  width: auto;
}

.test-accounts {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}

.test-accounts p {
  font-weight: 500;
  margin-bottom: 5px;
}

.test-accounts ul {
  padding-left: 20px;
  margin: 0;
}
</style> 