<template>
  <div class="question-api-test">
    <h2>题目 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>新增题目</span>
          <el-input v-model="saveData.teacherId" placeholder="教师ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.content" placeholder="内容" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="saveData.questionType" placeholder="类型" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.difficulty" placeholder="难度" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.knowledgeId" placeholder="知识点ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.referenceAnswer" placeholder="参考答案" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="saveData.scorePoints" placeholder="分值" style="width: 60px; margin-right: 5px;" />
          <el-input v-model="saveData.answer" placeholder="答案" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveQuestion">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新题目</span>
          <el-input v-model="updateData.questionId" placeholder="题目ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.content" placeholder="内容" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateData.questionType" placeholder="类型" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.difficulty" placeholder="难度" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.referenceAnswer" placeholder="参考答案" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="updateData.scorePoints" placeholder="分值" style="width: 60px; margin-right: 5px;" />
          <el-input v-model="updateData.answer" placeholder="答案" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateQuestion">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>删除题目</span>
          <el-input v-model="deleteId" placeholder="题目ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="danger" @click="testDeleteQuestionById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取题目</span>
          <el-input v-model="questionId" placeholder="题目ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetQuestionById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result4">{{ result4 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据教师ID获取题目</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetQuestionsByTeacherId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result5">{{ result5 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据知识点ID获取题目</span>
          <el-input v-model="knowledgeId" placeholder="知识点ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetQuestionsByKnowledgeId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result6">{{ result6 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>知识点内按内容关键词搜索题目</span>
          <el-input v-model="searchKnowledgeId" placeholder="知识点ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="searchKeyword" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchQuestionsInKnowledge">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result7">{{ result7 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>知识点内按条件搜索题目</span>
          <el-input v-model="condKnowledgeId" placeholder="知识点ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="condType" placeholder="类型" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="condDifficulty" placeholder="难度" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="condStartTime" placeholder="起始时间" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="condEndTime" placeholder="结束时间" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchQuestionsInKnowledgeConditionally">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result8">{{ result8 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { questionAPI } from '@/api/api'

export default {
  name: 'QuestionAPITest',
  setup() {
    const saveData = reactive({ teacherId: '', content: '', questionType: '', difficulty: '', knowledgeId: '', referenceAnswer: '', scorePoints: '', answer: '' })
    const updateData = reactive({ questionId: '', content: '', questionType: '', difficulty: '', referenceAnswer: '', scorePoints: '', answer: '' })
    const deleteId = ref('')
    const questionId = ref('')
    const teacherId = ref('')
    const knowledgeId = ref('')
    const searchKnowledgeId = ref('')
    const searchKeyword = ref('')
    const condKnowledgeId = ref('')
    const condType = ref('')
    const condDifficulty = ref('')
    const condStartTime = ref('')
    const condEndTime = ref('')
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')
    const result4 = ref('')
    const result5 = ref('')
    const result6 = ref('')
    const result7 = ref('')
    const result8 = ref('')

    const testSaveQuestion = async () => {
      result1.value = JSON.stringify(await questionAPI.saveQuestion(saveData), null, 2)
    }
    const testUpdateQuestion = async () => {
      result2.value = JSON.stringify(await questionAPI.updateQuestion(updateData), null, 2)
    }
    const testDeleteQuestionById = async () => {
      result3.value = JSON.stringify(await questionAPI.deleteQuestionById(deleteId.value), null, 2)
    }
    const testGetQuestionById = async () => {
      result4.value = JSON.stringify(await questionAPI.getQuestionById(questionId.value), null, 2)
    }
    const testGetQuestionsByTeacherId = async () => {
      result5.value = JSON.stringify(await questionAPI.getQuestionsByTeacherId(teacherId.value), null, 2)
    }
    const testGetQuestionsByKnowledgeId = async () => {
      result6.value = JSON.stringify(await questionAPI.getQuestionsByKnowledgeId(knowledgeId.value), null, 2)
    }
    const testSearchQuestionsInKnowledge = async () => {
      result7.value = JSON.stringify(await questionAPI.searchQuestionsInKnowledge(searchKnowledgeId.value, searchKeyword.value), null, 2)
    }
    const testSearchQuestionsInKnowledgeConditionally = async () => {
      const dto = {}
      if (condType.value) dto.questionType = condType.value
      if (condDifficulty.value) dto.difficulty = condDifficulty.value
      if (condStartTime.value) dto.startTime = condStartTime.value
      if (condEndTime.value) dto.endTime = condEndTime.value
      result8.value = JSON.stringify(await questionAPI.searchQuestionsInKnowledgeConditionally(condKnowledgeId.value, dto), null, 2)
    }

    return {
      saveData, updateData, deleteId, questionId, teacherId, knowledgeId, searchKnowledgeId, searchKeyword,
      condKnowledgeId, condType, condDifficulty, condStartTime, condEndTime,
      result1, result2, result3, result4, result5, result6, result7, result8,
      testSaveQuestion, testUpdateQuestion, testDeleteQuestionById, testGetQuestionById,
      testGetQuestionsByTeacherId, testGetQuestionsByKnowledgeId, testSearchQuestionsInKnowledge, testSearchQuestionsInKnowledgeConditionally
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