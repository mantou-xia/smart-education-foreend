<template>
  <div class="learning-progress-api-test">
    <h2>学习进度 API 测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生整体学习进度</span>
          <el-button type="primary" @click="testGetStudentProgress">执行测试</el-button>
        </div>
      </template>
      
      <el-alert 
        v-if="progressResult" 
        :type="progressResult.success ? 'success' : 'error'"
        :title="progressResult.message"
        show-icon
      />
      
      <pre v-if="progressResult && progressResult.data">
        {{ JSON.stringify(progressResult.data, null, 2) }}
      </pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新学习进度</span>
          <el-input v-model="progressForm.studentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="progressForm.courseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="progressForm.knowledgeId" placeholder="知识点ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="progressForm.masteryLevel" placeholder="掌握程度" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateLearningProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultUpdateProgress">{{ resultUpdateProgress }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>批量更新学习进度</span>
          <el-input v-model="batchProgressJson" placeholder="进度数组JSON" style="width: 300px; margin-right: 5px;" />
          <el-button type="primary" @click="testBatchUpdateLearningProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultBatchUpdate">{{ resultBatchUpdate }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新某学生某知识点的掌握程度</span>
          <el-input v-model="masteryStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="masteryKnowledgeId" placeholder="知识点ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="masteryScore" placeholder="分数" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateMasteryLevel">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultMastery">{{ resultMastery }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按知识点名称更新掌握程度</span>
          <el-input v-model="masteryByNameStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="masteryByName" placeholder="知识点名称" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="masteryByNameScore" placeholder="分数" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateMasteryLevelByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultMasteryByName">{{ resultMasteryByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生学习进度统计</span>
          <el-input v-model="statStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetProgressStatistics">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultStat">{{ resultStat }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取推荐学习资源</span>
          <el-input v-model="resourceStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="resourceLimit" placeholder="返回条数(可选)" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetRecommendedResources">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultResource">{{ resultResource }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索推荐学习资源</span>
          <el-input v-model="searchResourceStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="searchResourceKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="searchResourceLimit" placeholder="返回条数(可选)" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchRecommendedResources">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchResource">{{ resultSearchResource }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生整体进度</span>
          <el-input v-model="overallStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetOverallProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultOverall">{{ resultOverall }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某知识点的进度</span>
          <el-input v-model="knowledgeProgressStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="knowledgeProgressKnowledgeId" placeholder="知识点ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentKnowledgeProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultKnowledgeProgress">{{ resultKnowledgeProgress }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按知识点名称获取学生知识点进度</span>
          <el-input v-model="knowledgeByNameStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="knowledgeByName" placeholder="知识点名称" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentKnowledgeProgressByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultKnowledgeByName">{{ resultKnowledgeByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某课程的进度</span>
          <el-input v-model="courseProgressStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="courseProgressCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentCourseProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCourseProgress">{{ resultCourseProgress }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某课程的进度（对象形式）</span>
          <el-input v-model="courseObjProgressStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="courseObjProgressCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetCourseProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCourseObjProgress">{{ resultCourseObjProgress }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某课程的学习计划</span>
          <el-input v-model="planStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="planCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLearningPlan">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultPlan">{{ resultPlan }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某课程的进度统计</span>
          <el-input v-model="statByCourseStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="statByCourseCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetProgressStatisticsByCourse">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultStatByCourse">{{ resultStatByCourse }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称获取学生课程进度</span>
          <el-input v-model="courseByNameStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="courseByName" placeholder="课程名称" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentCourseProgressByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCourseByName">{{ resultCourseByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称获取学生课程进度（对象形式）</span>
          <el-input v-model="courseObjByNameStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="courseObjByName" placeholder="课程名称" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetCourseProgressByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCourseObjByName">{{ resultCourseObjByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称获取学生学习计划</span>
          <el-input v-model="planByCourseNameStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="planByCourseName" placeholder="课程名称" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="planByCourseDays" placeholder="天数" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLearningPlanByCourseName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultPlanByCourseName">{{ resultPlanByCourseName }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { learningProgressAPI, studentAPI } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'LearningProgressAPITest',
  setup() {
    const progressResult = ref(null)
    const progressForm = ref({})
    const batchProgressJson = ref('')
    const masteryStudentId = ref('')
    const masteryKnowledgeId = ref('')
    const masteryScore = ref('')
    const masteryByNameStudentId = ref('')
    const masteryByName = ref('')
    const masteryByNameScore = ref('')
    const statStudentId = ref('')
    const resourceStudentId = ref('')
    const resourceLimit = ref('')
    const searchResourceStudentId = ref('')
    const searchResourceKeywords = ref('')
    const searchResourceLimit = ref('')
    const overallStudentId = ref('')
    const knowledgeProgressStudentId = ref('')
    const knowledgeProgressKnowledgeId = ref('')
    const knowledgeByNameStudentId = ref('')
    const knowledgeByName = ref('')
    const courseProgressStudentId = ref('')
    const courseProgressCourseId = ref('')
    const courseObjProgressStudentId = ref('')
    const courseObjProgressCourseId = ref('')
    const planStudentId = ref('')
    const planCourseId = ref('')
    const statByCourseStudentId = ref('')
    const statByCourseCourseId = ref('')
    const courseByNameStudentId = ref('')
    const courseByName = ref('')
    const courseObjByNameStudentId = ref('')
    const courseObjByName = ref('')
    const planByCourseNameStudentId = ref('')
    const planByCourseName = ref('')
    const planByCourseDays = ref('')
    const resultUpdateProgress = ref(null)
    const resultBatchUpdate = ref(null)
    const resultMastery = ref(null)
    const resultMasteryByName = ref(null)
    const resultStat = ref(null)
    const resultResource = ref(null)
    const resultSearchResource = ref(null)
    const resultOverall = ref(null)
    const resultKnowledgeProgress = ref(null)
    const resultKnowledgeByName = ref(null)
    const resultCourseProgress = ref(null)
    const resultCourseObjProgress = ref(null)
    const resultPlan = ref(null)
    const resultStatByCourse = ref(null)
    const resultCourseByName = ref(null)
    const resultCourseObjByName = ref(null)
    const resultPlanByCourseName = ref(null)
    
    const testGetStudentProgress = async () => {
      try {
        const studentInfo = await studentAPI.getSelfStudentInfo()
        const result = await learningProgressAPI.getStudentProgress(studentInfo.studentId)
        
        progressResult.value = {
          success: true,
          message: '获取学习进度成功',
          data: result
        }
        
        ElMessage.success('学习进度获取测试成功')
      } catch (error) {
        progressResult.value = {
          success: false,
          message: error.message || '获取学习进度失败'
        }
        
        ElMessage.error('学习进度获取测试失败')
      }
    }
    
    const testUpdateLearningProgress = async () => {
      try {
        const result = await learningProgressAPI.updateLearningProgress(progressForm.value)
        resultUpdateProgress.value = result
        ElMessage.success('学习进度更新测试成功')
      } catch (error) {
        resultUpdateProgress.value = error.message || '学习进度更新测试失败'
        ElMessage.error('学习进度更新测试失败')
      }
    }
    
    const testBatchUpdateLearningProgress = async () => {
      try {
        const result = await learningProgressAPI.batchUpdateLearningProgress(batchProgressJson.value)
        resultBatchUpdate.value = result
        ElMessage.success('学习进度批量更新测试成功')
      } catch (error) {
        resultBatchUpdate.value = error.message || '学习进度批量更新测试失败'
        ElMessage.error('学习进度批量更新测试失败')
      }
    }
    
    const testUpdateMasteryLevel = async () => {
      try {
        const result = await learningProgressAPI.updateMasteryLevel(masteryStudentId.value, masteryKnowledgeId.value, masteryScore.value)
        resultMastery.value = result
        ElMessage.success('学习进度更新测试成功')
      } catch (error) {
        resultMastery.value = error.message || '学习进度更新测试失败'
        ElMessage.error('学习进度更新测试失败')
      }
    }
    
    const testUpdateMasteryLevelByName = async () => {
      try {
        const result = await learningProgressAPI.updateMasteryLevelByName(masteryByNameStudentId.value, masteryByName.value, masteryByNameScore.value)
        resultMasteryByName.value = result
        ElMessage.success('学习进度更新测试成功')
      } catch (error) {
        resultMasteryByName.value = error.message || '学习进度更新测试失败'
        ElMessage.error('学习进度更新测试失败')
      }
    }
    
    const testGetProgressStatistics = async () => {
      try {
        const result = await learningProgressAPI.getProgressStatistics(statStudentId.value)
        resultStat.value = result
        ElMessage.success('学习进度统计获取测试成功')
      } catch (error) {
        resultStat.value = error.message || '学习进度统计获取测试失败'
        ElMessage.error('学习进度统计获取测试失败')
      }
    }
    
    const testGetRecommendedResources = async () => {
      try {
        const result = await learningProgressAPI.getRecommendedResources(resourceStudentId.value, resourceLimit.value)
        resultResource.value = result
        ElMessage.success('学习资源推荐获取测试成功')
      } catch (error) {
        resultResource.value = error.message || '学习资源推荐获取测试失败'
        ElMessage.error('学习资源推荐获取测试失败')
      }
    }
    
    const testSearchRecommendedResources = async () => {
      try {
        const result = await learningProgressAPI.searchRecommendedResources(searchResourceStudentId.value, searchResourceKeywords.value, searchResourceLimit.value)
        resultSearchResource.value = result
        ElMessage.success('学习资源搜索测试成功')
      } catch (error) {
        resultSearchResource.value = error.message || '学习资源搜索测试失败'
        ElMessage.error('学习资源搜索测试失败')
      }
    }
    
    const testGetOverallProgress = async () => {
      try {
        const result = await learningProgressAPI.getOverallProgress(overallStudentId.value)
        resultOverall.value = result
        ElMessage.success('学习进度整体获取测试成功')
      } catch (error) {
        resultOverall.value = error.message || '学习进度整体获取测试失败'
        ElMessage.error('学习进度整体获取测试失败')
      }
    }
    
    const testGetStudentKnowledgeProgress = async () => {
      try {
        const result = await learningProgressAPI.getStudentKnowledgeProgress(knowledgeProgressStudentId.value, knowledgeProgressKnowledgeId.value)
        resultKnowledgeProgress.value = result
        ElMessage.success('学生知识点进度获取测试成功')
      } catch (error) {
        resultKnowledgeProgress.value = error.message || '学生知识点进度获取测试失败'
        ElMessage.error('学生知识点进度获取测试失败')
      }
    }
    
    const testGetStudentKnowledgeProgressByName = async () => {
      try {
        const result = await learningProgressAPI.getStudentKnowledgeProgressByName(knowledgeByNameStudentId.value, knowledgeByName.value)
        resultKnowledgeByName.value = result
        ElMessage.success('按知识点名称获取学生知识点进度测试成功')
      } catch (error) {
        resultKnowledgeByName.value = error.message || '按知识点名称获取学生知识点进度测试失败'
        ElMessage.error('按知识点名称获取学生知识点进度测试失败')
      }
    }
    
    const testGetStudentCourseProgress = async () => {
      try {
        const result = await learningProgressAPI.getStudentCourseProgress(courseProgressStudentId.value, courseProgressCourseId.value)
        resultCourseProgress.value = result
        ElMessage.success('学生课程进度获取测试成功')
      } catch (error) {
        resultCourseProgress.value = error.message || '学生课程进度获取测试失败'
        ElMessage.error('学生课程进度获取测试失败')
      }
    }
    
    const testGetCourseProgress = async () => {
      try {
        const result = await learningProgressAPI.getCourseProgress(courseObjProgressStudentId.value, courseObjProgressCourseId.value)
        resultCourseObjProgress.value = result
        ElMessage.success('学生课程进度（对象形式）获取测试成功')
      } catch (error) {
        resultCourseObjProgress.value = error.message || '学生课程进度（对象形式）获取测试失败'
        ElMessage.error('学生课程进度（对象形式）获取测试失败')
      }
    }
    
    const testGenerateLearningPlan = async () => {
      try {
        const result = await learningProgressAPI.generateLearningPlan(planStudentId.value, planCourseId.value)
        resultPlan.value = result
        ElMessage.success('学生课程学习计划获取测试成功')
      } catch (error) {
        resultPlan.value = error.message || '学生课程学习计划获取测试失败'
        ElMessage.error('学生课程学习计划获取测试失败')
      }
    }
    
    const testGetProgressStatisticsByCourse = async () => {
      try {
        const result = await learningProgressAPI.getProgressStatisticsByCourse(statByCourseStudentId.value, statByCourseCourseId.value)
        resultStatByCourse.value = result
        ElMessage.success('学生课程进度统计获取测试成功')
      } catch (error) {
        resultStatByCourse.value = error.message || '学生课程进度统计获取测试失败'
        ElMessage.error('学生课程进度统计获取测试失败')
      }
    }
    
    const testGetStudentCourseProgressByName = async () => {
      try {
        const result = await learningProgressAPI.getStudentCourseProgressByName(courseByNameStudentId.value, courseByName.value)
        resultCourseByName.value = result
        ElMessage.success('按课程名称获取学生课程进度测试成功')
      } catch (error) {
        resultCourseByName.value = error.message || '按课程名称获取学生课程进度测试失败'
        ElMessage.error('按课程名称获取学生课程进度测试失败')
      }
    }
    
    const testGetCourseProgressByName = async () => {
      try {
        const result = await learningProgressAPI.getCourseProgressByName(courseObjByNameStudentId.value, courseObjByName.value)
        resultCourseObjByName.value = result
        ElMessage.success('按课程名称获取学生课程进度（对象形式）测试成功')
      } catch (error) {
        resultCourseObjByName.value = error.message || '按课程名称获取学生课程进度（对象形式）测试失败'
        ElMessage.error('按课程名称获取学生课程进度（对象形式）测试失败')
      }
    }
    
    const testGenerateLearningPlanByCourseName = async () => {
      try {
        const result = await learningProgressAPI.generateLearningPlanByCourseName(planByCourseNameStudentId.value, planByCourseName.value, planByCourseDays.value)
        resultPlanByCourseName.value = result
        ElMessage.success('按课程名称获取学生学习计划测试成功')
      } catch (error) {
        resultPlanByCourseName.value = error.message || '按课程名称获取学生学习计划测试失败'
        ElMessage.error('按课程名称获取学生学习计划测试失败')
      }
    }
    
    return {
      progressResult,
      progressForm,
      batchProgressJson,
      masteryStudentId,
      masteryKnowledgeId,
      masteryScore,
      masteryByNameStudentId,
      masteryByName,
      masteryByNameScore,
      statStudentId,
      resourceStudentId,
      resourceLimit,
      searchResourceStudentId,
      searchResourceKeywords,
      searchResourceLimit,
      overallStudentId,
      knowledgeProgressStudentId,
      knowledgeProgressKnowledgeId,
      knowledgeByNameStudentId,
      knowledgeByName,
      courseProgressStudentId,
      courseProgressCourseId,
      courseObjProgressStudentId,
      courseObjProgressCourseId,
      planStudentId,
      planCourseId,
      statByCourseStudentId,
      statByCourseCourseId,
      courseByNameStudentId,
      courseByName,
      courseObjByNameStudentId,
      courseObjByName,
      planByCourseNameStudentId,
      planByCourseName,
      planByCourseDays,
      resultUpdateProgress,
      resultBatchUpdate,
      resultMastery,
      resultMasteryByName,
      resultStat,
      resultResource,
      resultSearchResource,
      resultOverall,
      resultKnowledgeProgress,
      resultKnowledgeByName,
      resultCourseProgress,
      resultCourseObjProgress,
      resultPlan,
      resultStatByCourse,
      resultCourseByName,
      resultCourseObjByName,
      resultPlanByCourseName,
      testGetStudentProgress,
      testUpdateLearningProgress,
      testBatchUpdateLearningProgress,
      testUpdateMasteryLevel,
      testUpdateMasteryLevelByName,
      testGetProgressStatistics,
      testGetRecommendedResources,
      testSearchRecommendedResources,
      testGetOverallProgress,
      testGetStudentKnowledgeProgress,
      testGetStudentKnowledgeProgressByName,
      testGetStudentCourseProgress,
      testGetCourseProgress,
      testGenerateLearningPlan,
      testGetProgressStatisticsByCourse,
      testGetStudentCourseProgressByName,
      testGetCourseProgressByName,
      testGenerateLearningPlanByCourseName
    }
  }
}
</script>

<style scoped>
.learning-progress-api-test {
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