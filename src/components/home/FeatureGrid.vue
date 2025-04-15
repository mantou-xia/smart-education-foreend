<template>
  <div class="feature-grid">
    <feature-card 
      v-for="feature in features" 
      :key="feature.path"
      :feature="feature"
      @click="$emit('navigate', feature.path)"
    />
  </div>
</template>

<script>
import FeatureCard from '@/components/home/FeatureCard.vue'

export default {
  name: 'FeatureGrid',
  components: {
    FeatureCard
  },
  emits: ['navigate'],
  data() {
    return {
      features: [
        {
          icon: '📝',
          title: '智能备课设计',
          description: '根据教学目标自动生成教案，提供多元化教学活动建议',
          path: '/teacher/lesson-designer'
        },
        {
          icon: '📊',
          title: '考核内容生成',
          description: '快速生成符合教学要求的试题，支持多种题型和难度',
          path: '/teacher/assessment'
        },
        {
          icon: '📈',
          title: '学情数据分析',
          description: '全面分析学生学习状况，精准识别教学重点和难点',
          path: '/teacher/data-analysis'
        },
        {
          icon: '🤖',
          title: '在线学习助手',
          description: '智能问答系统，实时回答学生问题，提供个性化练习',
          path: '/student/assistant'
        }
      ]
    }
  }
}
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style> 