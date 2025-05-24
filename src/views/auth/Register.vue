<template>
  <div class="register-card">
    <div class="register-header">
      <h2>创建账号</h2>
      <p>加入我们的学习平台</p>
    </div>
    
    <register-form @register="handleRegister" :is-submitting="isRegistering" />
    
    <div v-if="registrationError" class="error-message-global">
      {{ registrationError }}
    </div>

    <div class="register-footer">
      <p>已有账号？ <router-link to="/auth/login">立即登录</router-link></p>
    </div>
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { registerTeacher, registerStudent } from '@/api/auth' // 导入API

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  },
  setup() {
    const router = useRouter()
    const isRegistering = ref(false)
    const registrationError = ref('')
    
    const handleRegister = async (userData) => {
      isRegistering.value = true
      registrationError.value = ''
      
      // 从 RegisterForm.vue 传递过来的 userData 包含: username, email, role, password
      // API 可能需要 fullname 和 phone, 但当前表单未提供，这里仅使用已有数据
      // 如果API强制要求 fullname 和 phone, 后续需要在 RegisterForm.vue 中添加这些字段
      const apiPayload = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
      };

      try {
        let response;
        if (userData.role === 'teacher') {
          console.log('尝试注册教师:', apiPayload);
          response = await registerTeacher(apiPayload);
        } else if (userData.role === 'student') {
          console.log('尝试注册学生:', apiPayload);
          response = await registerStudent(apiPayload);
        } else {
          registrationError.value = '无效的用户角色';
          isRegistering.value = false;
          return;
        }
        
        console.log('注册成功:', response);
        // 通常注册成功后，后端会返回token，前端可以保存token并导航
        localStorage.setItem('accessToken', response.accessToken);
        console.log('accessToken:', response.accessToken);
        
        alert('注册成功！即将跳转到登录页面。'); // 简单提示
        router.push('/auth/login');

      } catch (error) {
        console.error('注册失败:', error);
        // 根据实际错误响应显示更友好的提示
        registrationError.value = error.response?.data?.message || error.message || '注册失败，请稍后再试。';
      } finally {
        isRegistering.value = false;
      }
    }
    
    return {
      handleRegister,
      isRegistering,
      registrationError
    }
  }
}
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  font-size: 24px;
  color: #3f51b5;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
}

.error-message-global {
  color: #f44336;
  background-color: #ffebee;
  border: 1px solid #f44336;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-footer a {
  color: #3f51b5;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style> 