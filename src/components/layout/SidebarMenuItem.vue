<template>
  <li>
    <div v-if="menuItem.divider" class="menu-title"></div>
    <router-link :to="menuItem.path">{{ menuItem.name }}</router-link>
  </li>
</template>

<script>
export default {
  name: 'SidebarMenuItem',
  props: {
    menuItem: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.menu-title {
  padding: 10px 15px;
  font-size: 13px;
  color: #999;
  font-weight: 500;
  margin-top: 10px;
}

a {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
}

a.router-link-active,
a:hover {
  background-color: #f0f2ff;
  color: #3f51b5;
  border-left: 3px solid #3f51b5;
  padding-left: 12px;
}

@media (max-width: 768px) {
  a.router-link-active,
  a:hover {
    border-left: none;
    border-bottom: 3px solid #3f51b5;
    padding-left: 15px;
  }
}
</style> 