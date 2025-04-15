<template>
  <div class="form-group">
    <label>课程时长（分钟）</label>
    <input 
      type="number" 
      :value="modelValue" 
      @input="onInput" 
      placeholder="例如：45" 
    />
  </div>
</template>

<script>
export default {
  name: 'DurationInput',
  props: {
    modelValue: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', Number(event.target.value))
    }
  }
}
</script> 