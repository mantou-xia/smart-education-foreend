<template>
  <div class="home">
    <user-data-provider v-slot="{ userData }">
      <user-welcome-message :user-role="userData.role" :user-name="userData.name" />
      
      <navigation-service v-slot="{ navigate }">
        <user-feature-grid :user-role="userData.role" @navigate="navigate" />
      </navigation-service>
    </user-data-provider>
  </div>
</template>

<script>
import UserDataProvider from '@/components/auth/UserDataProvider.vue'
import UserWelcomeMessage from '@/components/home/UserWelcomeMessage.vue'
import UserFeatureGrid from '@/components/home/UserFeatureGrid.vue'
import NavigationService from '@/components/common/NavigationService.vue'

export default {
  name: 'HomeView',
  components: {
    UserDataProvider,
    UserWelcomeMessage,
    UserFeatureGrid,
    NavigationService
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style> 