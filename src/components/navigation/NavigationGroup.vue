<template>
  <div class="nav-group">
    <div class="nav-group-title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'NavigationGroup',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.nav-group {
  margin-bottom: 20px;
}

.nav-group-title {
  padding: 0 20px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style> 