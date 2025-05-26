<template>
  <div class="attendance-api-test">
    <h2>考勤 API 测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生考勤统计</span>
          <el-button type="primary" @click="testGetAttendanceStatistics">执行测试</el-button>
        </div>
      </template>
      
      <el-alert 
        v-if="attendanceResult" 
        :type="attendanceResult.success ? 'success' : 'error'"
        :title="attendanceResult.message"
        show-icon
      />
      
      <pre v-if="attendanceResult && attendanceResult.data">
        {{ JSON.stringify(attendanceResult.data, null, 2) }}
      </pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>新增考勤</span>
          <el-input v-model="saveForm.courseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveForm.studentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveForm.status" placeholder="状态" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveForm.attendanceDate" placeholder="日期(YYYY-MM-DD)" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="saveForm.remark" placeholder="备注(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveAttendance">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSaveAttendance">{{ resultSaveAttendance }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>批量新增考勤</span>
          <el-input v-model="batchSaveJson" placeholder="考勤数组JSON" style="width: 300px; margin-right: 5px;" />
          <el-button type="primary" @click="testBatchSaveAttendance">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultBatchSave">{{ resultBatchSave }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新考勤状态</span>
          <el-input v-model="updateStatusId" placeholder="考勤ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateStatus" placeholder="状态" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateRemark" placeholder="备注(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateAttendanceStatus">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultUpdateStatus">{{ resultUpdateStatus }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称更新考勤</span>
          <el-input v-model="updateByCourseStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateByCourseName" placeholder="课程名称" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="updateByCourseDate" placeholder="日期(YYYY-MM-DD)" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateByCourseStatus" placeholder="状态" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateByCourseRemark" placeholder="备注(可选)" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateAttendanceByCourseName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultUpdateByCourse">{{ resultUpdateByCourse }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生考勤记录</span>
          <el-input v-model="getStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentAttendance">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetStudentAttendance">{{ resultGetStudentAttendance }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据状态获取学生考勤记录</span>
          <el-input v-model="getByStatusStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="getByStatus" placeholder="状态" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentAttendanceByStatus">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetByStatus">{{ resultGetByStatus }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索考勤记录</span>
          <el-input v-model="searchStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="searchKeywords" placeholder="关键词(可选)" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="searchStatus" placeholder="状态(可选)" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="searchStartDate" placeholder="起始日期(可选)" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="searchEndDate" placeholder="结束日期(可选)" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchAttendance">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearchAttendance">{{ resultSearchAttendance }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按日期范围获取学生考勤记录</span>
          <el-input v-model="dateRangeStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="dateRangeStart" placeholder="起始日期" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="dateRangeEnd" placeholder="结束日期" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentAttendanceByDateRange">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultDateRange">{{ resultDateRange }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某课程的考勤记录</span>
          <el-input v-model="courseAttendanceStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="courseAttendanceCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentCourseAttendance">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCourseAttendance">{{ resultCourseAttendance }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取学生某课程的考勤统计</span>
          <el-input v-model="courseStatStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="courseStatCourseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetCourseAttendanceStatistics">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCourseStat">{{ resultCourseStat }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称获取考勤统计</span>
          <el-input v-model="statByCourseStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="statByCourseName" placeholder="课程名称" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetAttendanceStatisticsByCourseName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultStatByCourse">{{ resultStatByCourse }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>按课程名称获取考勤记录</span>
          <el-input v-model="recordByCourseStudentId" placeholder="学生ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="recordByCourseName" placeholder="课程名称" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentAttendanceByCourseName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultRecordByCourse">{{ resultRecordByCourse }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { attendanceAPI, studentAPI } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'AttendanceAPITest',
  setup() {
    const attendanceResult = ref(null)
    const resultSaveAttendance = ref(null)
    const resultBatchSave = ref(null)
    const resultUpdateStatus = ref(null)
    const resultUpdateByCourse = ref(null)
    const resultGetStudentAttendance = ref(null)
    const resultGetByStatus = ref(null)
    const resultSearchAttendance = ref(null)
    const resultDateRange = ref(null)
    const resultCourseAttendance = ref(null)
    const resultCourseStat = ref(null)
    const resultStatByCourse = ref(null)
    const resultRecordByCourse = ref(null)
    
    const saveForm = reactive({ courseId: '', studentId: '', status: '', attendanceDate: '', remark: '' })
    const batchSaveJson = ref('')
    const updateStatusId = ref('')
    const updateStatus = ref('')
    const updateRemark = ref('')
    const updateByCourseStudentId = ref('')
    const updateByCourseName = ref('')
    const updateByCourseDate = ref('')
    const updateByCourseStatus = ref('')
    const updateByCourseRemark = ref('')
    const getStudentId = ref('')
    const getByStatusStudentId = ref('')
    const getByStatus = ref('')
    const searchStudentId = ref('')
    const searchKeywords = ref('')
    const searchStatus = ref('')
    const searchStartDate = ref('')
    const searchEndDate = ref('')
    const dateRangeStudentId = ref('')
    const dateRangeStart = ref('')
    const dateRangeEnd = ref('')
    const courseAttendanceStudentId = ref('')
    const courseAttendanceCourseId = ref('')
    const courseStatStudentId = ref('')
    const courseStatCourseId = ref('')
    const statByCourseStudentId = ref('')
    const statByCourseName = ref('')
    const recordByCourseStudentId = ref('')
    const recordByCourseName = ref('')
    
    const testGetAttendanceStatistics = async () => {
      try {
        const studentInfo = await studentAPI.getSelfStudentInfo()
        const result = await attendanceAPI.getAttendanceStatistics(studentInfo.studentId)
        
        attendanceResult.value = {
          success: true,
          message: '获取考勤统计成功',
          data: result
        }
        
        ElMessage.success('考勤统计获取测试成功')
      } catch (error) {
        attendanceResult.value = {
          success: false,
          message: error.message || '获取考勤统计失败'
        }
        
        ElMessage.error('考勤统计获取测试失败')
      }
    }
    
    const testSaveAttendance = async () => {
      try {
        const result = await attendanceAPI.saveAttendance(saveForm)
        resultSaveAttendance.value = result
        ElMessage.success('新增考勤测试成功')
      } catch (error) {
        resultSaveAttendance.value = error.message || '新增考勤测试失败'
        ElMessage.error('新增考勤测试失败')
      }
    }
    
    const testBatchSaveAttendance = async () => {
      try {
        const result = await attendanceAPI.batchSaveAttendance(batchSaveJson)
        resultBatchSave.value = result
        ElMessage.success('批量新增考勤测试成功')
      } catch (error) {
        resultBatchSave.value = error.message || '批量新增考勤测试失败'
        ElMessage.error('批量新增考勤测试失败')
      }
    }
    
    const testUpdateAttendanceStatus = async () => {
      try {
        const result = await attendanceAPI.updateAttendanceStatus(updateStatusId, updateStatus, updateRemark)
        resultUpdateStatus.value = result
        ElMessage.success('更新考勤状态测试成功')
      } catch (error) {
        resultUpdateStatus.value = error.message || '更新考勤状态测试失败'
        ElMessage.error('更新考勤状态测试失败')
      }
    }
    
    const testUpdateAttendanceByCourseName = async () => {
      try {
        const result = await attendanceAPI.updateAttendanceByCourseName(updateByCourseStudentId, updateByCourseName, updateByCourseDate, updateByCourseStatus, updateByCourseRemark)
        resultUpdateByCourse.value = result
        ElMessage.success('按课程名称更新考勤测试成功')
      } catch (error) {
        resultUpdateByCourse.value = error.message || '按课程名称更新考勤测试失败'
        ElMessage.error('按课程名称更新考勤测试失败')
      }
    }
    
    const testGetStudentAttendance = async () => {
      try {
        const result = await attendanceAPI.getStudentAttendance(getStudentId)
        resultGetStudentAttendance.value = result
        ElMessage.success('获取学生考勤记录测试成功')
      } catch (error) {
        resultGetStudentAttendance.value = error.message || '获取学生考勤记录测试失败'
        ElMessage.error('获取学生考勤记录测试失败')
      }
    }
    
    const testGetStudentAttendanceByStatus = async () => {
      try {
        const result = await attendanceAPI.getStudentAttendanceByStatus(getByStatusStudentId, getByStatus)
        resultGetByStatus.value = result
        ElMessage.success('根据状态获取学生考勤记录测试成功')
      } catch (error) {
        resultGetByStatus.value = error.message || '根据状态获取学生考勤记录测试失败'
        ElMessage.error('根据状态获取学生考勤记录测试失败')
      }
    }
    
    const testSearchAttendance = async () => {
      try {
        const result = await attendanceAPI.searchAttendance(searchStudentId, searchKeywords, searchStatus, searchStartDate, searchEndDate)
        resultSearchAttendance.value = result
        ElMessage.success('搜索考勤记录测试成功')
      } catch (error) {
        resultSearchAttendance.value = error.message || '搜索考勤记录测试失败'
        ElMessage.error('搜索考勤记录测试失败')
      }
    }
    
    const testGetStudentAttendanceByDateRange = async () => {
      try {
        const result = await attendanceAPI.getStudentAttendanceByDateRange(dateRangeStudentId, dateRangeStart, dateRangeEnd)
        resultDateRange.value = result
        ElMessage.success('按日期范围获取学生考勤记录测试成功')
      } catch (error) {
        resultDateRange.value = error.message || '按日期范围获取学生考勤记录测试失败'
        ElMessage.error('按日期范围获取学生考勤记录测试失败')
      }
    }
    
    const testGetStudentCourseAttendance = async () => {
      try {
        const result = await attendanceAPI.getStudentCourseAttendance(courseAttendanceStudentId, courseAttendanceCourseId)
        resultCourseAttendance.value = result
        ElMessage.success('获取学生某课程的考勤记录测试成功')
      } catch (error) {
        resultCourseAttendance.value = error.message || '获取学生某课程的考勤记录测试失败'
        ElMessage.error('获取学生某课程的考勤记录测试失败')
      }
    }
    
    const testGetCourseAttendanceStatistics = async () => {
      try {
        const result = await attendanceAPI.getCourseAttendanceStatistics(courseStatStudentId, courseStatCourseId)
        resultCourseStat.value = result
        ElMessage.success('获取学生某课程的考勤统计测试成功')
      } catch (error) {
        resultCourseStat.value = error.message || '获取学生某课程的考勤统计测试失败'
        ElMessage.error('获取学生某课程的考勤统计测试失败')
      }
    }
    
    const testGetAttendanceStatisticsByCourseName = async () => {
      try {
        const result = await attendanceAPI.getAttendanceStatisticsByCourseName(statByCourseStudentId, statByCourseName)
        resultStatByCourse.value = result
        ElMessage.success('按课程名称获取考勤统计测试成功')
      } catch (error) {
        resultStatByCourse.value = error.message || '按课程名称获取考勤统计测试失败'
        ElMessage.error('按课程名称获取考勤统计测试失败')
      }
    }
    
    const testGetStudentAttendanceByCourseName = async () => {
      try {
        const result = await attendanceAPI.getStudentAttendanceByCourseName(recordByCourseStudentId, recordByCourseName)
        resultRecordByCourse.value = result
        ElMessage.success('按课程名称获取考勤记录测试成功')
      } catch (error) {
        resultRecordByCourse.value = error.message || '按课程名称获取考勤记录测试失败'
        ElMessage.error('按课程名称获取考勤记录测试失败')
      }
    }
    
    return {
      attendanceResult,
      resultSaveAttendance,
      resultBatchSave,
      resultUpdateStatus,
      resultUpdateByCourse,
      resultGetStudentAttendance,
      resultGetByStatus,
      resultSearchAttendance,
      resultDateRange,
      resultCourseAttendance,
      resultCourseStat,
      resultStatByCourse,
      resultRecordByCourse,
      testGetAttendanceStatistics,
      testSaveAttendance,
      testBatchSaveAttendance,
      testUpdateAttendanceStatus,
      testUpdateAttendanceByCourseName,
      testGetStudentAttendance,
      testGetStudentAttendanceByStatus,
      testSearchAttendance,
      testGetStudentAttendanceByDateRange,
      testGetStudentCourseAttendance,
      testGetCourseAttendanceStatistics,
      testGetAttendanceStatisticsByCourseName,
      testGetStudentAttendanceByCourseName,
      saveForm,
      batchSaveJson,
      updateStatusId, updateStatus, updateRemark,
      updateByCourseStudentId, updateByCourseName, updateByCourseDate, updateByCourseStatus, updateByCourseRemark,
      getStudentId,
      getByStatusStudentId, getByStatus,
      searchStudentId, searchKeywords, searchStatus, searchStartDate, searchEndDate,
      dateRangeStudentId, dateRangeStart, dateRangeEnd,
      courseAttendanceStudentId, courseAttendanceCourseId,
      courseStatStudentId, courseStatCourseId,
      statByCourseStudentId, statByCourseName,
      recordByCourseStudentId, recordByCourseName
    }
  }
}
</script>

<style scoped>
.attendance-api-test {
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