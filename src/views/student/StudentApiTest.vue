<template>
  <div class="student-api-test-page">
    <h1>学生端 API 测试中心</h1>
    
    <el-tabs type="border-card">
      <el-tab-pane label="认证 API">
        <AuthAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="学生 API">
        <StudentAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="课程 API">
        <CourseAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="学习进度 API">
        <LearningProgressAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="学习计划 API">
        <LearningPlanAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="考勤 API" name="attendance">
        <AttendanceAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="考试 API" name="exam">
        <StudentExamAPITest />
      </el-tab-pane>
      
      <el-tab-pane label="智能助理 API" name="assistant">
        <StudentAssistantAPITest />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AuthAPITest from './APITestComponents/AuthAPITest.vue'
import StudentAPITest from './APITestComponents/StudentAPITest.vue'
import CourseAPITest from './APITestComponents/CourseAPITest.vue'
import LearningProgressAPITest from './APITestComponents/LearningProgressAPITest.vue'
import LearningPlanAPITest from './APITestComponents/LearningPlanAPITest.vue'
import AttendanceAPITest from './APITestComponents/AttendanceAPITest.vue'
import StudentExamAPITest from './APITestComponents/StudentExamAPITest.vue'
import StudentAssistantAPITest from './APITestComponents/StudentAssistantAPITest.vue'

export default defineComponent({
  name: 'StudentApiTest',
  components: {
    AuthAPITest,
    StudentAPITest,
    CourseAPITest,
    LearningProgressAPITest,
    LearningPlanAPITest,
    AttendanceAPITest,
    StudentExamAPITest,
    StudentAssistantAPITest
  }
})
</script>

<style scoped>
.student-api-test-page {
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
</style>
