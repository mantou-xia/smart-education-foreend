<template>
  <div class="question-api-test">
    <h2>题目 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取题目信息</span>
          <el-input v-model="questionId" placeholder="题目ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetQuestionById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据教师ID获取题目列表</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetQuestionsByTeacherId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据知识点ID获取题目列表</span>
          <el-input v-model="knowledgeId" placeholder="知识点ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetQuestionsByKnowledgeId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { questionAPI } from '@/api/api'

export default {
  name: 'QuestionAPITest',
  setup() {
    const questionId = ref('')
    const teacherId = ref('')
    const knowledgeId = ref('')
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')

    const testGetQuestionById = async () => {
      result1.value = JSON.stringify(await questionAPI.getQuestionById(questionId.value), null, 2)
    }
    const testGetQuestionsByTeacherId = async () => {
      result2.value = JSON.stringify(await questionAPI.getQuestionsByTeacherId(teacherId.value), null, 2)
    }
    const testGetQuestionsByKnowledgeId = async () => {
      result3.value = JSON.stringify(await questionAPI.getQuestionsByKnowledgeId(knowledgeId.value), null, 2)
    }

    return {
      questionId, teacherId, knowledgeId, result1, result2, result3,
      testGetQuestionById, testGetQuestionsByTeacherId, testGetQuestionsByKnowledgeId
    }
  }
}
</script>

<style scoped>
.question-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 