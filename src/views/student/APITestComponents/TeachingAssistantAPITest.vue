<template>
  <div class="teaching-assistant-api-test">
    <h2>智能备课 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>生成智能备课方案</span>
          <el-input v-model="subjectType" placeholder="学科类型" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="courseOutline" placeholder="课程大纲" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="courseDocuments" placeholder="课程文档（逗号分隔）" style="width: 180px; margin-right: 5px;" />
          <el-input-number v-model="duration" :min="1" :max="300" placeholder="时长(分钟)" style="margin-right: 5px;" />
          <el-input v-model="difficultyLevel" placeholder="难度等级" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="teachingStyle" placeholder="教学风格" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLesson">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result">{{ result }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { teachingAssistantAPI } from '@/api/api'

export default {
  name: 'TeachingAssistantAPITest',
  setup() {
    const subjectType = ref('')
    const courseOutline = ref('')
    const courseDocuments = ref('')
    const duration = ref(60)
    const difficultyLevel = ref('')
    const teachingStyle = ref('')
    const result = ref('')

    const testGenerateLesson = async () => {
      const lessonData = {
        subjectType: subjectType.value,
        courseOutline: courseOutline.value,
        courseDocuments: courseDocuments.value.split(','),
        duration: duration.value,
        difficultyLevel: difficultyLevel.value,
        teachingStyle: teachingStyle.value
      }
      result.value = JSON.stringify(await teachingAssistantAPI.generateLesson(lessonData), null, 2)
    }

    return {
      subjectType, courseOutline, courseDocuments, duration, difficultyLevel, teachingStyle, result,
      testGenerateLesson
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