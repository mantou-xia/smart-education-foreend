<template>
  <header class="header">
    <div class="logo">
      <h1>基于开源AI大模型的教学实训软件</h1>
    </div>
    <nav-menu />
    <user-info />
  </header>
</template>

<script>
import NavMenu from './NavMenu.vue'
import UserInfo from './UserInfo.vue'

export default {
  name: 'AppHeader',
  components: {
    NavMenu,
    UserInfo
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #3f51b5;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo h1 {
  font-size: 20px;
  font-weight: 500;
}
</style> 