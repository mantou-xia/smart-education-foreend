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
        const storedUserData = JSON.parse(localStorage.getItem('userData'))
        if (storedUserData) {
          Object.assign(userData, storedUserData)
        }
      } catch (e) {
        console.error('无法解析用户数据', e)
      }
    })
    
    const logout = () => {
      // 清除登录状态
      localStorage.removeItem('isLoggedIn')
      
      // 清除其他可能存在的用户信息
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      
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