<template>
  <div class="student-exam-api-test">
    <h2>学生考试 API 测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生考试成绩</span>
          <el-button type="primary" @click="testGetStudentExamScores">执行测试</el-button>
        </div>
      </template>
      
      <el-alert 
        v-if="examResult" 
        :type="examResult.success ? 'success' : 'error'"
        :title="examResult.message"
        show-icon
      />
      
      <pre v-if="examResult && examResult.data">
        {{ JSON.stringify(examResult.data, null, 2) }}
      </pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>提交单份考试答卷</span>
          <el-input v-model="submitForm.examId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="submitForm.questionId" placeholder="题目ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="submitForm.studentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="submitForm.studentAnswer" placeholder="作答内容" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSubmitAnswer">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSubmitAnswer">{{ resultSubmitAnswer }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>批量提交考试答卷</span>
          <el-input v-model="batchSubmitJson" placeholder="答卷数组JSON" style="width: 300px; margin-right: 5px;" />
          <el-button type="primary" @click="testBatchSubmitAnswers">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultBatchSubmit">{{ resultBatchSubmit }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索考试及试题</span>
          <el-input v-model="searchStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="searchKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchExamsAndQuestions">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchExams">{{ resultSearchExams }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按关键词搜索学生考试成绩</span>
          <el-input v-model="scoreStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="scoreKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchStudentExamScores">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchScores">{{ resultSearchScores }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某场考试的所有答卷</span>
          <el-input v-model="answersStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="answersExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentExamAnswers">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultExamAnswers">{{ resultExamAnswers }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按题目内容搜索学生某场考试的答卷</span>
          <el-input v-model="contentStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="contentExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="contentKeyword" placeholder="题目内容关键词" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentAnswersByQuestionContent">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAnswersByContent">{{ resultAnswersByContent }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某场考试的总成绩</span>
          <el-input v-model="scoreExamStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="scoreExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetExamScore">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultExamScore">{{ resultExamScore }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某场考试某题的答卷</span>
          <el-input v-model="questionAnswerStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="questionAnswerExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="questionAnswerQuestionId" placeholder="题目ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentQuestionAnswer">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultQuestionAnswer">{{ resultQuestionAnswer }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某场考试详情</span>
          <el-input v-model="examDetailStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="examDetailExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetExamDetail">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultExamDetail">{{ resultExamDetail }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某场考试的智能分析</span>
          <el-input v-model="analyzeStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="analyzeExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testAnalyzeExamResult">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAnalyze">{{ resultAnalyze }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某场考试的学习建议</span>
          <el-input v-model="adviceStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="adviceExamId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLearningAdvice">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAdvice">{{ resultAdvice }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按考试标题获取学生答卷</span>
          <el-input v-model="answersByTitleStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="answersByTitle" placeholder="考试标题" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentExamAnswersByTitle">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAnswersByTitle">{{ resultAnswersByTitle }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按考试标题获取学生成绩</span>
          <el-input v-model="scoreByTitleStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="scoreByTitle" placeholder="考试标题" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetExamScoreByTitle">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultScoreByTitle">{{ resultScoreByTitle }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按考试标题获取考试详情</span>
          <el-input v-model="detailByTitleStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="detailByTitle" placeholder="考试标题" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetExamDetailByTitle">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultDetailByTitle">{{ resultDetailByTitle }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按考试标题获取智能分析</span>
          <el-input v-model="analyzeByTitleStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="analyzeByTitle" placeholder="考试标题" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testAnalyzeExamResultByTitle">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAnalyzeByTitle">{{ resultAnalyzeByTitle }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按考试标题获取学习建议</span>
          <el-input v-model="adviceByTitleStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="adviceByTitle" placeholder="考试标题" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLearningAdviceByTitle">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultAdviceByTitle">{{ resultAdviceByTitle }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>智能评测学生答卷（按内容）</span>
          <el-input v-model="evalContentStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="evalContentTitle" placeholder="考试标题" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="evalContent" placeholder="答案内容" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testIntelligentEvaluateAnswerByContent">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultEvalContent">{{ resultEvalContent }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>智能评测学生答卷（按答卷ID）</span>
          <el-input v-model="evalAnswerId" placeholder="答卷ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testIntelligentEvaluateAnswer">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultEvalAnswer">{{ resultEvalAnswer }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { studentExamAPI, studentAPI } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'StudentExamAPITest',
  setup() {
    const examResult = ref(null)
    const resultSubmitAnswer = ref(null)
    const resultBatchSubmit = ref(null)
    const resultSearchExams = ref(null)
    const resultSearchScores = ref(null)
    const resultExamAnswers = ref(null)
    const resultAnswersByContent = ref(null)
    const resultExamScore = ref(null)
    const resultQuestionAnswer = ref(null)
    const resultExamDetail = ref(null)
    const resultAnalyze = ref(null)
    const resultAdvice = ref(null)
    const resultAnswersByTitle = ref(null)
    const resultScoreByTitle = ref(null)
    const resultDetailByTitle = ref(null)
    const resultAnalyzeByTitle = ref(null)
    const resultAdviceByTitle = ref(null)
    const resultEvalContent = ref(null)
    const resultEvalAnswer = ref(null)
    
    const submitForm = ref({
      examId: '',
      questionId: '',
      studentId: '',
      studentAnswer: ''
    })
    
    const batchSubmitJson = ref('')
    
    const searchStudentId = ref('')
    const searchKeywords = ref('')
    
    const scoreStudentId = ref('')
    const scoreKeywords = ref('')
    
    const answersStudentId = ref('')
    const answersExamId = ref('')
    
    const contentStudentId = ref('')
    const contentExamId = ref('')
    const contentKeyword = ref('')
    
    const scoreExamStudentId = ref('')
    const scoreExamId = ref('')
    
    const questionAnswerStudentId = ref('')
    const questionAnswerExamId = ref('')
    const questionAnswerQuestionId = ref('')
    
    const examDetailStudentId = ref('')
    const examDetailExamId = ref('')
    
    const analyzeStudentId = ref('')
    const analyzeExamId = ref('')
    
    const adviceStudentId = ref('')
    const adviceExamId = ref('')
    
    const answersByTitleStudentId = ref('')
    const answersByTitle = ref('')
    
    const scoreByTitleStudentId = ref('')
    const scoreByTitle = ref('')
    
    const detailByTitleStudentId = ref('')
    const detailByTitle = ref('')
    
    const analyzeByTitleStudentId = ref('')
    const analyzeByTitle = ref('')
    
    const adviceByTitleStudentId = ref('')
    const adviceByTitle = ref('')
    
    const evalContentStudentId = ref('')
    const evalContentTitle = ref('')
    const evalContent = ref('')
    const evalAnswerId = ref('')
    
    const testGetStudentExamScores = async () => {
      try {
        const studentInfo = await studentAPI.getSelfStudentInfo()
        const result = await studentExamAPI.getStudentExamScores(studentInfo.studentId)
        
        examResult.value = {
          success: true,
          message: '获取学生考试成绩成功',
          data: result
        }
        
        ElMessage.success('学生考试成绩获取测试成功')
      } catch (error) {
        examResult.value = {
          success: false,
          message: error.message || '获取学生考试成绩失败'
        }
        
        ElMessage.error('学生考试成绩获取测试失败')
      }
    }
    
    const testSubmitAnswer = async () => {
      try {
        const result = await studentExamAPI.submitAnswer(submitForm.value)
        resultSubmitAnswer.value = result
        ElMessage.success('提交单份考试答卷测试成功')
      } catch (error) {
        resultSubmitAnswer.value = error.message || '提交单份考试答卷测试失败'
        ElMessage.error('提交单份考试答卷测试失败')
      }
    }
    
    const testBatchSubmitAnswers = async () => {
      try {
        const result = await studentExamAPI.batchSubmitAnswers(batchSubmitJson.value)
        resultBatchSubmit.value = result
        ElMessage.success('批量提交考试答卷测试成功')
      } catch (error) {
        resultBatchSubmit.value = error.message || '批量提交考试答卷测试失败'
        ElMessage.error('批量提交考试答卷测试失败')
      }
    }
    
    const testSearchExamsAndQuestions = async () => {
      try {
        const result = await studentExamAPI.searchExamsAndQuestions(searchStudentId.value, searchKeywords.value)
        resultSearchExams.value = result
        ElMessage.success('搜索考试及试题测试成功')
      } catch (error) {
        resultSearchExams.value = error.message || '搜索考试及试题测试失败'
        ElMessage.error('搜索考试及试题测试失败')
      }
    }
    
    const testSearchStudentExamScores = async () => {
      try {
        const result = await studentExamAPI.searchStudentExamScores(scoreStudentId.value, scoreKeywords.value)
        resultSearchScores.value = result
        ElMessage.success('按关键词搜索学生考试成绩测试成功')
      } catch (error) {
        resultSearchScores.value = error.message || '按关键词搜索学生考试成绩测试失败'
        ElMessage.error('按关键词搜索学生考试成绩测试失败')
      }
    }
    
    const testGetStudentExamAnswers = async () => {
      try {
        const result = await studentExamAPI.getStudentExamAnswers(answersStudentId.value, answersExamId.value)
        resultExamAnswers.value = result
        ElMessage.success('获取学生某场考试的所有答卷测试成功')
      } catch (error) {
        resultExamAnswers.value = error.message || '获取学生某场考试的所有答卷测试失败'
        ElMessage.error('获取学生某场考试的所有答卷测试失败')
      }
    }
    
    const testGetStudentAnswersByQuestionContent = async () => {
      try {
        const result = await studentExamAPI.getStudentAnswersByQuestionContent(contentStudentId.value, contentExamId.value, contentKeyword.value)
        resultAnswersByContent.value = result
        ElMessage.success('按题目内容搜索学生某场考试的答卷测试成功')
      } catch (error) {
        resultAnswersByContent.value = error.message || '按题目内容搜索学生某场考试的答卷测试失败'
        ElMessage.error('按题目内容搜索学生某场考试的答卷测试失败')
      }
    }
    
    const testGetExamScore = async () => {
      try {
        const result = await studentExamAPI.getExamScore(scoreExamStudentId.value, scoreExamId.value)
        resultExamScore.value = result
        ElMessage.success('获取学生某场考试的总成绩测试成功')
      } catch (error) {
        resultExamScore.value = error.message || '获取学生某场考试的总成绩测试失败'
        ElMessage.error('获取学生某场考试的总成绩测试失败')
      }
    }
    
    const testGetStudentQuestionAnswer = async () => {
      try {
        const result = await studentExamAPI.getStudentQuestionAnswer(questionAnswerStudentId.value, questionAnswerExamId.value, questionAnswerQuestionId.value)
        resultQuestionAnswer.value = result
        ElMessage.success('获取学生某场考试某题的答卷测试成功')
      } catch (error) {
        resultQuestionAnswer.value = error.message || '获取学生某场考试某题的答卷测试失败'
        ElMessage.error('获取学生某场考试某题的答卷测试失败')
      }
    }
    
    const testGetExamDetail = async () => {
      try {
        const result = await studentExamAPI.getExamDetail(examDetailStudentId.value, examDetailExamId.value)
        resultExamDetail.value = result
        ElMessage.success('获取学生某场考试详情测试成功')
      } catch (error) {
        resultExamDetail.value = error.message || '获取学生某场考试详情测试失败'
        ElMessage.error('获取学生某场考试详情测试失败')
      }
    }
    
    const testAnalyzeExamResult = async () => {
      try {
        const result = await studentExamAPI.analyzeExamResult(analyzeStudentId.value, analyzeExamId.value)
        resultAnalyze.value = result
        ElMessage.success('获取学生某场考试的智能分析测试成功')
      } catch (error) {
        resultAnalyze.value = error.message || '获取学生某场考试的智能分析测试失败'
        ElMessage.error('获取学生某场考试的智能分析测试失败')
      }
    }
    
    const testGenerateLearningAdvice = async () => {
      try {
        const result = await studentExamAPI.generateLearningAdvice(adviceStudentId.value, adviceExamId.value)
        resultAdvice.value = result
        ElMessage.success('获取学生某场考试的学习建议测试成功')
      } catch (error) {
        resultAdvice.value = error.message || '获取学生某场考试的学习建议测试失败'
        ElMessage.error('获取学生某场考试的学习建议测试失败')
      }
    }
    
    const testGetStudentExamAnswersByTitle = async () => {
      try {
        const result = await studentExamAPI.getStudentExamAnswersByTitle(answersByTitleStudentId.value, answersByTitle.value)
        resultAnswersByTitle.value = result
        ElMessage.success('按考试标题获取学生答卷测试成功')
      } catch (error) {
        resultAnswersByTitle.value = error.message || '按考试标题获取学生答卷测试失败'
        ElMessage.error('按考试标题获取学生答卷测试失败')
      }
    }
    
    const testGetExamScoreByTitle = async () => {
      try {
        const result = await studentExamAPI.getExamScoreByTitle(scoreByTitleStudentId.value, scoreByTitle.value)
        resultScoreByTitle.value = result
        ElMessage.success('按考试标题获取学生成绩测试成功')
      } catch (error) {
        resultScoreByTitle.value = error.message || '按考试标题获取学生成绩测试失败'
        ElMessage.error('按考试标题获取学生成绩测试失败')
      }
    }
    
    const testGetExamDetailByTitle = async () => {
      try {
        const result = await studentExamAPI.getExamDetailByTitle(detailByTitleStudentId.value, detailByTitle.value)
        resultDetailByTitle.value = result
        ElMessage.success('按考试标题获取考试详情测试成功')
      } catch (error) {
        resultDetailByTitle.value = error.message || '按考试标题获取考试详情测试失败'
        ElMessage.error('按考试标题获取考试详情测试失败')
      }
    }
    
    const testAnalyzeExamResultByTitle = async () => {
      try {
        const result = await studentExamAPI.analyzeExamResultByTitle(analyzeByTitleStudentId.value, analyzeByTitle.value)
        resultAnalyzeByTitle.value = result
        ElMessage.success('按考试标题获取智能分析测试成功')
      } catch (error) {
        resultAnalyzeByTitle.value = error.message || '按考试标题获取智能分析测试失败'
        ElMessage.error('按考试标题获取智能分析测试失败')
      }
    }
    
    const testGenerateLearningAdviceByTitle = async () => {
      try {
        const result = await studentExamAPI.generateLearningAdviceByTitle(adviceByTitleStudentId.value, adviceByTitle.value)
        resultAdviceByTitle.value = result
        ElMessage.success('按考试标题获取学习建议测试成功')
      } catch (error) {
        resultAdviceByTitle.value = error.message || '按考试标题获取学习建议测试失败'
        ElMessage.error('按考试标题获取学习建议测试失败')
      }
    }
    
    const testIntelligentEvaluateAnswerByContent = async () => {
      try {
        const result = await studentExamAPI.intelligentEvaluateAnswerByContent(evalContentStudentId.value, evalContentTitle.value, evalContent.value)
        resultEvalContent.value = result
        ElMessage.success('智能评测学生答卷（按内容）测试成功')
      } catch (error) {
        resultEvalContent.value = error.message || '智能评测学生答卷（按内容）测试失败'
        ElMessage.error('智能评测学生答卷（按内容）测试失败')
      }
    }
    
    const testIntelligentEvaluateAnswer = async () => {
      try {
        const result = await studentExamAPI.intelligentEvaluateAnswer(evalAnswerId.value)
        resultEvalAnswer.value = result
        ElMessage.success('智能评测学生答卷（按答卷ID）测试成功')
      } catch (error) {
        resultEvalAnswer.value = error.message || '智能评测学生答卷（按答卷ID）测试失败'
        ElMessage.error('智能评测学生答卷（按答卷ID）测试失败')
      }
    }
    
    return {
      examResult,
      resultSubmitAnswer,
      resultBatchSubmit,
      resultSearchExams,
      resultSearchScores,
      resultExamAnswers,
      resultAnswersByContent,
      resultExamScore,
      resultQuestionAnswer,
      resultExamDetail,
      resultAnalyze,
      resultAdvice,
      resultAnswersByTitle,
      resultScoreByTitle,
      resultDetailByTitle,
      resultAnalyzeByTitle,
      resultAdviceByTitle,
      resultEvalContent,
      resultEvalAnswer,
      submitForm,
      batchSubmitJson,
      searchStudentId,
      searchKeywords,
      scoreStudentId,
      scoreKeywords,
      answersStudentId,
      answersExamId,
      contentStudentId,
      contentExamId,
      contentKeyword,
      scoreExamStudentId,
      scoreExamId,
      questionAnswerStudentId,
      questionAnswerExamId,
      questionAnswerQuestionId,
      examDetailStudentId,
      examDetailExamId,
      analyzeStudentId,
      analyzeExamId,
      adviceStudentId,
      adviceExamId,
      answersByTitleStudentId,
      answersByTitle,
      scoreByTitleStudentId,
      scoreByTitle,
      detailByTitleStudentId,
      detailByTitle,
      analyzeByTitleStudentId,
      analyzeByTitle,
      adviceByTitleStudentId,
      adviceByTitle,
      evalContentStudentId,
      evalContentTitle,
      evalContent,
      evalAnswerId,
      testGetStudentExamScores,
      testSubmitAnswer,
      testBatchSubmitAnswers,
      testSearchExamsAndQuestions,
      testSearchStudentExamScores,
      testGetStudentExamAnswers,
      testGetStudentAnswersByQuestionContent,
      testGetExamScore,
      testGetStudentQuestionAnswer,
      testGetExamDetail,
      testAnalyzeExamResult,
      testGenerateLearningAdvice,
      testGetStudentExamAnswersByTitle,
      testGetExamScoreByTitle,
      testGetExamDetailByTitle,
      testAnalyzeExamResultByTitle,
      testGenerateLearningAdviceByTitle,
      testIntelligentEvaluateAnswerByContent,
      testIntelligentEvaluateAnswer
    }
  }
}
</script>

<style scoped>
.student-exam-api-test {
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