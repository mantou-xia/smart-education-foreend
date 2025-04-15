<template>
  <div class="result-section">
    <h4>内容部分</h4>
    <content-section 
      v-for="(section, index) in sections" 
      :key="'sec-'+index"
      :section="section"
    />
  </div>
</template>

<script>
import ContentSection from './ContentSection.vue'

export default {
  name: 'LessonContentSections',
  components: {
    ContentSection
  },
  props: {
    sections: {
      type: Array,
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