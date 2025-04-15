<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-logo">
        <img src="@/assets/logo.png" alt="Logo" onerror="this.src='https://via.placeholder.com/150x50?text=Logo'">
      </div>
      <router-view />
    </div>
    <div class="auth-footer">
      <p>© 2025 教学实训系统 | 基于人工智能的智能教学平台</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-logo {
  margin-bottom: 30px;
  text-align: center;
}

.auth-logo img {
  max-width: 200px;
  height: auto;
}

.auth-footer {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 13px;
}
</style> 