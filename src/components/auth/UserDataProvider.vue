<template>
  <slot :userData="userData" />
</template>

<script>
import { reactive, onMounted } from 'vue'

export default {
  name: 'UserDataProvider',
  setup() {
    const userData = reactive({
      id: 0,
      username: '',
      name: '访客',
      role: 'guest'
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
    
    return {
      userData
    }
  }
}
</script> 