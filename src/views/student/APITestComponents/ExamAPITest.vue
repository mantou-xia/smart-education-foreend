<template>
  <div class="exam-api-test">
    <h2>考试 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取考试信息</span>
          <el-input v-model="examId" placeholder="考试ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetExamById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据教师ID获取考试列表</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetExamsByTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID获取考试列表</span>
          <el-input v-model="courseId" placeholder="课程ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetExamsInCourse">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { examAPI } from '@/api/api'

export default {
  name: 'ExamAPITest',
  setup() {
    const examId = ref('')
    const teacherId = ref('')
    const courseId = ref('')
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')

    const testGetExamById = async () => {
      result1.value = JSON.stringify(await examAPI.getExamById(examId.value), null, 2)
    }
    const testGetExamsByTeacher = async () => {
      result2.value = JSON.stringify(await examAPI.getExamsByTeacher(teacherId.value), null, 2)
    }
    const testGetExamsInCourse = async () => {
      result3.value = JSON.stringify(await examAPI.getExamsInCourse(courseId.value), null, 2)
    }

    return {
      examId, teacherId, courseId, result1, result2, result3,
      testGetExamById, testGetExamsByTeacher, testGetExamsInCourse
    }
  }
}
</script>

<style scoped>
.exam-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 