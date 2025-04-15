<template>
  <welcome-banner :title="welcomeTitle" :message="welcomeMessage" />
</template>

<script>
import { computed } from 'vue'
import WelcomeBanner from './WelcomeBanner.vue'

export default {
  name: 'UserWelcomeMessage',
  components: {
    WelcomeBanner
  },
  props: {
    userRole: {
      type: String,
      default: 'guest'
    },
    userName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 计算欢迎标题和消息
    const welcomeTitle = computed(() => {
      switch(props.userRole) {
        case 'student':
          return '欢迎回来，同学！'
        case 'teacher':
          return '欢迎回来，老师！'
        case 'admin':
          return '欢迎回来，管理员！'
        default:
          return '欢迎使用教学实训系统'
      }
    })
    
    const welcomeMessage = computed(() => {
      switch(props.userRole) {
        case 'student':
          return '开始你的学习之旅吧！'
        case 'teacher':
          return '开始你的教学工作吧！'
        case 'admin':
          return '开始管理系统吧！'
        default:
          return '请登录以使用系统功能'
      }
    })
    
    return {
      welcomeTitle,
      welcomeMessage
    }
  }
}
</script> 