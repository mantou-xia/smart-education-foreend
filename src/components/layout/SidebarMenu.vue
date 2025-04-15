<template>
  <ul class="sidebar-menu">
    <sidebar-menu-item 
      v-for="item in getMenuItems()" 
      :key="item.path" 
      :menu-item="item" 
    />
  </ul>
</template>

<script>
import SidebarMenuItem from './SidebarMenuItem.vue'

export default {
  name: 'SidebarMenu',
  components: {
    SidebarMenuItem
  },
  computed: {
    currentRoutePath() {
      return this.$route.path
    }
  },
  methods: {
    getMenuItems() {
      const path = this.currentRoutePath
      
      // 根据当前路径返回对应的菜单项
      if (path.includes('/teacher')) {
        return this.teacherMenuItems
      } else if (path.includes('/student')) {
        return this.studentMenuItems
      } else if (path.includes('/admin')) {
        return this.adminMenuItems
      }
      
      return this.homeMenuItems
    }
  },
  data() {
    return {
      teacherMenuItems: [
        { name: '智能备课设计', path: '/teacher/lesson-designer' },
        { name: '考核内容生成', path: '/teacher/assessment' },
        { name: '学情数据分析', path: '/teacher/data-analysis' }
      ],
      studentMenuItems: [
        { name: '在线学习助手', path: '/student/assistant' },
        { name: '个性化学习路径', path: '/student/learning-path' }
      ],
      adminMenuItems: [
        { name: '系统面板', path: '/admin/dashboard' },
        { name: '性能监控', path: '/admin/monitor' },
        { name: '配置管理', path: '/admin/config' }
      ],
      homeMenuItems: [
        { name: '智能备课设计', path: '/teacher/lesson-designer' },
        { name: '考核内容生成', path: '/teacher/assessment' },
        { name: '学情数据分析', path: '/teacher/data-analysis' },
        { 
          name: '系统状态', 
          path: '/admin/dashboard',
          divider: true 
        }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar-menu {
  list-style: none;
  padding: 10px 0;
}
</style> 