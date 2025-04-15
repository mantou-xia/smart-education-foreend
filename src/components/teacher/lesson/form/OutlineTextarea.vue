<template>
  <div class="form-group">
    <label>课程大纲</label>
    <textarea 
      :value="modelValue" 
      @input="onInput" 
      placeholder="请输入课程大纲内容"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'OutlineTextarea',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script> 