<template>
  <div class="result-section">
    <h4>课程标题</h4>
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'LessonTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.result-section {
  margin-bottom: 20px;
}

h4 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #3f51b5;
}
</style> 