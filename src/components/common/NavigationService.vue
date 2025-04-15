<template>
  <slot :navigate="navigate" />
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NavigationService',
  setup() {
    const router = useRouter()
    
    const navigate = (path) => {
      if (path) {
        router.push(path)
      }
    }
    
    return {
      navigate
    }
  }
}
</script> 