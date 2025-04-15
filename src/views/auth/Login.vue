<template>
  <div class="login-card">
    <div class="login-header">
      <h2>欢迎回来</h2>
      <p>登录您的账号</p>
    </div>
    
    <login-form @login="handleLogin" />
    
    <div class="login-footer">
      <p>还没有账号？ <router-link to="/auth/register">立即注册</router-link></p>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  },
  setup() {
    const router = useRouter()
    
    const handleLogin = (data) => {
      console.log('登录成功:', data.user)
      
      // 根据用户角色跳转到不同的首页
      router.push(data.homePage)
    }
    
    return {
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 24px;
  color: #3f51b5;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-footer a {
  color: #3f51b5;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style> 