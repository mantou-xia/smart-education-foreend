<template>
  <div class="user-info">
    <div class="user-details">
      <span class="welcome">欢迎，</span>
      <span class="user-name">{{ userData.name }}</span>
      <span class="user-role" :class="'role-' + userData.role">{{ roleText }}</span>
    </div>
    <a href="#" class="logout" @click.prevent="logout">退出</a>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '@/utils/auth'

export default {
  name: 'UserInfo',
  setup() {
    const router = useRouter()
    const userData = reactive({
      id: 0,
      username: '',
      name: '访客',
      role: 'guest'
    })
    
    // 根据角色显示不同的文本
    const roleText = computed(() => {
      switch(userData.role) {
        case 'admin':
          return '管理员'
        case 'teacher':
          return '教师'
        case 'student':
          return '学生'
        default:
          return '访客'
      }
    })
    
    // 从localStorage读取用户信息
    onMounted(() => {
      try {
        // 获取用户数据
        const storedUserData = JSON.parse(localStorage.getItem('userData'))
        if (storedUserData) {
          console.log('从localStorage读取到userData:', storedUserData)
          Object.assign(userData, storedUserData)
        }
        
        // 检查用户信息对象
        const userInfo = localStorage.getItem('user_info')
        if (userInfo) {
          console.log('从localStorage读取到user_info:', JSON.parse(userInfo))
        } else {
          console.warn('localStorage中没有user_info')
        }
        
        // 确保name属性有值，否则使用username
        if (!userData.name && userData.username) {
          userData.name = userData.username
        }
        
        // 确保role属性格式正确（去除可能的ROLE_前缀）
        if (userData.role && userData.role.toUpperCase().startsWith('ROLE_')) {
          const roleName = userData.role.substring(5).toLowerCase()
          console.log(`检测到角色前缀ROLE_，将${userData.role}转换为${roleName}`)
          userData.role = roleName
        }
      } catch (e) {
        console.error('无法解析用户数据', e)
      }
    })
    
    const logout = () => {
      // 使用clearAuth函数清除所有认证信息
      clearAuth()
      console.log('已清除所有认证信息，准备跳转到登录页')
      
      // 跳转到登录页
      router.push('/auth/login')
    }
    
    return {
      userData,
      roleText,
      logout
    }
  }
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 5px;
}

.welcome {
  color: rgba(255, 255, 255, 0.8);
}

.user-name {
  font-weight: 500;
}

.user-role {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

.role-admin {
  background-color: #ff9800;
  color: white;
}

.role-teacher {
  background-color: #4caf50;
  color: white;
}

.role-student {
  background-color: #2196f3;
  color: white;
}

.logout {
  color: white;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style> 