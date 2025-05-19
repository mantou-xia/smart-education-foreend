<template>
  <div class="student-dashboard">    
    <div class="dashboard-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { clearAuth, setStudentInfo } from '@/utils/auth'
import { student } from '@/api/api'

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
        return
      }
      
      // 确保获取到学生ID
      this.ensureStudentInfo()
    } catch (e) {
      console.error('无法解析用户数据', e)
      this.$router.push({ name: 'Login' })
    }
  },
  methods: {
    // 确保获取到学生信息
    async ensureStudentInfo() {
      try {
        // 检查本地存储中是否已有学生信息
        const studentInfo = JSON.parse(localStorage.getItem('student_info'))
        if (studentInfo && studentInfo.id) {
          console.log('已找到缓存的学生信息:', studentInfo.id)
          return
        }
        
        // 如果没有，则通过API获取
        if (this.userData && this.userData.username) {
          console.log('正在通过API获取学生信息...')
          const apiStudentInfo = await student.getStudentByUsername(this.userData.username)
          
          if (apiStudentInfo && apiStudentInfo.id) {
            console.log('成功获取学生信息:', apiStudentInfo.id)
            // 保存到本地存储
            setStudentInfo(apiStudentInfo)
            
            // 更新userData
            this.userData.studentId = apiStudentInfo.id
            localStorage.setItem('userData', JSON.stringify(this.userData))
          } else {
            console.warn('API返回的学生信息不完整')
          }
        }
      } catch (e) {
        console.error('获取学生信息失败:', e)
      }
    },
    
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