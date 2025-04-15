<template>
  <div class="form-group">
    <label>学科类型</label>
    <select :value="modelValue" @input="onInput">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SubjectSelect',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      options: [
        { value: 'programming', label: '计算机编程' },
        { value: 'math', label: '数学' },
        { value: 'physics', label: '物理' },
        { value: 'english', label: '英语' }
      ]
    }
  },
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script> 