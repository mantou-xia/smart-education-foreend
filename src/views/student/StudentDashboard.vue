<template>
  <div class="student-dashboard">
    <div class="dashboard-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { clearAuth } from '@/utils/auth'
import { studentAPI, courseAPI, learningProgressAPI } from '@/api/api'

export default {
  name: 'StudentDashboard',
  data() {
    return {
      userData: null,
      apiTestResults: {}
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
        // 1. 获取当前登录学生的自身信息
        const selfInfo = await studentAPI.getSelfStudentInfo()
        console.log('[API测试] 获取当前学生信息成功:', selfInfo)
        this.apiTestResults.selfStudentInfo = selfInfo

        // 3. 获取所有课程
        const allCourses = await courseAPI.getAllCourses()
        console.log('[API测试] 获取所有课程成功:', allCourses)
        this.apiTestResults.allCourses = allCourses

        // 4. 获取学生整体学习进度
        const studentProgress = await learningProgressAPI.getStudentProgress(selfInfo.studentId)
        console.log('[API测试] 获取学生整体学习进度成功:', studentProgress)
        this.apiTestResults.studentProgress = studentProgress

        // 5. 获取学习进度统计
        const progressStatistics = await learningProgressAPI.getProgressStatistics(selfInfo.studentId)
        console.log('[API测试] 获取学习进度统计成功:', progressStatistics)
        this.apiTestResults.progressStatistics = progressStatistics
      } catch (error) {
        console.error('[API测试] 学生相关API测试失败:', error)
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