<template>
  <nav class="nav">
    <ul>
      <li v-for="item in navItems" :key="item.path">
        <router-link :to="item.path">{{ item.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavMenu',
  data() {
    return {
      navItems: []
    }
  },
  created() {
    this.setNavItems();
  },
  methods: {
    setNavItems() {
      // 假设从用户存储或Vuex/Pinia中获取用户角色
      const userData = this.getUserData();
      
      // 基础导航项，所有用户都可见
      const baseItems = [
        { name: '首页', path: '/' }
      ];
      
      // 打印userData
      console.log(userData);

      // 根据角色添加特定导航项
      switch(userData.role) {
        case 'teacher':
          this.navItems = [
            ...baseItems,
            { name: '教师端', path: '/teacher/lesson-designer' }
          ];
          break;
        case 'student':
          this.navItems = [
            ...baseItems,
            { name: '学生端', path: '/student/assistant' }
          ];
          break;
        case 'admin':
          this.navItems = [
            ...baseItems,
            { name: '系统管理', path: '/admin/dashboard' }
          ];
          break;
        default:
          this.navItems = baseItems;
      }
    },
    getUserData() {
      // 从localStorage获取userData并解析JSON
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          // 解析JSON字符串为对象
          return JSON.parse(userDataStr);
        } catch (e) {
          console.error('解析userData失败:', e);
          // 解析失败时返回默认用户对象
          return { role: 'guest' };
        }
      } else {
        // 未找到userData时返回默认用户对象
        return { role: 'guest' };
      }
    }
  }
}
</script>

<style scoped>
.nav ul {
  display: flex;
  list-style: none;
}

.nav li {
  margin: 0 15px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav a.router-link-active,
.nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style> 