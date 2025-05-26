<template>
  <div class="learning-plan-api-test">
    <h2>学习计划 API 测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>生成学习计划</span>
          <el-button type="primary" @click="testGenerateLearningPlan">执行测试</el-button>
        </div>
      </template>
      
      <el-form :model="planForm" label-width="120px">
        <el-form-item label="目标">
          <el-input v-model="planForm.targetGoal" placeholder="请输入学习目标" />
        </el-form-item>
        <el-form-item label="时间范围（天）">
          <el-input-number v-model="planForm.timeFrame" :min="1" :max="365" />
        </el-form-item>
      </el-form>
      
      <el-alert 
        v-if="planResult" 
        :type="planResult.success ? 'success' : 'error'"
        :title="planResult.message"
        show-icon
      />
      
      <pre v-if="planResult && planResult.data">
        {{ JSON.stringify(planResult.data, null, 2) }}
      </pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新学习计划进度</span>
          <el-input v-model="progressForm.planId" placeholder="计划ID" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="progressForm.activityId" placeholder="活动ID" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="progressForm.status" placeholder="状态" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="progressForm.feedback" placeholder="反馈(可选)" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdatePlanProgress">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultUpdatePlanProgress">{{ resultUpdatePlanProgress }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学习计划推荐资源</span>
          <el-input v-model="planResourceId" placeholder="计划ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetPlanRecommendedResources">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultPlanResources">{{ resultPlanResources }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索学习计划</span>
          <el-input v-model="searchStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="searchKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchLearningPlans">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchPlans">{{ resultSearchPlans }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索学习计划推荐资源</span>
          <el-input v-model="searchResourceStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="searchResourceKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchPlanResources">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchPlanResources">{{ resultSearchPlanResources }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据计划名称获取推荐资源</span>
          <el-input v-model="planNameStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="planName" placeholder="计划名称" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetPlanResourcesByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultPlanResourcesByName">{{ resultPlanResourcesByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学习计划历史</span>
          <el-input v-model="historyStudentId" placeholder="学生ID" style="width: 100px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetLearningPlanHistory">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultHistory">{{ resultHistory }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>通过知识点名称生成学习计划</span>
          <el-input v-model="knowledgePlanStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="knowledgePlanTargetGoal" placeholder="目标" style="width: 100px; margin-right: 5px;" />
          <el-input-number v-model="knowledgePlanTimeFrame" :min="1" :max="365" style="margin-right: 5px;" />
          <el-input v-model="knowledgeNames" placeholder="知识点名称(逗号分隔)" style="width: 180px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLearningPlanByKnowledgeName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultKnowledgePlan">{{ resultKnowledgePlan }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>通过课程名称生成学习计划</span>
          <el-input v-model="coursePlanStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="coursePlanTargetGoal" placeholder="目标" style="width: 100px; margin-right: 5px;" />
          <el-input-number v-model="coursePlanTimeFrame" :min="1" :max="365" style="margin-right: 5px;" />
          <el-input v-model="courseNames" placeholder="课程名称(逗号分隔)" style="width: 180px; margin-right: 5px;" />
          <el-button type="primary" @click="testGenerateLearningPlanByCourseName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCoursePlan">{{ resultCoursePlan }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取每日学习计划活动</span>
          <el-input v-model="dailyPlanStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="dailyPlanDate" placeholder="日期(YYYY-MM-DD)" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetDailyPlanActivities">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultDailyPlan">{{ resultDailyPlan }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>通过计划名称获取每日学习计划</span>
          <el-input v-model="dailyPlanByNameStudentId" placeholder="学生ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="dailyPlanByNamePlanName" placeholder="计划名称" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="dailyPlanByNameDate" placeholder="日期(YYYY-MM-DD)" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetDailyPlanByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultDailyPlanByName">{{ resultDailyPlanByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取当前学习计划</span>
          <el-input v-model="currentPlanStudentId" placeholder="学生ID" style="width: 100px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetCurrentLearningPlan">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCurrentPlan">{{ resultCurrentPlan }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { learningPlanAPI, studentAPI } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'LearningPlanAPITest',
  setup() {
    const planForm = reactive({
      targetGoal: '提高编程能力',
      timeFrame: 30
    })
    
    const planResult = ref(null)
    
    const testGenerateLearningPlan = async () => {
      try {
        const studentInfo = await studentAPI.getSelfStudentInfo()
        const result = await learningPlanAPI.generateLearningPlan(
          studentInfo.studentId, 
          planForm.targetGoal, 
          planForm.timeFrame
        )
        
        planResult.value = {
          success: true,
          message: '生成学习计划成功',
          data: result
        }
        
        ElMessage.success('学习计划生成测试成功')
      } catch (error) {
        planResult.value = {
          success: false,
          message: error.message || '生成学习计划失败'
        }
        
        ElMessage.error('学习计划生成测试失败')
      }
    }
    
    // 更新学习计划进度
    const progressForm = reactive({ planId: '', activityId: '', status: '', feedback: '' })
    const resultUpdatePlanProgress = ref('')
    // 获取推荐资源
    const planResourceId = ref('')
    const resultPlanResources = ref('')
    // 搜索学习计划
    const searchStudentId = ref('')
    const searchKeywords = ref('')
    const resultSearchPlans = ref('')
    // 搜索推荐资源
    const searchResourceStudentId = ref('')
    const searchResourceKeywords = ref('')
    const resultSearchPlanResources = ref('')
    // 根据计划名称获取推荐资源
    const planNameStudentId = ref('')
    const planName = ref('')
    const resultPlanResourcesByName = ref('')
    // 历史
    const historyStudentId = ref('')
    const resultHistory = ref('')
    // 通过知识点名称生成
    const knowledgePlanStudentId = ref('')
    const knowledgePlanTargetGoal = ref('')
    const knowledgePlanTimeFrame = ref(30)
    const knowledgeNames = ref('')
    const resultKnowledgePlan = ref('')
    // 通过课程名称生成
    const coursePlanStudentId = ref('')
    const coursePlanTargetGoal = ref('')
    const coursePlanTimeFrame = ref(30)
    const courseNames = ref('')
    const resultCoursePlan = ref('')
    // 每日计划
    const dailyPlanStudentId = ref('')
    const dailyPlanDate = ref('')
    const resultDailyPlan = ref('')
    // 通过计划名称获取每日计划
    const dailyPlanByNameStudentId = ref('')
    const dailyPlanByNamePlanName = ref('')
    const dailyPlanByNameDate = ref('')
    const resultDailyPlanByName = ref('')
    // 当前计划
    const currentPlanStudentId = ref('')
    const resultCurrentPlan = ref('')

    const testUpdatePlanProgress = async () => {
      try {
        const res = await learningPlanAPI.updatePlanProgress(progressForm)
        resultUpdatePlanProgress.value = JSON.stringify(res, null, 2)
        ElMessage.success('更新成功')
      } catch (e) {
        resultUpdatePlanProgress.value = e.message
        ElMessage.error('更新失败')
      }
    }
    const testGetPlanRecommendedResources = async () => {
      try {
        const res = await learningPlanAPI.getPlanRecommendedResources(planResourceId.value)
        resultPlanResources.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultPlanResources.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testSearchLearningPlans = async () => {
      try {
        const res = await learningPlanAPI.searchLearningPlans(searchStudentId.value, searchKeywords.value)
        resultSearchPlans.value = JSON.stringify(res, null, 2)
        ElMessage.success('搜索成功')
      } catch (e) {
        resultSearchPlans.value = e.message
        ElMessage.error('搜索失败')
      }
    }
    const testSearchPlanResources = async () => {
      try {
        const res = await learningPlanAPI.searchPlanResources(searchResourceStudentId.value, searchResourceKeywords.value)
        resultSearchPlanResources.value = JSON.stringify(res, null, 2)
        ElMessage.success('搜索成功')
      } catch (e) {
        resultSearchPlanResources.value = e.message
        ElMessage.error('搜索失败')
      }
    }
    const testGetPlanResourcesByName = async () => {
      try {
        const res = await learningPlanAPI.getPlanResourcesByName(planNameStudentId.value, planName.value)
        resultPlanResourcesByName.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultPlanResourcesByName.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGetLearningPlanHistory = async () => {
      try {
        const res = await learningPlanAPI.getLearningPlanHistory(historyStudentId.value)
        resultHistory.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultHistory.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGenerateLearningPlanByKnowledgeName = async () => {
      try {
        const names = knowledgeNames.value.split(',').map(s => s.trim()).filter(Boolean)
        const res = await learningPlanAPI.generateLearningPlanByKnowledgeName(
          knowledgePlanStudentId.value,
          knowledgePlanTargetGoal.value,
          knowledgePlanTimeFrame.value,
          names
        )
        resultKnowledgePlan.value = JSON.stringify(res, null, 2)
        ElMessage.success('生成成功')
      } catch (e) {
        resultKnowledgePlan.value = e.message
        ElMessage.error('生成失败')
      }
    }
    const testGenerateLearningPlanByCourseName = async () => {
      try {
        const names = courseNames.value.split(',').map(s => s.trim()).filter(Boolean)
        const res = await learningPlanAPI.generateLearningPlanByCourseName(
          coursePlanStudentId.value,
          coursePlanTargetGoal.value,
          coursePlanTimeFrame.value,
          names
        )
        resultCoursePlan.value = JSON.stringify(res, null, 2)
        ElMessage.success('生成成功')
      } catch (e) {
        resultCoursePlan.value = e.message
        ElMessage.error('生成失败')
      }
    }
    const testGetDailyPlanActivities = async () => {
      try {
        const res = await learningPlanAPI.getDailyPlanActivities(dailyPlanStudentId.value, dailyPlanDate.value)
        resultDailyPlan.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultDailyPlan.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGetDailyPlanByName = async () => {
      try {
        const res = await learningPlanAPI.getDailyPlanByName(dailyPlanByNameStudentId.value, dailyPlanByNamePlanName.value, dailyPlanByNameDate.value)
        resultDailyPlanByName.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultDailyPlanByName.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGetCurrentLearningPlan = async () => {
      try {
        const res = await learningPlanAPI.getCurrentLearningPlan(currentPlanStudentId.value)
        resultCurrentPlan.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultCurrentPlan.value = e.message
        ElMessage.error('获取失败')
      }
    }
    
    return {
      planForm,
      planResult,
      testGenerateLearningPlan,
      progressForm, resultUpdatePlanProgress, testUpdatePlanProgress,
      planResourceId, resultPlanResources, testGetPlanRecommendedResources,
      searchStudentId, searchKeywords, resultSearchPlans, testSearchLearningPlans,
      searchResourceStudentId, searchResourceKeywords, resultSearchPlanResources, testSearchPlanResources,
      planNameStudentId, planName, resultPlanResourcesByName, testGetPlanResourcesByName,
      historyStudentId, resultHistory, testGetLearningPlanHistory,
      knowledgePlanStudentId, knowledgePlanTargetGoal, knowledgePlanTimeFrame, knowledgeNames, resultKnowledgePlan, testGenerateLearningPlanByKnowledgeName,
      coursePlanStudentId, coursePlanTargetGoal, coursePlanTimeFrame, courseNames, resultCoursePlan, testGenerateLearningPlanByCourseName,
      dailyPlanStudentId, dailyPlanDate, resultDailyPlan, testGetDailyPlanActivities,
      dailyPlanByNameStudentId, dailyPlanByNamePlanName, dailyPlanByNameDate, resultDailyPlanByName, testGetDailyPlanByName,
      currentPlanStudentId, resultCurrentPlan, testGetCurrentLearningPlan
    }
  }
}
</script>

<style scoped>
.learning-plan-api-test {
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