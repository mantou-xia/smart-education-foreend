<template>
  <div class="feature-grid">
    <template v-if="userRole === 'student'">
      <feature-card
        v-for="feature in studentFeatures"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :route="feature.route"
        @navigate="onNavigate"
      />
    </template>
    
    <template v-else-if="userRole === 'teacher'">
      <feature-card
        v-for="feature in teacherFeatures"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :route="feature.route"
        @navigate="onNavigate"
      />
    </template>
    
    <template v-else-if="userRole === 'admin'">
      <feature-card
        v-for="feature in adminFeatures"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :route="feature.route"
        @navigate="onNavigate"
      />
    </template>
  </div>
</template>

<script>
import FeatureCard from './FeatureCard.vue'

export default {
  name: 'UserFeatureGrid',
  components: {
    FeatureCard
  },
  props: {
    userRole: {
      type: String,
      default: 'guest'
    }
  },
  setup(props, { emit }) {
    // 学生功能列表
    const studentFeatures = [
      {
        icon: '📚',
        title: '我的课程',
        description: '查看和管理你的课程学习进度',
        route: '/student/courses'
      },
      {
        icon: '📝',
        title: '我的作业',
        description: '完成和提交课程作业',
        route: '/student/assignments'
      },
      {
        icon: '📊',
        title: '学习进度',
        description: '跟踪你的学习进度和成绩',
        route: '/student/progress'
      },
      {
        icon: '🤖',
        title: '在线学习助手',
        description: '获取智能问答和个性化练习',
        route: '/student/assistant'
      },
      {
        icon: '🧭',
        title: '个性化学习路径',
        description: '获取定制化的学习计划和资源推荐',
        route: '/student/learning-path'
      }
    ]
    
    // 教师功能列表
    const teacherFeatures = [
      {
        icon: '📝',
        title: '智能备课设计',
        description: '创建和编辑课程内容',
        route: '/teacher/lesson-designer'
      },
      {
        icon: '📋',
        title: '考核内容生成',
        description: '生成和评估学生作业',
        route: '/teacher/assessment'
      },
      {
        icon: '📈',
        title: '学情数据分析',
        description: '分析学生学习情况和进度',
        route: '/teacher/data-analysis'
      },
      {
        icon: '👨‍🎓',
        title: '学生管理',
        description: '管理学生信息和学习进度',
        route: '/teacher/students'
      }
    ]
    
    // 管理员功能列表
    const adminFeatures = [
      {
        icon: '📊',
        title: '系统仪表盘',
        description: '查看系统整体运行状况',
        route: '/admin/dashboard'
      },
      {
        icon: '🔍',
        title: '系统监控',
        description: '监控系统性能和资源使用',
        route: '/admin/monitor'
      },
      {
        icon: '⚙️',
        title: '系统配置',
        description: '管理系统参数和设置',
        route: '/admin/config'
      }
    ]
    
    const onNavigate = (route) => {
      emit('navigate', route)
    }
    
    return {
      studentFeatures,
      teacherFeatures,
      adminFeatures,
      onNavigate
    }
  }
}
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style> 