<template>
  <div class="form-actions">
    <button class="btn btn-primary" @click="$emit('save')">保存教案</button>
    <button class="btn" @click="$emit('print')">打印预览</button>
  </div>
</template>

<script>
export default {
  name: 'LessonResultActions',
  emits: ['save', 'print']
}
</script> 