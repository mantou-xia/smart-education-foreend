<template>
  <div class="form-group">
    <label>难度级别</label>
    <div class="radio-group">
      <label v-for="option in options" :key="option.value">
        <input 
          type="radio" 
          :value="option.value" 
          :checked="modelValue === option.value" 
          @change="onChange(option.value)" 
        /> 
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DifficultyRadio',
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
        { value: 'basic', label: '基础' },
        { value: 'intermediate', label: '中级' },
        { value: 'advanced', label: '高级' }
      ]
    }
  },
  methods: {
    onChange(value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script> 