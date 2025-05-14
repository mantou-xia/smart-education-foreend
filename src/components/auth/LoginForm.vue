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
    
    <div class="test-accounts">
      <p>测试账号:</p>
      <ul>
        <li>管理员: admin / 123456</li>
        <li>教师: teacher1 / 123456</li>
        <li>学生: student1 / 123456</li>
      </ul>
    </div>
  </form>
</template>

<script>
import { ref, reactive } from 'vue';
import apiService from '@/utils/api';

// 根据用户角色获取默认首页路径
function getHomePageByRole(role) {
  switch(role) {
    case 'admin':
      return '/admin/dashboard';
    case 'teacher':
      return '/teacher/lesson-designer';
    case 'student':
      return '/student/courses';
    default:
      return '/';
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
          // 调用后端登录API
          const response = await apiService.auth.login(form.username, form.password);
          
          if (response && response.success) {
            const user = response.user;
            
            // 获取对应角色的主页
            const homePage = getHomePageByRole(user.role);
            
            // 存储用户数据
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(user));
            
            // 通知父组件登录成功，并传递主页路径
            emit('login', { user, homePage });
          } else {
            // 登录失败
            loginError.value = response.message || '用户名或密码错误';
          }
        } catch (error) {
          console.error('登录失败:', error);
          loginError.value = '登录失败，请稍后再试';
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