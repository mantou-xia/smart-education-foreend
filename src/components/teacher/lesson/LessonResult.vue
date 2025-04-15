<template>
  <div class="card">
    <div class="card-header">
      <h3>生成的教学内容</h3>
    </div>
    <div class="card-body">
      <lesson-title :title="lesson.title" />
      <lesson-objectives :objectives="lesson.objectives" />
      <lesson-key-points :key-points="lesson.keyPoints" />
      <lesson-content-sections :sections="lesson.contentSections" />
      <lesson-result-actions @save="saveLesson" @print="printLesson" />
    </div>
  </div>
</template>

<script>
import LessonTitle from './result/LessonTitle.vue'
import LessonObjectives from './result/LessonObjectives.vue'
import LessonKeyPoints from './result/LessonKeyPoints.vue'
import LessonContentSections from './result/LessonContentSections.vue'
import LessonResultActions from './result/LessonResultActions.vue'

export default {
  name: 'LessonResult',
  components: {
    LessonTitle,
    LessonObjectives,
    LessonKeyPoints,
    LessonContentSections,
    LessonResultActions
  },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  methods: {
    saveLesson() {
      // 保存教案的逻辑
      alert('教案已保存！')
    },
    printLesson() {
      // 打印预览的逻辑
      window.print()
    }
  }
}
</script>

<style scoped>
@media print {
  .form,
  .form-actions {
    display: none;
  }
}
</style> 