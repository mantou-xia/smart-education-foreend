<template>
  <div class="auth-api-test">
    <h2>认证 API 全量测试</h2>
    <!-- 学生登录 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>学生登录</span>
          <el-input v-model="loginForm.username" placeholder="用户名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="loginForm.password" placeholder="密码" type="password" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testStudentLogin">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultStudentLogin">{{ resultStudentLogin }}</pre>
    </el-card>
    <!-- 教师登录 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>教师登录</span>
          <el-input v-model="teacherLoginForm.username" placeholder="用户名" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="teacherLoginForm.password" placeholder="密码" type="password" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testTeacherLogin">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultTeacherLogin">{{ resultTeacherLogin }}</pre>
    </el-card>
    <!-- 学生注册 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>学生注册</span>
          <el-input v-model="registerForm.username" placeholder="用户名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="registerForm.password" placeholder="密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="registerForm.email" placeholder="邮箱" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="registerForm.fullName" placeholder="姓名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="registerForm.phone" placeholder="电话" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testStudentRegister">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultStudentRegister">{{ resultStudentRegister }}</pre>
    </el-card>
    <!-- 教师注册 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>教师注册</span>
          <el-input v-model="teacherRegisterForm.username" placeholder="用户名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="teacherRegisterForm.password" placeholder="密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="teacherRegisterForm.email" placeholder="邮箱" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="teacherRegisterForm.fullName" placeholder="姓名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="teacherRegisterForm.phone" placeholder="电话" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testRegisterTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultRegisterTeacher">{{ resultRegisterTeacher }}</pre>
    </el-card>
    <!-- 学生修改密码 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>学生修改密码</span>
          <el-input v-model="changeStudentPasswordForm.username" placeholder="用户名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="changeStudentPasswordForm.oldPassword" placeholder="旧密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="changeStudentPasswordForm.newPassword" placeholder="新密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testChangeStudentPassword">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultChangeStudentPassword">{{ resultChangeStudentPassword }}</pre>
    </el-card>
    <!-- 教师修改密码 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>教师修改密码</span>
          <el-input v-model="changeTeacherPasswordForm.username" placeholder="用户名" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="changeTeacherPasswordForm.oldPassword" placeholder="旧密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="changeTeacherPasswordForm.newPassword" placeholder="新密码" type="password" style="width: 100px; margin-right: 5px;" />
          <el-button type="primary" @click="testChangeTeacherPassword">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultChangeTeacherPassword">{{ resultChangeTeacherPassword }}</pre>
    </el-card>
    <!-- 检查学生端用户名是否可用 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>检查学生端用户名是否可用</span>
          <el-input v-model="checkUsername" placeholder="用户名" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testCheckAvailableUsername">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCheckAvailableUsername">{{ resultCheckAvailableUsername }}</pre>
    </el-card>
    <!-- 检查教师端用户名是否可用 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>检查教师端用户名是否可用</span>
          <el-input v-model="checkTeacherUsername" placeholder="用户名" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testCheckAvailableUsernameForTeacher">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultCheckAvailableUsernameForTeacher">{{ resultCheckAvailableUsernameForTeacher }}</pre>
    </el-card>
    <!-- 刷新学生端token -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>刷新学生端token</span>
          <el-input v-model="studentRefreshTokenValue" placeholder="refreshToken" style="width: 220px; margin-right: 10px;" />
          <el-button type="primary" @click="testStudentRefreshToken">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultStudentRefreshToken">{{ resultStudentRefreshToken }}</pre>
    </el-card>
    <!-- 刷新教师端token -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>刷新教师端token</span>
          <el-input v-model="teacherRefreshTokenValue" placeholder="refreshToken" style="width: 220px; margin-right: 10px;" />
          <el-button type="primary" @click="testTeacherRefreshToken">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultTeacherRefreshToken">{{ resultTeacherRefreshToken }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { authAPI } from '@/api/api'

export default {
  name: 'AuthAPITest',
  setup() {
    // 学生登录
    const loginForm = reactive({ username: '', password: '' })
    const resultStudentLogin = ref('')
    // 教师登录
    const teacherLoginForm = reactive({ username: '', password: '' })
    const resultTeacherLogin = ref('')
    // 学生注册
    const registerForm = reactive({ username: '', password: '', email: '', fullName: '', phone: '' })
    const resultStudentRegister = ref('')
    // 教师注册
    const teacherRegisterForm = reactive({ username: '', password: '', email: '', fullName: '', phone: '' })
    const resultRegisterTeacher = ref('')
    // 学生修改密码
    const changeStudentPasswordForm = reactive({ username: '', oldPassword: '', newPassword: '' })
    const resultChangeStudentPassword = ref('')
    // 教师修改密码
    const changeTeacherPasswordForm = reactive({ username: '', oldPassword: '', newPassword: '' })
    const resultChangeTeacherPassword = ref('')
    // 检查学生端用户名是否可用
    const checkUsername = ref('')
    const resultCheckAvailableUsername = ref('')
    // 检查教师端用户名是否可用
    const checkTeacherUsername = ref('')
    const resultCheckAvailableUsernameForTeacher = ref('')
    // 刷新学生端token
    const studentRefreshTokenValue = ref('')
    const resultStudentRefreshToken = ref('')
    // 刷新教师端token
    const teacherRefreshTokenValue = ref('')
    const resultTeacherRefreshToken = ref('')

    const testStudentLogin = async () => {
      resultStudentLogin.value = JSON.stringify(await authAPI.studentLogin(loginForm.username, loginForm.password), null, 2)
    }
    const testTeacherLogin = async () => {
      resultTeacherLogin.value = JSON.stringify(await authAPI.teacherLogin(teacherLoginForm.username, teacherLoginForm.password), null, 2)
    }
    const testStudentRegister = async () => {
      resultStudentRegister.value = JSON.stringify(await authAPI.studentRegister(registerForm), null, 2)
    }
    const testRegisterTeacher = async () => {
      resultRegisterTeacher.value = JSON.stringify(await authAPI.registerTeacher(teacherRegisterForm), null, 2)
    }
    const testChangeStudentPassword = async () => {
      resultChangeStudentPassword.value = JSON.stringify(await authAPI.changeStudentPassword(changeStudentPasswordForm), null, 2)
    }
    const testChangeTeacherPassword = async () => {
      resultChangeTeacherPassword.value = JSON.stringify(await authAPI.changeTeacherPassword(changeTeacherPasswordForm), null, 2)
    }
    const testCheckAvailableUsername = async () => {
      resultCheckAvailableUsername.value = JSON.stringify(await authAPI.checkAvailableUsername(checkUsername.value), null, 2)
    }
    const testCheckAvailableUsernameForTeacher = async () => {
      resultCheckAvailableUsernameForTeacher.value = JSON.stringify(await authAPI.checkAvailableUsernameForTeacher(checkTeacherUsername.value), null, 2)
    }
    const testStudentRefreshToken = async () => {
      resultStudentRefreshToken.value = JSON.stringify(await authAPI.studentRefreshToken({ refreshToken: studentRefreshTokenValue.value }), null, 2)
    }
    const testTeacherRefreshToken = async () => {
      resultTeacherRefreshToken.value = JSON.stringify(await authAPI.teacherRefreshToken({ refreshToken: teacherRefreshTokenValue.value }), null, 2)
    }

    return {
      loginForm, resultStudentLogin,
      teacherLoginForm, resultTeacherLogin,
      registerForm, resultStudentRegister,
      teacherRegisterForm, resultRegisterTeacher,
      changeStudentPasswordForm, resultChangeStudentPassword,
      changeTeacherPasswordForm, resultChangeTeacherPassword,
      checkUsername, resultCheckAvailableUsername,
      checkTeacherUsername, resultCheckAvailableUsernameForTeacher,
      studentRefreshTokenValue, resultStudentRefreshToken,
      teacherRefreshTokenValue, resultTeacherRefreshToken,
      testStudentLogin, testTeacherLogin, testStudentRegister, testRegisterTeacher,
      testChangeStudentPassword, testChangeTeacherPassword,
      testCheckAvailableUsername, testCheckAvailableUsernameForTeacher,
      testStudentRefreshToken, testTeacherRefreshToken
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