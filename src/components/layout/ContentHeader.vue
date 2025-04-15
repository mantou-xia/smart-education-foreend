<template>
  <div class="content-header">
    <h2>{{ title }}</h2>
    <breadcrumb />
  </div>
</template>

<script>
import Breadcrumb from './BreadCrumb.vue'

export default {
  name: 'ContentHeader',
  components: {
    Breadcrumb
  },
  computed: {
    title() {
      const route = this.$route
      
      const titles = {
        '/': '首页',
        '/teacher/lesson-designer': '智能备课设计',
        '/teacher/assessment': '考核内容生成',
        '/teacher/data-analysis': '学情数据分析',
        '/student/assistant': '在线学习助手',
        '/student/learning-path': '个性化学习路径',
        '/admin/dashboard': '系统管理',
        '/admin/monitor': '性能监控',
        '/admin/config': '配置管理'
      }
      
      return titles[route.path] || '页面标题'
    }
  }
}
</script>

<style scoped>
.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
}
</style> 