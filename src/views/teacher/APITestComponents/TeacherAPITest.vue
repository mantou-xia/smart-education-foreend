<template>
  <div class="teacher-api-test">
    <h2>教师 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据用户名获取教师信息</span>
          <el-input v-model="username" placeholder="用户名" style="width: 200px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetTeacherByUsername">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>获取当前登录教师信息</span>
          <el-button type="primary" @click="testGetSelfTeacherInfo">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新教师信息</span>
          <el-input v-model="updateData.username" placeholder="用户名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateData.email" placeholder="邮箱" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateData.fullName" placeholder="姓名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateData.phone" placeholder="电话" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取教师信息</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetTeacherById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result4">{{ result4 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { teacherAPI } from '@/api/api'

export default {
  name: 'TeacherAPITest',
  setup() {
    const username = ref('')
    const teacherId = ref('')
    const updateData = reactive({ username: '', email: '', fullName: '', phone: '' })
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')
    const result4 = ref('')

    const testGetTeacherByUsername = async () => {
      result1.value = JSON.stringify(await teacherAPI.getTeacherByUsername(username.value), null, 2)
    }
    const testGetSelfTeacherInfo = async () => {
      result2.value = JSON.stringify(await teacherAPI.getSelfTeacherInfo(), null, 2)
    }
    const testUpdateTeacher = async () => {
      result3.value = JSON.stringify(await teacherAPI.updateTeacher(updateData), null, 2)
    }
    const testGetTeacherById = async () => {
      result4.value = JSON.stringify(await teacherAPI.getTeacherById(teacherId.value), null, 2)
    }

    return {
      username, teacherId, updateData, result1, result2, result3, result4,
      testGetTeacherByUsername, testGetSelfTeacherInfo, testUpdateTeacher, testGetTeacherById
    }
  }
}
</script>

<style scoped>
.teacher-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 