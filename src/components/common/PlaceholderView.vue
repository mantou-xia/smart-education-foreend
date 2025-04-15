<template>
  <div class="placeholder">
    <div class="placeholder-icon">🚧</div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderView',
  props: {
    message: {
      type: String,
      default: '该功能正在开发中，敬请期待...'
    }
  }
}
</script>

<style scoped>
.placeholder {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

p {
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}
</style> 