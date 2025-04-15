<template>
  <div class="welcome-banner">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'WelcomeBanner',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.welcome-banner {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-banner h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.welcome-banner p {
  font-size: 16px;
  color: #666;
}
</style> 