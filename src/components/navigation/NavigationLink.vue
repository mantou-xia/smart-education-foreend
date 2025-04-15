<template>
  <router-link :to="to" class="nav-item" :exact="exact">
    <i class="nav-icon">{{ icon }}</i>
    <span>{{ text }}</span>
  </router-link>
</template>

<script>
export default {
  name: 'NavigationLink',
  props: {
    to: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      required: true
    },
    exact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f7fa;
  color: #3f51b5;
}

.nav-item.router-link-active {
  background-color: #f0f2fd;
  color: #3f51b5;
  border-right: 3px solid #3f51b5;
}

.nav-icon {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}
</style> 