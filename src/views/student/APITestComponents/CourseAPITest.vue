<template>
  <div class="course-api-test">
    <h2>课程 API 测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取所有课程</span>
          <el-button type="primary" @click="testGetAllCourses">执行测试</el-button>
        </div>
      </template>
      
      <el-alert 
        v-if="coursesResult" 
        :type="coursesResult.success ? 'success' : 'error'"
        :title="coursesResult.message"
        show-icon
      />
      
      <pre v-if="coursesResult && coursesResult.data">
        {{ JSON.stringify(coursesResult.data, null, 2) }}
      </pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>新增/更新课程</span>
          <el-input v-model="courseForm.id" placeholder="课程ID(可选)" style="width: 90px; margin-right: 5px;" />
          <el-input v-model="courseForm.name" placeholder="课程名称" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="courseForm.code" placeholder="课程编码" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="courseForm.description" placeholder="描述" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="courseForm.credit" placeholder="学分" style="width: 60px; margin-right: 5px;" />
          <el-input v-model="courseForm.category" placeholder="类别" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveOrUpdateCourse">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSaveOrUpdateCourse">{{ resultSaveOrUpdateCourse }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID获取课程</span>
          <el-input v-model="getById" placeholder="课程ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetCourseById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetById">{{ resultGetById }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>删除课程</span>
          <el-input v-model="deleteId" placeholder="课程ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testDeleteCourse">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultDeleteCourse">{{ resultDeleteCourse }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索课程</span>
          <el-input v-model="searchKeywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="searchCategory" placeholder="类别(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchCourses">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchCourses">{{ resultSearchCourses }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按名称模糊搜索课程</span>
          <el-input v-model="nameLike" placeholder="课程名称" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetCoursesByNameLike">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultNameLike">{{ resultNameLike }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程名称获取课程</span>
          <el-input v-model="getByName" placeholder="课程名称" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetCourseByName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetByName">{{ resultGetByName }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程编码获取课程</span>
          <el-input v-model="getByCode" placeholder="课程编码" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetCourseByCode">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetByCode">{{ resultGetByCode }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程类别获取课程列表</span>
          <el-input v-model="getByCategory" placeholder="课程类别" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetCoursesByCategory">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetByCategory">{{ resultGetByCategory }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>批量删除课程</span>
          <el-input v-model="batchDeleteIds" placeholder="课程ID,逗号分隔" style="width: 220px; margin-right: 10px;" />
          <el-button type="primary" @click="testBatchDeleteCourses">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultBatchDelete">{{ resultBatchDelete }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { courseAPI } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'CourseAPITest',
  setup() {
    const coursesResult = ref(null)
    
    const testGetAllCourses = async () => {
      try {
        const result = await courseAPI.getAllCourses()
        
        coursesResult.value = {
          success: true,
          message: '获取所有课程成功',
          data: result
        }
        
        ElMessage.success('课程获取测试成功')
      } catch (error) {
        coursesResult.value = {
          success: false,
          message: error.message || '获取课程失败'
        }
        
        ElMessage.error('课程获取测试失败')
      }
    }
    
    // 新增/更新课程
    const courseForm = reactive({ id: '', name: '', code: '', description: '', credit: '', category: '' })
    const resultSaveOrUpdateCourse = ref('')
    // 根据ID获取课程
    const getById = ref('')
    const resultGetById = ref('')
    // 删除课程
    const deleteId = ref('')
    const resultDeleteCourse = ref('')
    // 搜索课程
    const searchKeywords = ref('')
    const searchCategory = ref('')
    const resultSearchCourses = ref('')
    // 按名称模糊搜索
    const nameLike = ref('')
    const resultNameLike = ref('')
    // 根据名称获取
    const getByName = ref('')
    const resultGetByName = ref('')
    // 根据编码获取
    const getByCode = ref('')
    const resultGetByCode = ref('')
    // 根据类别获取
    const getByCategory = ref('')
    const resultGetByCategory = ref('')
    // 批量删除
    const batchDeleteIds = ref('')
    const resultBatchDelete = ref('')

    const testSaveOrUpdateCourse = async () => {
      try {
        const data = { ...courseForm }
        if (data.id === '') delete data.id
        if (data.credit === '') delete data.credit
        if (data.category === '') delete data.category
        if (data.description === '') delete data.description
        const res = await courseAPI.saveOrUpdateCourse(data)
        resultSaveOrUpdateCourse.value = JSON.stringify(res, null, 2)
        ElMessage.success('操作成功')
      } catch (e) {
        resultSaveOrUpdateCourse.value = e.message
        ElMessage.error('操作失败')
      }
    }
    const testGetCourseById = async () => {
      try {
        const res = await courseAPI.getCourseById(getById.value)
        resultGetById.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultGetById.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testDeleteCourse = async () => {
      try {
        const res = await courseAPI.deleteCourse(deleteId.value)
        resultDeleteCourse.value = JSON.stringify(res, null, 2)
        ElMessage.success('删除成功')
      } catch (e) {
        resultDeleteCourse.value = e.message
        ElMessage.error('删除失败')
      }
    }
    const testSearchCourses = async () => {
      try {
        const res = await courseAPI.searchCourses(searchKeywords.value, searchCategory.value)
        resultSearchCourses.value = JSON.stringify(res, null, 2)
        ElMessage.success('搜索成功')
      } catch (e) {
        resultSearchCourses.value = e.message
        ElMessage.error('搜索失败')
      }
    }
    const testGetCoursesByNameLike = async () => {
      try {
        const res = await courseAPI.getCoursesByNameLike(nameLike.value)
        resultNameLike.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultNameLike.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGetCourseByName = async () => {
      try {
        const res = await courseAPI.getCourseByName(getByName.value)
        resultGetByName.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultGetByName.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGetCourseByCode = async () => {
      try {
        const res = await courseAPI.getCourseByCode(getByCode.value)
        resultGetByCode.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultGetByCode.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testGetCoursesByCategory = async () => {
      try {
        const res = await courseAPI.getCoursesByCategory(getByCategory.value)
        resultGetByCategory.value = JSON.stringify(res, null, 2)
        ElMessage.success('获取成功')
      } catch (e) {
        resultGetByCategory.value = e.message
        ElMessage.error('获取失败')
      }
    }
    const testBatchDeleteCourses = async () => {
      try {
        const ids = batchDeleteIds.value.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id))
        const res = await courseAPI.batchDeleteCourses(ids)
        resultBatchDelete.value = JSON.stringify(res, null, 2)
        ElMessage.success('批量删除成功')
      } catch (e) {
        resultBatchDelete.value = e.message
        ElMessage.error('批量删除失败')
      }
    }
    
    return {
      coursesResult,
      testGetAllCourses,
      // 新增
      courseForm, resultSaveOrUpdateCourse, testSaveOrUpdateCourse,
      getById, resultGetById, testGetCourseById,
      deleteId, resultDeleteCourse, testDeleteCourse,
      searchKeywords, searchCategory, resultSearchCourses, testSearchCourses,
      nameLike, resultNameLike, testGetCoursesByNameLike,
      getByName, resultGetByName, testGetCourseByName,
      getByCode, resultGetByCode, testGetCourseByCode,
      getByCategory, resultGetByCategory, testGetCoursesByCategory,
      batchDeleteIds, resultBatchDelete, testBatchDeleteCourses
    }
  }
}
</script>

<style scoped>
.course-api-test {
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