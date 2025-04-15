<template>
  <div id="app">
    <!-- 身份验证页面不显示应用布局 -->
    <router-view v-if="$route.meta.authPage"/>
    
    <!-- 主应用布局 -->
    <template v-else>
      <app-header />
      
      <div class="main-container">
        <SideBar />
        
        <main class="content">
          <content-header />
          <div class="content-body">
            <router-view />
          </div>
        </main>
      </div>
    </template>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import ContentHeader from '@/components/layout/ContentHeader.vue';
import SideBar from './components/layout/SideBar.vue';
export default {
  name: 'App',
  components: {
    AppHeader,
    SideBar,
    ContentHeader
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #f5f7fa;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主容器样式 */
.main-container {
  display: flex;
  flex: 1;
}

/* 内容区域样式 */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.content-body {
  margin-bottom: 20px;
}

/* 卡片样式 */
.card {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 500;
}

.card-body {
  padding: 20px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

.form-group textarea {
  height: 120px;
  resize: vertical;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
}

.radio-group input {
  width: auto;
  margin-right: 5px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3f51b5;
  border-color: #3f51b5;
  color: white;
}

.btn-primary:hover {
  background-color: #303f9f;
}

.btn:hover {
  opacity: 0.9;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
}
</style>
