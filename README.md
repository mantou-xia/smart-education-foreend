# 智能教学实训系统文档

## 1. 项目概述

### 1.1 系统架构
本系统采用Vue.js框架构建，实现教师、学生和管理员不同角色的智能教学功能。

### 1.2 目录结构
```
src/
├── assets/                  # 静态资源文件夹
│   ├── images/              # 图片资源
│   └── styles/              # 全局样式
│
├── components/              # 组件文件夹
│   ├── auth/                # 身份验证相关组件
│   ├── common/              # 通用组件
│   ├── home/                # 首页相关组件
│   ├── layout/              # 布局相关组件
│   ├── navigation/          # 导航相关组件
│   ├── teacher/             # 教师相关组件
│   └── ...                  # 其他组件
│
├── router/                  # 路由配置
│   └── index.js             # 路由定义
│
├── utils/                   # 工具函数
│   ├── mockUsers.js         # 模拟用户数据
│   └── ...                  # 其他工具函数
│
├── views/                   # 页面视图组件
│   ├── auth/                # 认证相关页面
│   ├── student/             # 学生相关页面
│   ├── teacher/             # 教师相关页面
│   ├── admin/               # 管理员相关页面
│   └── Home.vue             # 首页视图
│
├── App.vue                  # 根组件
└── main.js                  # 应用入口文件
```

## 2. 核心组件详细文档

### 2.1 布局组件 (layout/)

#### 2.1.1 NavMenu.vue

##### 2.1.1.1 组件概述
导航菜单组件，根据用户角色动态显示不同的导航选项。

##### 2.1.1.2 数据结构
```javascript
data() {
  return {
    navItems: [] // 导航菜单项数组
  }
}
```

##### 2.1.1.3 生命周期钩子
```javascript
created() {
  this.setNavItems(); // 组件创建时初始化导航菜单
}
```

##### 2.1.1.4 方法详解
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| `setNavItems()` | 无 | 无 | 根据用户角色设置导航菜单项 |
| `getUserData()` | 无 | Object | 从localStorage获取并解析用户数据JSON |

##### 2.1.1.5 方法实现
###### 2.1.1.5.1 setNavItems()
```javascript
setNavItems() {
  // 获取用户数据
  const userData = this.getUserData();
  
  // 基础导航项，所有用户都可见
  const baseItems = [
    { name: '首页', path: '/' }
  ];
  
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
}
```

###### 2.1.1.5.2 getUserData()
```javascript
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
```

##### 2.1.1.6 角色权限控制
| 用户角色 | 可见菜单项 |
|---------|------------|
| 所有用户/guest | 首页 |
| teacher | 首页、教师端 |
| student | 首页、学生端 |
| admin | 首页、系统管理 |

##### 2.1.1.7 样式定义
```css
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
```

##### 2.1.1.8 使用示例
```vue
<template>
  <nav-menu></nav-menu>
</template>

<script>
import NavMenu from '@/components/layout/NavMenu.vue'

export default {
  components: {
    NavMenu
  }
}
</script>
```

#### 2.1.2 AppHeader.vue

##### 2.1.2.1 组件概述
应用头部组件，显示应用标题、导航菜单和用户信息。

##### 2.1.2.2 组件依赖
- NavMenu.vue - 导航菜单组件

##### 2.1.2.3 功能特性
- 显示应用logo和标题
- 集成导航菜单
- 显示用户信息和操作下拉菜单
- 响应式设计，适配不同屏幕尺寸

#### 2.1.3 SideBar.vue

##### 2.1.3.1 组件概述
侧边栏组件，显示用户信息和角色相关菜单。

##### 2.1.3.2 组件依赖
- UserDataProvider.vue - 用户数据提供者
- RoleNavigationMenu.vue - 角色导航菜单

### 2.2 认证组件 (auth/)

#### 2.2.1 LoginForm.vue

##### 2.2.1.1 组件概述
登录表单组件，处理用户登录逻辑。

##### 2.2.1.2 数据结构
```javascript
const form = reactive({
  username: '',
  password: '',
  remember: false
})

const errors = reactive({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const loginError = ref('')
```

##### 2.2.1.3 方法详解
| 方法名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| `validateUsername()` | 无 | Boolean | 验证用户名是否有效 |
| `validatePassword()` | 无 | Boolean | 验证密码是否有效 |
| `validateForm()` | 无 | Boolean | 验证整个表单是否有效 |
| `submitForm()` | 无 | 无 | 提交表单并处理登录逻辑 |

##### 2.2.1.4 事件
- `@login` - 登录成功后触发，传递用户信息和主页路径

##### 2.2.1.5 外部依赖
```javascript
import { authenticateUser, getHomePageByRole } from '@/utils/mockUsers'
```

#### 2.2.2 RegisterForm.vue

##### 2.2.2.1 组件概述
注册表单组件，处理用户注册逻辑。

#### 2.2.3 UserDataProvider.vue

##### 2.2.3.1 组件概述
用户数据提供组件，从持久化存储中获取用户信息。

##### 2.2.3.2 数据结构
```javascript
const userData = reactive({
  id: 0,
  username: '',
  name: '访客',
  role: 'guest'
})
```

##### 2.2.3.3 生命周期钩子
```javascript
onMounted(() => {
  // 从持久化存储获取用户数据
  const storedUser = sessionStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    Object.assign(userData, user)
  }
})
```

### 2.3 工具函数 (utils/)

#### 2.3.1 mockUsers.js

##### 2.3.1.1 文件概述
提供模拟用户数据和相关功能函数。

##### 2.3.1.2 数据结构
```javascript
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    role: 'admin',
    name: '系统管理员'
  },
  {
    id: 2,
    username: 'teacher',
    password: '123456',
    role: 'teacher',
    name: '张教授'
  },
  {
    id: 3,
    username: 'student',
    password: '123456',
    role: 'student',
    name: '李同学'
  }
]
```

##### 2.3.1.3 函数详解
| 函数名 | 参数 | 返回值 | 功能描述 |
|--------|------|--------|----------|
| `authenticateUser(username, password)` | username: String, password: String | Object/null | 验证用户凭据并返回用户信息 |
| `getHomePageByRole(role)` | role: String | String | 根据用户角色获取默认主页路径 |

##### 2.3.1.4 函数实现
###### 2.3.1.4.1 authenticateUser()
```javascript
export function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password)
  return user ? { ...user, password: undefined } : null
}
```

###### 2.3.1.4.2 getHomePageByRole()
```javascript
export function getHomePageByRole(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/lesson-designer'
    case 'student':
      return '/student/assistant'
    default:
      return '/'
  }
}
```

### 2.4 首页组件 (home/)

#### 2.4.1 UserFeatureGrid.vue

##### 2.4.1.1 组件概述
根据用户角色显示不同的功能卡片。

##### 2.4.1.2 Props
| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `userRole` | String | 'guest' | 用户角色 |

##### 2.4.1.3 数据结构
```javascript
data() {
  return {
    studentFeatures: [
      { 
        icon: 'school', 
        title: '学习助手', 
        description: '智能问答解惑，个性化学习辅导', 
        route: '/student/assistant' 
      },
      // 其他学生功能...
    ],
    teacherFeatures: [
      { 
        icon: 'edit', 
        title: '智能备课', 
        description: '快速生成教案与教学材料', 
        route: '/teacher/lesson-designer' 
      },
      // 其他教师功能...
    ],
    adminFeatures: [
      { 
        icon: 'dashboard', 
        title: '系统管理', 
        description: '管理系统设置与用户权限', 
        route: '/admin/dashboard' 
      },
      // 其他管理员功能...
    ]
  }
}
```

##### 2.4.1.4 计算属性
```javascript
computed: {
  features() {
    switch(this.userRole) {
      case 'student': return this.studentFeatures
      case 'teacher': return this.teacherFeatures
      case 'admin': return this.adminFeatures
      default: return []
    }
  }
}
```

### 2.5 导航组件 (navigation/)

#### 2.5.1 RoleNavigationMenu.vue

##### 2.5.1.1 组件概述
根据用户角色显示不同的侧边栏导航菜单。

##### 2.5.1.2 Props
| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `userRole` | String | 'guest' | 用户角色 |

##### 2.5.1.3 计算属性
```javascript
computed: {
  navigationItems() {
    switch(this.userRole) {
      case 'teacher':
        return [
          { header: '教师功能' },
          { title: '智能备课', icon: 'edit', path: '/teacher/lesson-designer' },
          { title: '考核生成', icon: 'assignment', path: '/teacher/assessment' },
          { title: '学情分析', icon: 'analytics', path: '/teacher/data-analysis' },
          // 更多教师菜单项...
        ]
      case 'student':
        return [
          { header: '学习中心' },
          { title: '学习助手', icon: 'school', path: '/student/assistant' },
          { title: '我的课程', icon: 'book', path: '/student/courses' },
          { title: '学习进度', icon: 'trending_up', path: '/student/progress' },
          // 更多学生菜单项...
        ]
      // 其他角色的菜单项...
    }
  }
}
```

## 3. 路由配置

### 3.1 基本路由结构
```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  // 其他路由...
]
```

### 3.2 路由分组

#### 3.2.1 认证路由
```javascript
{
  path: '/auth',
  component: AuthLayout,
  meta: { authPage: true },
  children: [
    {
      path: 'login',
      name: 'Login',
      component: Login
    },
    {
      path: 'register',
      name: 'Register',
      component: Register
    }
  ]
}
```

#### 3.2.2 学生路由
```javascript
{
  path: '/student',
  component: StudentDashboard,
  meta: { requiresAuth: true, role: ['student'] },
  children: [
    {
      path: 'assistant',
      name: 'StudentAssistant',
      component: StudentAssistant
    },
    // 其他学生路由...
  ]
}
```

#### 3.2.3 教师路由
```javascript
{
  path: '/teacher',
  component: TeacherDashboard,
  meta: { requiresAuth: true, role: ['teacher'] },
  children: [
    {
      path: 'lesson-designer',
      name: 'LessonDesigner',
      component: LessonDesigner
    },
    // 其他教师路由...
  ]
}
```

#### 3.2.4 管理员路由
```javascript
{
  path: '/admin',
  component: AdminDashboard,
  meta: { requiresAuth: true, role: ['admin'] },
  children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('../views/admin/Dashboard.vue')
    },
    // 其他管理员路由...
  ]
}
```

### 3.3 路由守卫
```javascript
router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
  const userRole = sessionStorage.getItem('userRole')
  
  // 需要认证的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'Login' })
      return
    }
    
    // 角色权限检查
    if (to.meta.role && !to.meta.role.includes(userRole)) {
      next({ path: '/' })
      return
    }
  }
  
  // 已登录用户访问登录页面时重定向
  if (isLoggedIn && to.matched.some(record => record.meta.authPage)) {
    next({ path: '/' })
    return
  }
  
  next()
})
```

## 4. 样式规范

### 4.1 颜色系统
| 变量名 | 颜色值 | 用途 |
|--------|--------|------|
| `--primary-color` | #3f51b5 | 主题色 |
| `--secondary-color` | #f50057 | 强调色 |
| `--background-color` | #f5f7fa | 背景色 |
| `--success-color` | #4caf50 | 成功状态 |
| `--warning-color` | #ff9800 | 警告状态 |
| `--error-color` | #f44336 | 错误状态 |
| `--text-primary` | #333333 | 主要文本 |
| `--text-secondary` | #666666 | 次要文本 |

### 4.2 组件样式
```css
/* 卡片样式 */
.card {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  transition: all 0.3s ease;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}
```

## 5. 开发规范

### 5.1 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `NavMenu.vue` |
| 组件名称 | PascalCase | `export default { name: 'NavMenu' }` |
| Props | camelCase | `:userRole="userData.role"` |
| 事件 | kebab-case | `@role-change="handleRoleChange"` |
| 方法 | camelCase | `getUserRole()` |
| CSS类 | kebab-case | `.nav-menu` |

### 5.2 代码注释规范
```javascript
/**
 * 设置导航菜单项
 * 根据用户角色动态生成不同的导航菜单
 * @returns {void}
 */
setNavItems() {
  // 获取用户角色
  const userRole = this.getUserRole();
  
  // 设置基础菜单项
  // ...
}
```

### 5.3 提交规范
| 类型 | 描述 | 示例 |
|------|------|------|
| feat | 新功能 | `feat: 添加用户角色导航菜单` |
| fix | 修复bug | `fix: 修复导航菜单在小屏幕上显示问题` |
| docs | 文档更新 | `docs: 更新NavMenu组件文档` |
| style | 代码格式 | `style: 格式化NavMenu组件代码` |
| refactor | 重构 | `refactor: 重构导航菜单生成逻辑` |

## 6. 组件使用指南

### 6.1 NavMenu组件

#### 6.1.1 基本使用
```vue
<template>
  <div class="app-header">
    <nav-menu />
  </div>
</template>

<script>
import NavMenu from '@/components/layout/NavMenu.vue'

export default {
  components: {
    NavMenu
  }
}
</script>
```

#### 6.1.2 定制样式
```vue
<template>
  <nav-menu class="custom-nav" />
</template>

<style scoped>
.custom-nav {
  background-color: #1e88e5;
}
</style>
```

### 6.2 用户认证流程

#### 6.2.1 登录流程
1. 用户输入用户名和密码
2. 验证用户凭据
3. 成功后将用户信息以JSON格式存储到localStorage
4. 根据用户角色跳转到相应页面

#### 6.2.2 Code示例
```javascript
// 登录处理
async function login(username, password) {
  try {
    const user = authenticateUser(username, password);
    if (user) {
      // 存储用户信息到localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
      
      // 获取用户角色对应的主页路径
      const homePage = getHomePageByRole(user.role);
      
      // 跳转到相应页面
      router.push(homePage);
    } else {
      throw new Error('用户名或密码错误');
    }
  } catch (error) {
    console.error('登录失败:', error);
    return { success: false, message: error.message };
  }
}
```

## 7. 测试账号

### 7.1 管理员账号
- 用户名: admin
- 密码: 123456

### 7.2 教师账号
- 用户名: teacher
- 密码: 123456

### 7.3 学生账号
- 用户名: student
- 密码: 123456

## 8. 常见问题

### 8.1 用户角色没有正确加载
检查localStorage中是否正确存储了用户数据：
```javascript
// 检查用户数据
console.log('Current userData:', localStorage.getItem('userData'));
// 尝试解析
try {
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log('Parsed userData:', userData);
  console.log('User role:', userData.role);
} catch (e) {
  console.error('解析userData失败:', e);
}
```

### 8.2 导航菜单显示错误
确保已经在组件创建时调用了`setNavItems()`方法：
```javascript
created() {
  this.setNavItems();
}
```

### 8.3 路由权限问题
检查路由元信息中的角色设置是否正确：
```javascript
{
  path: '/admin/dashboard',
  component: AdminDashboard,
  meta: { requiresAuth: true, role: ['admin'] }
}
```
