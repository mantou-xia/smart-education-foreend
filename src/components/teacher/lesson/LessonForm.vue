<template>
  <div class="card">
    <div class="card-header">
      <h3>课程内容自动生成</h3>
    </div>
    <div class="card-body">
      <form class="form" @submit.prevent="generateLesson">
        <subject-select v-model="lessonForm.subjectType" />
        <outline-textarea v-model="lessonForm.courseOutline" />
        <duration-input v-model="lessonForm.duration" />
        <difficulty-radio v-model="lessonForm.difficultyLevel" />
        <form-actions 
          :is-generating="isGenerating" 
          @reset="resetForm"
        />
      </form>
    </div>
  </div>
</template>

<script>
import SubjectSelect from './form/SubjectSelect.vue'
import OutlineTextarea from './form/OutlineTextarea.vue'
import DurationInput from './form/DurationInput.vue'
import DifficultyRadio from './form/DifficultyRadio.vue'
import FormActions from './form/FormActions.vue'

export default {
  name: 'LessonForm',
  components: {
    SubjectSelect,
    OutlineTextarea,
    DurationInput,
    DifficultyRadio,
    FormActions
  },
  emits: ['lesson-generated'],
  data() {
    return {
      isGenerating: false,
      lessonForm: {
        subjectType: 'programming',
        courseOutline: '',
        duration: 45,
        difficultyLevel: 'intermediate'
      }
    }
  },
  methods: {
    generateLesson() {
      this.isGenerating = true
      
      // 模拟API调用
      setTimeout(() => {
        const generatedLesson = this.getGeneratedLesson()
        this.$emit('lesson-generated', generatedLesson)
        this.isGenerating = false
      }, 2000)
    },
    resetForm() {
      this.lessonForm = {
        subjectType: 'programming',
        courseOutline: '',
        duration: 45,
        difficultyLevel: 'intermediate'
      }
      this.$emit('lesson-generated', null)
    },
    getGeneratedLesson() {
      return {
        title: '循环与迭代 - Python编程基础',
        objectives: [
          '理解循环的基本概念和应用场景',
          '掌握Python中for循环和while循环的使用',
          '能够实现基本的迭代算法'
        ],
        keyPoints: [
          'for循环的语法和使用方法',
          'while循环的条件控制',
          '循环嵌套和迭代器概念'
        ],
        contentSections: [
          {
            title: '循环概念介绍',
            content: '循环是编程中最基本的控制结构之一，用于重复执行特定代码块。Python提供了for和while两种主要的循环结构，本节将介绍它们的基本概念和应用场景。',
            duration: 10
          },
          {
            title: 'for循环详解',
            content: 'Python的for循环主要用于遍历序列（如列表、元组、字典、集合、字符串）或其他可迭代对象。我们将学习for循环的基本语法、range()函数的使用以及列表推导式。',
            duration: 15
          },
          {
            title: 'while循环与控制',
            content: 'while循环在条件为真时重复执行代码块。本节将介绍while循环的基本结构、条件控制以及break和continue语句的使用方法。',
            duration: 15
          }
        ]
      }
    }
  }
}
</script> 