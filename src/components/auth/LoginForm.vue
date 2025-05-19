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
import { auth } from '@/api/api';
import { setToken, getToken, setRefreshToken, setUserInfo, setStudentInfo, cleanRedundantAuth } from '@/utils/auth';
import { student } from '@/api/api';

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
  
  // 打印原始角色信息，便于调试
  console.log('正在格式化角色:', roleStr);
  
  // 处理常见的角色名格式 (ROLE_XXX 或 XXX)
  if (roleStr.includes('ROLE_TEACHER') || roleStr.includes('TEACHER')) {
    return 'teacher';
  } else if (roleStr.includes('ROLE_STUDENT') || roleStr.includes('STUDENT')) {
    return 'student';
  } else if (roleStr.includes('ROLE_ADMIN') || roleStr.includes('ADMIN')) {
    return 'admin';
  } else {
    // 如果是以ROLE_开头的其他角色，提取ROLE_后面的部分并转换为小写
    const roleMatch = roleStr.match(/ROLE_(.+)/);
    if (roleMatch && roleMatch[1]) {
      return roleMatch[1].toLowerCase();
    }
    // 否则返回原角色小写
    return (role || '').toLowerCase();
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
    const userType = ref('student'); // 默认为学生登录
    
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
          const response = await auth.login({
            username: form.username,
            password: form.password
          });
          
          // 获取返回的token和角色信息
          const { tokens, roles } = response;
          
          // 检查并标准化token格式
          if (!tokens || !tokens.accessToken) {
            throw new Error('服务器未返回有效的token');
          }
          
          // 清理冗余的认证信息
          cleanRedundantAuth();
          
          // 保存token到本地存储
          console.log('登录成功，准备保存token...');
          setToken(tokens.accessToken);
          
          if (tokens.refreshToken) {
            setRefreshToken(tokens.refreshToken);
            console.log('已保存refreshToken');
          }
          
          // 测试token已成功保存
          const savedToken = getToken();
          console.log('验证token保存状态:', savedToken ? '成功' : '失败');
          
          // 创建基本用户信息
          const userInfo = {
            username: form.username,
            roles,
            userType: userType.value
          };
          
          // 如果是学生用户，获取更多学生详细信息
          if (userType.value === 'student' || (roles && roles.some(role => String(role).toUpperCase().includes('STUDENT')))) {
            try {
              // 确保token设置生效后再进行API调用
              console.log('尝试获取学生详情信息...');
              
              // 使用刚刚获取的token，直接调用API
              const accessToken = tokens.accessToken;
              console.log(`直接使用登录返回的token调用API: ${accessToken.substring(0, 15)}...`);
              
              // 使用token获取学生详细信息
              const studentInfo = await student.getStudentByUsername(form.username, accessToken);
              if (studentInfo && studentInfo.id) {
                // 将学生ID等详细信息添加到用户信息中
                userInfo.studentId = studentInfo.id;
                userInfo.studentInfo = studentInfo;
                console.log('已获取并保存学生详细信息:', studentInfo);
                
                // 单独保存学生信息到localStorage
                setStudentInfo(studentInfo);
              } else {
                console.warn('获取到的学生信息不完整');
              }
            } catch (e) {
              console.error('获取学生详细信息失败:', e);
              // 获取失败不阻止登录流程，但记录错误
              userInfo.studentInfoError = true;
            }
          }
          
          // 保存用户信息
          setUserInfo(userInfo);
          
          // 设置登录状态
          localStorage.setItem('isLoggedIn', 'true');
          
          // 根据角色获取首页路径
          let roleName = '';
          if (roles && roles.length > 0) {
            roleName = roles[0];
          }
          
          // 格式化角色名称为路由所需格式
          const formattedRole = formatRoleName(roleName);
          
          // 保存用户数据到userData（路由守卫使用）
          const userDataToStore = {
            username: form.username,
            name: form.username, // 初始时用username作为name
            role: formattedRole
          };
          
          // 如果有学生信息，添加学生相关数据
          if (userInfo.studentInfo) {
            userDataToStore.studentId = userInfo.studentInfo.id;
            // 如果学生信息中包含姓名，则使用学生姓名
            if (userInfo.studentInfo.fullName) {
              userDataToStore.name = userInfo.studentInfo.fullName;
            }
          }
          
          console.log('保存userData到localStorage:', userDataToStore);
          localStorage.setItem('userData', JSON.stringify(userDataToStore));
          
          const homePage = getHomePageByRole(roleName);
          
          console.log('登录成功，原始角色:', roleName, '格式化角色:', formattedRole, '跳转路径:', homePage);
          
          // 通知父组件登录成功，并传递用户信息和主页路径
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