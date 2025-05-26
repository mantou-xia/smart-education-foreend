<template>
  <div class="exam-api-test">
    <h2>考试 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>新增考试</span>
          <el-input v-model="saveData.title" placeholder="标题" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="saveData.description" placeholder="描述" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="saveData.courseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.teacherId" placeholder="教师ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.totalScore" placeholder="总分" style="width: 60px; margin-right: 5px;" />
          <el-input v-model="saveData.durationMinutes" placeholder="时长(分钟)" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.startTime" placeholder="开始时间(ISO)" style="width: 140px; margin-right: 5px;" />
          <el-input v-model="saveData.endTime" placeholder="结束时间(ISO)" style="width: 140px; margin-right: 5px;" />
          <el-input v-model="saveData.status" placeholder="状态" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveExam">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新考试</span>
          <el-input v-model="updateData.examId" placeholder="考试ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.title" placeholder="标题" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="updateData.description" placeholder="描述" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateData.courseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.teacherId" placeholder="教师ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.totalScore" placeholder="总分" style="width: 60px; margin-right: 5px;" />
          <el-input v-model="updateData.durationMinutes" placeholder="时长(分钟)" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.startTime" placeholder="开始时间(ISO)" style="width: 140px; margin-right: 5px;" />
          <el-input v-model="updateData.endTime" placeholder="结束时间(ISO)" style="width: 140px; margin-right: 5px;" />
          <el-input v-model="updateData.status" placeholder="状态" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateExam">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>删除考试</span>
          <el-input v-model="deleteId" placeholder="考试ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="danger" @click="testDeleteExamById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取考试</span>
          <el-input v-model="examId" placeholder="考试ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetExamById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result4">{{ result4 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据教师ID获取考试列表</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetExamsByTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result5">{{ result5 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID获取考试列表</span>
          <el-input v-model="courseId" placeholder="课程ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetExamsInCourse">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result6">{{ result6 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID和教师ID获取考试列表</span>
          <el-input v-model="courseId2" placeholder="课程ID" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="teacherId2" placeholder="教师ID" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetExamsInCourseByTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result7">{{ result7 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { examAPI } from '@/api/api'

export default {
  name: 'ExamAPITest',
  setup() {
    const saveData = reactive({ title: '', description: '', courseId: '', teacherId: '', totalScore: '', durationMinutes: '', startTime: '', endTime: '', status: '' })
    const updateData = reactive({ examId: '', title: '', description: '', courseId: '', teacherId: '', totalScore: '', durationMinutes: '', startTime: '', endTime: '', status: '' })
    const deleteId = ref('')
    const examId = ref('')
    const teacherId = ref('')
    const courseId = ref('')
    const courseId2 = ref('')
    const teacherId2 = ref('')
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')
    const result4 = ref('')
    const result5 = ref('')
    const result6 = ref('')
    const result7 = ref('')

    const testSaveExam = async () => {
      result1.value = JSON.stringify(await examAPI.saveExam(saveData), null, 2)
    }
    const testUpdateExam = async () => {
      result2.value = JSON.stringify(await examAPI.updateExam(updateData), null, 2)
    }
    const testDeleteExamById = async () => {
      result3.value = JSON.stringify(await examAPI.deleteExamById(deleteId.value), null, 2)
    }
    const testGetExamById = async () => {
      result4.value = JSON.stringify(await examAPI.getExamById(examId.value), null, 2)
    }
    const testGetExamsByTeacher = async () => {
      result5.value = JSON.stringify(await examAPI.getExamsByTeacher(teacherId.value), null, 2)
    }
    const testGetExamsInCourse = async () => {
      result6.value = JSON.stringify(await examAPI.getExamsInCourse(courseId.value), null, 2)
    }
    const testGetExamsInCourseByTeacher = async () => {
      result7.value = JSON.stringify(await examAPI.getExamsInCourseByTeacher(courseId2.value, teacherId2.value), null, 2)
    }

    return {
      saveData, updateData, deleteId, examId, teacherId, courseId, courseId2, teacherId2,
      result1, result2, result3, result4, result5, result6, result7,
      testSaveExam, testUpdateExam, testDeleteExamById, testGetExamById,
      testGetExamsByTeacher, testGetExamsInCourse, testGetExamsInCourseByTeacher
    }
  }
}
</script>

<style scoped>
.exam-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 