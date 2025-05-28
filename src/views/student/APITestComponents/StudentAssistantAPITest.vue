<template>
  <div class="student-assistant-api-test">
    <h2>学生智能助理 API 测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>智能问答</span>
          <el-button type="primary" @click="testAskQuestion">执行测试</el-button>
        </div>
      </template>
      
      <el-form :model="questionForm" label-width="120px">
        <el-form-item label="问题">
          <el-input v-model="questionForm.question" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="课程（可选）">
          <el-input v-model="questionForm.courseName" placeholder="请输入课程名称" />
        </el-form-item>
      </el-form>
      
      <el-alert 
        v-if="assistantResult" 
        :type="assistantResult.success ? 'success' : 'error'"
        :title="assistantResult.message"
        show-icon
      />
      
      <pre v-if="assistantResult && assistantResult.data">
        {{ JSON.stringify(assistantResult.data, null, 2) }}
      </pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>提交练习答案</span>
          <el-input v-model="submitAnswersStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="submitAnswersExerciseId" placeholder="练习ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="submitAnswersJson" placeholder="答案对象JSON" style="width: 200px; margin-right: 5px;" />
          <el-button type="primary" @click="testSubmitExerciseAnswers">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSubmitAnswers">{{ resultSubmitAnswers }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取实时答题提示</span>
          <el-input v-model="hintStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="hintQuestionId" placeholder="题目ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="hintPartialAnswer" placeholder="当前作答内容" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetRealTimeHint">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultHint">{{ resultHint }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按知识点名称向智能助理提问</span>
          <el-input v-model="askByKnowledgeStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="askByKnowledgeQuestion" placeholder="问题" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="askByKnowledgeName" placeholder="知识点名称" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testAskQuestionByKnowledgeName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAskByKnowledge">{{ resultAskByKnowledge }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索历史提问</span>
          <el-input v-model="searchHistoryStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="searchHistoryKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="searchHistoryLimit" placeholder="返回条数(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchQuestionHistory">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchHistory">{{ resultSearchHistory }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取推荐学习资源</span>
          <el-input v-model="resourceStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="resourceKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="resourceType" placeholder="资源类型(可选)" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="resourceLimit" placeholder="返回条数(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchLearningResources">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultResource">{{ resultResource }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取历史提问记录</span>
          <el-input v-model="historyStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="historyLimit" placeholder="返回条数(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetQuestionHistory">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultHistory">{{ resultHistory }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>生成智能练习</span>
          <el-input v-model="exerciseStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="exerciseCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="exerciseKnowledgeIds" placeholder="知识点ID数组(逗号分隔)" style="width: 150px; margin-right: 5px;" />
          <el-input v-model="exerciseDifficulty" placeholder="难度等级(可选)" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="exerciseCount" placeholder="题目数量" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateExercise">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultExercise">{{ resultExercise }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>针对薄弱知识点生成练习</span>
          <el-input v-model="weakStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="weakCount" placeholder="题目数量" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateWeakPointsExercise">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultWeakExercise">{{ resultWeakExercise }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按知识点名称生成练习</span>
          <el-input v-model="byKnowledgeStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="byKnowledgeNames" placeholder="知识点名称数组(逗号分隔)" style="width: 150px; margin-right: 5px;" />
          <el-input v-model="byKnowledgeDifficulty" placeholder="难度等级(可选)" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="byKnowledgeCount" placeholder="题目数量" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateExerciseByKnowledgeNames">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultByKnowledgeExercise">{{ resultByKnowledgeExercise }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称生成练习</span>
          <el-input v-model="byCourseStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="byCourseName" placeholder="课程名称" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="byCourseDifficulty" placeholder="难度等级(可选)" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="byCourseCount" placeholder="题目数量" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateExerciseByCourseName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultByCourseExercise">{{ resultByCourseExercise }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { studentAssistantAPI, studentAPI } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'StudentAssistantAPITest',
  setup() {
    const questionForm = reactive({
      question: '',
      courseName: ''
    })
    
    const assistantResult = ref(null)
    
    const testAskQuestion = async () => {
      try {
        const studentInfo = await studentAPI.getSelfStudentInfo()
        let result
        if (questionForm.courseName) {
          result = await studentAssistantAPI.askQuestionByCourseName(
            studentInfo.studentId, 
            questionForm.question, 
            questionForm.courseName
          )
        } else {
          result = await studentAssistantAPI.askQuestion(
            studentInfo.studentId, 
            questionForm.question
          )
        }
        assistantResult.value = {
          success: true,
          message: '智能助理问答测试成功',
          data: result
        }
        ElMessage.success('智能助理问答测试成功')
      } catch (error) {
        assistantResult.value = {
          success: false,
          message: error.message || '智能助理问答测试失败'
        }
        ElMessage.error('智能助理问答测试失败')
      }
    }
    
    return {
      questionForm,
      assistantResult,
      testAskQuestion
    }
  }
}
</script>

<style scoped>
.student-assistant-api-test {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
}
</style> 