<template>
  <form class="register-form" @submit.prevent="submitForm">
    <div class="form-row">
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          id="username" 
          v-model="form.username" 
          type="text" 
          placeholder="请输入用户名"
          :class="{ 'input-error': errors.username }"
          @blur="validateUsername"
        />
        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
      </div>
      
      <div class="form-group">
        <label for="email">邮箱</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          placeholder="请输入邮箱"
          :class="{ 'input-error': errors.email }"
          @blur="validateEmail"
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>
    </div>
    
    <div class="form-group">
      <label for="role">角色</label>
      <select 
        id="role" 
        v-model="form.role"
        :class="{ 'input-error': errors.role }"
        @blur="validateRole"
      >
        <option value="">请选择角色</option>
        <option value="student">学生</option>
        <option value="teacher">教师</option>
      </select>
      <div v-if="errors.role" class="error-message">{{ errors.role }}</div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="password">密码</label>
        <div class="password-input">
          <input 
            id="password" 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="请输入密码"
            :class="{ 'input-error': errors.password }"
            @blur="validatePassword"
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input 
          id="confirmPassword" 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="请再次输入密码"
          :class="{ 'input-error': errors.confirmPassword }"
          @blur="validateConfirmPassword"
        />
        <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
      </div>
    </div>
    
    <div class="form-option">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="form.agreement"
          @change="validateAgreement"
        />
        <span>我已阅读并同意<a href="#" class="terms-link">用户协议</a>和<a href="#" class="terms-link">隐私政策</a></span>
      </label>
      <div v-if="errors.agreement" class="error-message agreement-error">{{ errors.agreement }}</div>
    </div>
    
    <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
      {{ isSubmitting ? '注册中...' : '注册' }}
    </button>
  </form>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'RegisterForm',
  emits: ['register'],
  setup(props, { emit }) {
    const form = reactive({
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
      agreement: false
    })
    
    const errors = reactive({
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
      agreement: ''
    })
    
    const showPassword = ref(false)
    const isSubmitting = ref(false)
    
    const validateUsername = () => {
      if (!form.username) {
        errors.username = '请输入用户名'
        return false
      }
      if (form.username.length < 3) {
        errors.username = '用户名长度不能少于3个字符'
        return false
      }
      errors.username = ''
      return true
    }
    
    const validateEmail = () => {
      if (!form.email) {
        errors.email = '请输入邮箱'
        return false
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(form.email)) {
        errors.email = '请输入有效的邮箱地址'
        return false
      }
      errors.email = ''
      return true
    }
    
    const validateRole = () => {
      if (!form.role) {
        errors.role = '请选择角色'
        return false
      }
      errors.role = ''
      return true
    }
    
    const validatePassword = () => {
      if (!form.password) {
        errors.password = '请输入密码'
        return false
      }
      if (form.password.length < 6) {
        errors.password = '密码长度不能少于6位'
        return false
      }
      errors.password = ''
      return true
    }
    
    const validateConfirmPassword = () => {
      if (!form.confirmPassword) {
        errors.confirmPassword = '请确认密码'
        return false
      }
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
        return false
      }
      errors.confirmPassword = ''
      return true
    }
    
    const validateAgreement = () => {
      if (!form.agreement) {
        errors.agreement = '请阅读并同意用户协议和隐私政策'
        return false
      }
      errors.agreement = ''
      return true
    }
    
    const validateForm = () => {
      const validations = [
        validateUsername(),
        validateEmail(),
        validateRole(),
        validatePassword(),
        validateConfirmPassword(),
        validateAgreement()
      ]
      return validations.every(valid => valid)
    }
    
    const submitForm = () => {
      if (validateForm()) {
        isSubmitting.value = true
        
        // 模拟异步注册操作
        setTimeout(() => {
          const userData = {
            username: form.username,
            email: form.email,
            role: form.role,
            password: form.password
          }
          emit('register', userData)
          isSubmitting.value = false
        }, 1500)
      }
    }
    
    return {
      form,
      errors,
      showPassword,
      isSubmitting,
      validateUsername,
      validateEmail,
      validateRole,
      validatePassword,
      validateConfirmPassword,
      validateAgreement,
      submitForm
    }
  }
}
</script>

<style scoped>
.register-form {
  margin-bottom: 10px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3f51b5;
}

.input-error {
  border-color: #f44336 !important;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
}

.form-option {
  margin-bottom: 20px;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

.terms-link {
  color: #3f51b5;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.agreement-error {
  margin-top: 5px;
  margin-left: 24px;
}

.btn-block {
  width: 100%;
}

@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style> 