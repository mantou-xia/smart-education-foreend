<template>
  <div class="teacher-dashboard">    
    <div class="dashboard-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { clearAuth } from '@/utils/auth'

export default {
  name: 'TeacherDashboard',
  data() {
    return {
      userData: null
    }
  },
  created() {
    // 获取用户数据
    try {
      this.userData = JSON.parse(localStorage.getItem('userData'))
      
      // 如果不是教师，重定向到登录页
      if (this.userData?.role !== 'teacher') {
        this.$router.push({ name: 'Login' })
      }
    } catch (e) {
      console.error('无法解析用户数据', e)
      this.$router.push({ name: 'Login' })
    }
  },
  methods: {
    handleLogout() {
      // 使用clearAuth函数清除所有认证信息
      clearAuth()
      console.log('已清除所有认证信息，准备跳转到登录页')
      
      // 重定向到登录页
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.teacher-dashboard {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dashboard-content {
  margin: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style> 