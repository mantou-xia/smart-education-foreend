<template>
  <nav class="nav-menu">
    <!-- 不同角色通用菜单 -->
    <navigation-link to="/" icon="🏠" text="首页" exact />
    
    <!-- 管理员菜单 -->
    <template v-if="userRole === 'admin'">
      <navigation-group title="管理中心">
        <navigation-link to="/admin/dashboard" icon="📊" text="仪表盘" />
        <navigation-link to="/admin/monitor" icon="🔍" text="系统监控" />
        <navigation-link to="/admin/config" icon="⚙️" text="系统配置" />
      </navigation-group>
    </template>
    
    <!-- 教师菜单 -->
    <template v-if="userRole === 'admin' || userRole === 'teacher'">
      <navigation-group title="教师工具">
        <navigation-link to="/teacher/lesson-designer" icon="📝" text="智能备课设计" />
        <navigation-link to="/teacher/assessment" icon="📋" text="考核内容生成" />
        <navigation-link to="/teacher/data-analysis" icon="📈" text="学情数据分析" />
        <navigation-link to="/teacher/students" icon="👨‍🎓" text="学生管理" />
      </navigation-group>
    </template>
    
    <!-- 学生菜单 -->
    <template v-if="userRole === 'admin' || userRole === 'student'">
      <navigation-group title="学习中心">
        <navigation-link to="/student/courses" icon="📚" text="我的课程" />
        <navigation-link to="/student/assignments" icon="📝" text="我的作业" />
        <navigation-link to="/student/progress" icon="📊" text="学习进度" />
        <navigation-link to="/student/assistant" icon="🤖" text="在线学习助手" />
        <navigation-link to="/student/learning-path" icon="🧭" text="个性化学习路径" />
      </navigation-group>
    </template>
  </nav>
</template>

<script>
import NavigationGroup from './NavigationGroup.vue'
import NavigationLink from './NavigationLink.vue'

export default {
  name: 'RoleNavigationMenu',
  components: {
    NavigationGroup,
    NavigationLink
  },
  props: {
    userRole: {
      type: String,
      default: 'guest'
    }
  }
}
</script>

<style scoped>
.nav-menu {
  display: flex;
  flex-direction: column;
}
</style> 