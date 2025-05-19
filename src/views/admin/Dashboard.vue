<template>
  <div>
    <placeholder-view message="系统管理面板功能正在完善中..." />
  </div>
</template>

<script>
import PlaceholderView from '@/components/common/PlaceholderView.vue'
import { clearAuth } from '@/utils/auth'

export default {
  name: 'DashboardView',
  components: {
    PlaceholderView
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