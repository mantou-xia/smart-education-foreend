<template>
  <div class="auth-api-test">
    <h2>认证 API 测试（教师端）</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>教师登录</span>
          <el-input v-model="loginData.username" placeholder="用户名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="loginData.password" placeholder="密码" type="password" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testTeacherLogin">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>教师注册</span>
          <el-input v-model="registerData.username" placeholder="用户名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="registerData.password" placeholder="密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="registerData.email" placeholder="邮箱" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="registerData.fullName" placeholder="姓名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="registerData.phone" placeholder="电话" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testRegisterTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>修改教师密码</span>
          <el-input v-model="changePwdData.username" placeholder="用户名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="changePwdData.oldPassword" placeholder="旧密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="changePwdData.newPassword" placeholder="新密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testChangeTeacherPassword">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>检查教师用户名可用</span>
          <el-input v-model="checkUsername" placeholder="用户名" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testCheckAvailableUsernameForTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result4">{{ result4 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>刷新教师token</span>
          <el-input v-model="refreshToken" placeholder="refreshToken" style="width: 220px; margin-right: 10px;" />
          <el-button type="primary" @click="testTeacherRefreshToken">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result5">{{ result5 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { authAPI } from '@/api/api'

export default {
  name: 'AuthAPITest',
  setup() {
    const loginData = reactive({ username: '', password: '' })
    const registerData = reactive({ username: '', password: '', email: '', fullName: '', phone: '' })
    const changePwdData = reactive({ username: '', oldPassword: '', newPassword: '' })
    const checkUsername = ref('')
    const refreshToken = ref('')
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')
    const result4 = ref('')
    const result5 = ref('')

    const testTeacherLogin = async () => {
      result1.value = JSON.stringify(await authAPI.teacherLogin(loginData.username, loginData.password), null, 2)
    }
    const testRegisterTeacher = async () => {
      result2.value = JSON.stringify(await authAPI.registerTeacher(registerData), null, 2)
    }
    const testChangeTeacherPassword = async () => {
      result3.value = JSON.stringify(await authAPI.changeTeacherPassword(changePwdData), null, 2)
    }
    const testCheckAvailableUsernameForTeacher = async () => {
      result4.value = JSON.stringify(await authAPI.checkAvailableUsernameForTeacher(checkUsername.value), null, 2)
    }
    const testTeacherRefreshToken = async () => {
      result5.value = JSON.stringify(await authAPI.teacherRefreshToken({ refreshToken: refreshToken.value }), null, 2)
    }

    return {
      loginData, registerData, changePwdData, checkUsername, refreshToken,
      result1, result2, result3, result4, result5,
      testTeacherLogin, testRegisterTeacher, testChangeTeacherPassword, testCheckAvailableUsernameForTeacher, testTeacherRefreshToken
    }
  }
}
</script>

<style scoped>
.auth-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 