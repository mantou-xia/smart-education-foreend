<template>
  <div class="breadcrumb">
    <span>首页</span>
    <span v-if="parentName"> / <span>{{ parentName }}</span></span>
    <span v-if="pageName"> / <span>{{ pageName }}</span></span>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  computed: {
    currentPath() {
      return this.$route.path
    },
    parentName() {
      const path = this.currentPath
      
      if (path.includes('/teacher')) return '教师端'
      if (path.includes('/student')) return '学生端'
      if (path.includes('/admin')) return '系统管理'
      
      return ''
    },
    pageName() {
      const route = this.$route
      
      const titles = {
        '/': '',
        '/teacher/lesson-designer': '智能备课设计',
        '/teacher/assessment': '考核内容生成',
        '/teacher/data-analysis': '学情数据分析',
        '/student/assistant': '在线学习助手',
        '/student/learning-path': '个性化学习路径',
        '/admin/dashboard': '系统面板',
        '/admin/monitor': '性能监控',
        '/admin/config': '配置管理'
      }
      
      return titles[route.path] || ''
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  color: #999;
  font-size: 13px;
}
</style> 