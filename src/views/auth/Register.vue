<template>
  <div class="register-card">
    <div class="register-header">
      <h2>创建账号</h2>
      <p>加入我们的学习平台</p>
    </div>
    
    <register-form @register="handleRegister" />
    
    <div class="register-footer">
      <p>已有账号？ <router-link to="/auth/login">立即登录</router-link></p>
    </div>
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  },
  setup() {
    const router = useRouter()
    
    const handleRegister = (userData) => {
      // 这里应该调用注册API
      console.log('注册信息:', userData)
      
      // 模拟注册成功，跳转到登录页
      router.push('/auth/login')
    }
    
    return {
      handleRegister
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