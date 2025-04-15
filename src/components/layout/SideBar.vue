<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <user-data-provider v-slot="{ userData }">
        <role-navigation-menu :user-role="userData.role" />
      </user-data-provider>
    </div>
  </aside>
</template>

<script>
import UserDataProvider from '@/components/auth/UserDataProvider.vue'
import RoleNavigationMenu from '@/components/navigation/RoleNavigationMenu.vue'

export default {
  name: 'SideBar',
  components: {
    UserDataProvider,
    RoleNavigationMenu
  }
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: white;
  border-right: 1px solid #e8e8e8;
  height: 100%;
  overflow-y: auto;
}

.sidebar-content {
  padding: 20px 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }
}
</style> 