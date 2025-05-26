<template>
  <div class="global-api-test-center">
    <h1>教师端 API 测试中心</h1>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="教师 API" name="teacher">
        <TeacherAPITestPanel />
      </el-tab-pane>
      <el-tab-pane label="知识点 API" name="knowledge">
        <KnowledgeAPITestPanel />
      </el-tab-pane>
      <el-tab-pane label="认证 API" name="auth">
        <AuthAPITestPanel />
      </el-tab-pane>
      <el-tab-pane label="智能备课 API" name="teaching-assistant">
        <TeachingAssistantAPITestPanel />
      </el-tab-pane>
      <el-tab-pane label="题目 API" name="question">
        <QuestionAPITestPanel />
      </el-tab-pane>
      <el-tab-pane label="考试 API" name="exam">
        <ExamAPITestPanel />
      </el-tab-pane>
      <!-- 预留其他API测试tab，如有需要可继续添加 -->
    </el-tabs>
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'

export default {
  name: 'GlobalAPITestCenter',
  components: {
    AuthAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/AuthAPITest.vue')),
    TeacherAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/TeacherAPITest.vue')),
    KnowledgeAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/KnowledgeAPITest.vue')),
    TeachingAssistantAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/TeachingAssistantAPITest.vue')),
    QuestionAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/QuestionAPITest.vue')),
    ExamAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/ExamAPITest.vue'))
    // 其他API测试组件可在此处继续引入
  },
  setup() {
    const activeTab = ref('teacher')
    return { activeTab }
  }
}
</script>

<style scoped>
.global-api-test-center {
  padding: 20px;
}
</style> 