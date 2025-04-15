<template>
  <div class="form-actions">
    <button type="submit" class="btn btn-primary" :disabled="isGenerating">
      {{ isGenerating ? '生成中...' : '生成教学内容' }}
    </button>
    <button type="button" class="btn" @click="$emit('reset')">重置</button>
  </div>
</template>

<script>
export default {
  name: 'FormActions',
  props: {
    isGenerating: {
      type: Boolean,
      default: false
    }
  },
  emits: ['reset']
}
</script> 