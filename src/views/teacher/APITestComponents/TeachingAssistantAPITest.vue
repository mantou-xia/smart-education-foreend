<template>
  <div class="teaching-assistant-api-test">
    <h2>智能备课 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>生成智能备课方案</span>
          <el-input v-model="lessonData.subjectType" placeholder="学科类型" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="lessonData.courseOutline" placeholder="课程大纲" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="lessonData.courseDocuments" placeholder="课程文档（逗号分隔）" style="width: 180px; margin-right: 5px;" />
          <el-input v-model="lessonData.duration" placeholder="时长(分钟)" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="lessonData.difficultyLevel" placeholder="难度" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="lessonData.teachingStyle" placeholder="教学风格" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLesson">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result">{{ result }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { teachingAssistantAPI } from '@/api/api'

export default {
  name: 'TeachingAssistantAPITest',
  setup() {
    const lessonData = reactive({
      subjectType: '',
      courseOutline: '',
      courseDocuments: '', // 逗号分隔
      duration: '',
      difficultyLevel: '',
      teachingStyle: ''
    })
    const result = ref('')

    const testGenerateLesson = async () => {
      // 课程文档转为数组
      const data = {
        ...lessonData,
        courseDocuments: lessonData.courseDocuments
          ? lessonData.courseDocuments.split(',').map(s => s.trim())
          : []
      }
      result.value = JSON.stringify(await teachingAssistantAPI.generateLesson(data), null, 2)
    }

    return {
      lessonData, result, testGenerateLesson
    }
  }
}
</script>

<style scoped>
.teaching-assistant-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 