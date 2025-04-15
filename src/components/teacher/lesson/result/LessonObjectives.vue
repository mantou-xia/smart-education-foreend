<template>
  <div class="result-section">
    <h4>教学目标</h4>
    <ul>
      <li v-for="(objective, index) in objectives" :key="'obj-'+index">
        {{ objective }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LessonObjectives',
  props: {
    objectives: {
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

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style> 