<template>
  <div class="content-section">
    <h5>{{ section.title }}</h5>
    <p>{{ section.content }}</p>
    <div class="section-info">
      <span>建议时长: {{ section.duration }}分钟</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentSection',
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.content-section {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #3f51b5;
}

h5 {
  font-size: 15px;
  margin-bottom: 8px;
}

.section-info {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
}
</style> 