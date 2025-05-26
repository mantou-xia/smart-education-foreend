<template>
  <div class="global-api-test-center">
    <h1>全面 API 测试中心</h1>
    
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="认证 API" name="auth">
        <AuthAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="学生 API" name="student">
        <StudentAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="课程 API" name="course">
        <CourseAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="学习进度 API" name="learning-progress">
        <LearningProgressAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="学习计划 API" name="learning-plan">
        <LearningPlanAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="考勤 API" name="attendance">
        <AttendanceAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="学生考试 API" name="student-exam">
        <ExamAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="智能助理 API" name="assistant">
        <AssistantAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="教师 API" name="teacher">
        <TeacherAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="知识点 API" name="knowledge">
        <KnowledgeAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="题目 API" name="question">
        <QuestionAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="考试管理 API" name="exam">
        <ExamAPITestPanel />
      </el-tab-pane>
      
      <el-tab-pane label="智能备课 API" name="teaching-assistant">
        <TeachingAssistantAPITestPanel />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'

export default {
  name: 'GlobalAPITestCenter',
  components: {
    AuthAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/AuthAPITest.vue')),
    StudentAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/StudentAPITest.vue')),
    CourseAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/CourseAPITest.vue')),
    LearningProgressAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/LearningProgressAPITest.vue')),
    LearningPlanAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/LearningPlanAPITest.vue')),
    AttendanceAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/AttendanceAPITest.vue')),
    ExamAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/StudentExamAPITest.vue')),
    AssistantAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/StudentAssistantAPITest.vue')),
    TeacherAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/TeacherAPITest.vue')),
    KnowledgeAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/KnowledgeAPITest.vue')),
    QuestionAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/QuestionAPITest.vue')),
    TeachingAssistantAPITestPanel: defineAsyncComponent(() => import('./APITestComponents/TeachingAssistantAPITest.vue'))
  },
  setup() {
    const activeTab = ref('auth')
    
    return {
      activeTab
    }
  }
}
</script>

<style scoped>
.global-api-test-center {
  padding: 20px;
}
</style> 