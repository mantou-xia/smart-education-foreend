<template>
  <div class="student-dashboard">    
    <div class="dashboard-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard',
  data() {
    return {
      userData: null
    }
  },
  created() {
    // 获取用户数据
    try {
      this.userData = JSON.parse(localStorage.getItem('userData'))
      
      // 如果不是学生，重定向到登录页
      if (this.userData?.role !== 'student') {
        this.$router.push({ name: 'Login' })
      }
    } catch (e) {
      console.error('无法解析用户数据', e)
      this.$router.push({ name: 'Login' })
    }
  },
  methods: {
    handleLogout() {
      // 清除登录状态和用户数据
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')
      // 重定向到登录页
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dashboard-content {
  margin: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
}
</style> 