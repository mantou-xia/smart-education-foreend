<template>
  <div class="student-api-test">
    <h2>学生 API 全量测试</h2>
    <!-- 新增/更新学生信息 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>新增/更新学生信息</span>
          <el-input v-model="studentForm.username" placeholder="用户名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="studentForm.password" placeholder="密码" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="studentForm.email" placeholder="邮箱" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="studentForm.fullName" placeholder="姓名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="studentForm.phone" placeholder="电话" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="studentForm.grade" placeholder="年级" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="studentForm.className" placeholder="班级" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveOrUpdateStudent">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSaveOrUpdate">{{ resultSaveOrUpdate }}</pre>
    </el-card>
    <!-- 根据ID获取学生信息 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取学生信息</span>
          <el-input v-model="studentId" placeholder="学生ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetStudentById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetById">{{ resultGetById }}</pre>
    </el-card>
    <!-- 根据用户名获取学生信息 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据用户名获取学生信息</span>
          <el-input v-model="username" placeholder="用户名" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetStudentByUsername">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetByUsername">{{ resultGetByUsername }}</pre>
    </el-card>
    <!-- 获取当前登录学生信息 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取当前登录学生信息</span>
          <el-button type="primary" @click="testGetSelfStudentInfo">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultGetSelf">{{ resultGetSelf }}</pre>
    </el-card>
    <!-- 搜索学生 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>搜索学生</span>
          <el-input v-model="searchParams.keywords" placeholder="关键词" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="searchParams.grade" placeholder="年级" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="searchParams.className" placeholder="班级" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testSearchStudents">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSearch">{{ resultSearch }}</pre>
    </el-card>
    <!-- 根据姓名获取学生列表 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据姓名获取学生列表</span>
          <el-input v-model="fullName" placeholder="姓名" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetStudentsByFullName">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultByFullName">{{ resultByFullName }}</pre>
    </el-card>
    <!-- 根据年级和班级获取学生列表 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据年级和班级获取学生列表</span>
          <el-input v-model="classParams.grade" placeholder="年级" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="classParams.className" placeholder="班级" style="width: 80px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetStudentsByClass">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultByClass">{{ resultByClass }}</pre>
    </el-card>
    <!-- 检查邮箱是否已被注册 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>检查邮箱是否已被注册</span>
          <el-input v-model="email" placeholder="邮箱" style="width: 180px; margin-right: 10px;" />
          <el-button type="primary" @click="testCheckEmail">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCheckEmail">{{ resultCheckEmail }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { studentAPI } from '@/api/api'

export default {
  name: 'StudentAPITest',
  setup() {
    // 新增/更新学生信息
    const studentForm = reactive({ username: '', password: '', email: '', fullName: '', phone: '', grade: '', className: '' })
    const resultSaveOrUpdate = ref('')
    // 根据ID获取学生信息
    const studentId = ref('')
    const resultGetById = ref('')
    // 根据用户名获取学生信息
    const username = ref('')
    const resultGetByUsername = ref('')
    // 获取当前登录学生信息
    const resultGetSelf = ref('')
    // 搜索学生
    const searchParams = reactive({ keywords: '', grade: '', className: '' })
    const resultSearch = ref('')
    // 根据姓名获取学生列表
    const fullName = ref('')
    const resultByFullName = ref('')
    // 根据年级和班级获取学生列表
    const classParams = reactive({ grade: '', className: '' })
    const resultByClass = ref('')
    // 检查邮箱
    const email = ref('')
    const resultCheckEmail = ref('')

    const testSaveOrUpdateStudent = async () => {
      resultSaveOrUpdate.value = JSON.stringify(await studentAPI.saveOrUpdateStudent(studentForm), null, 2)
    }
    const testGetStudentById = async () => {
      resultGetById.value = JSON.stringify(await studentAPI.getStudentById(studentId.value), null, 2)
    }
    const testGetStudentByUsername = async () => {
      resultGetByUsername.value = JSON.stringify(await studentAPI.getStudentByUsername(username.value), null, 2)
    }
    const testGetSelfStudentInfo = async () => {
      resultGetSelf.value = JSON.stringify(await studentAPI.getSelfStudentInfo(), null, 2)
    }
    const testSearchStudents = async () => {
      resultSearch.value = JSON.stringify(await studentAPI.searchStudents(searchParams), null, 2)
    }
    const testGetStudentsByFullName = async () => {
      resultByFullName.value = JSON.stringify(await studentAPI.getStudentsByFullName(fullName.value), null, 2)
    }
    const testGetStudentsByClass = async () => {
      resultByClass.value = JSON.stringify(await studentAPI.getStudentsByClass(classParams), null, 2)
    }
    const testCheckEmail = async () => {
      resultCheckEmail.value = JSON.stringify(await studentAPI.checkEmail(email.value), null, 2)
    }

    return {
      studentForm, resultSaveOrUpdate,
      studentId, resultGetById,
      username, resultGetByUsername,
      resultGetSelf,
      searchParams, resultSearch,
      fullName, resultByFullName,
      classParams, resultByClass,
      email, resultCheckEmail,
      testSaveOrUpdateStudent, testGetStudentById, testGetStudentByUsername, testGetSelfStudentInfo,
      testSearchStudents, testGetStudentsByFullName, testGetStudentsByClass, testCheckEmail
    }
  }
}
</script>

<style scoped>
.student-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 