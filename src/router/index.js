import { createRouter, createWebHistory } from 'vue-router'

// 导入路由视图组件
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import AuthLayout from '../views/auth/AuthLayout.vue'
import StudentDashboard from '../views/student/StudentDashboard.vue'
import TeacherDashboard from '../views/teacher/TeacherDashboard.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { authPage: true },
    children: [
      {
        path: '',
        redirect: { name: 'Login' }
      },
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
  },
  {
    path: '/student',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: ['student'] },
    children: [
      {
        path: '',
        redirect: { name: 'StudentCourses' }
      },
      {
        path: 'courses',
        name: 'StudentCourses',
        component: () => import('../views/student/StudentCourses.vue')
      },
      {
        path: 'assignments',
        name: 'StudentAssignments',
        component: () => import('../views/student/StudentAssignments.vue')
      },
      {
        path: 'progress',
        name: 'StudentProgress',
        component: () => import('../views/student/StudentProgress.vue')
      },
      {
        path: 'assistant',
        name: 'StudentAssistant',
        component: () => import('../views/student/StudentAssistant.vue')
      },
      {
        path: 'learning-path',
        name: 'StudentLearningPath',
        component: () => import('../views/student/StudentLearningPath.vue')
      }
    ]
  },
  {
    path: '/teacher',
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: ['teacher'] },
    children: [
      {
        path: '',
        redirect: { name: 'LessonDesigner' }
      },
      {
        path: 'lesson-designer',
        name: 'LessonDesigner',
        component: () => import('../views/teacher/LessonDesigner.vue'),
      },
      {
        path: 'assessment',
        name: 'Assessment',
        component: () => import('../views/teacher/HomeworkAssessment.vue'),
      },
      {
        path: 'data-analysis',
        name: 'DataAnalysis',
        component: () => import('../views/teacher/DataAnalysis.vue'),
      },
      {
        path: 'students',
        name: 'StudentManagement',
        component: () => import('../views/teacher/StudentManagement.vue'),
      }
    ]
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, role: ['admin'] },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'monitor',
        name: 'SystemMonitor',
        component: () => import('../views/admin/SystemMonitor.vue')
      },
      {
        path: 'config',
        name: 'SystemConfig',
        component: () => import('../views/admin/SystemConfig.vue')
      }
    ]
  },
  // 捕获所有未匹配的路由，重定向到登录页
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Login' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，检查用户登录状态和权限
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  let userData = null
  
  // 尝试获取用户数据
  try {
    userData = JSON.parse(localStorage.getItem('userData'))
  } catch (e) {
    console.error('无法解析用户数据', e)
  }
  
  // 需要登录的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn || !userData) {
      next({ name: 'Login' })
      return
    }
    
    // 检查角色权限
    const hasRoleAccess = to.matched.every(record => {
      // 如果路由没有指定角色要求，则允许访问
      if (!record.meta.role) {
        return true
      }
      
      // 检查用户角色是否在允许的角色列表中
      return Array.isArray(record.meta.role) && record.meta.role.includes(userData.role)
    })
    
    if (!hasRoleAccess) {
      // 用户没有权限访问该页面，重定向到对应角色的默认页面
      switch(userData.role) {
        case 'admin':
          next({ name: 'AdminDashboard' })
          break
        case 'teacher':
          next({ name: 'LessonDesigner' })
          break
        case 'student':
          next({ name: 'StudentCourses' })
          break
        default:
          next({ name: 'Login' })
      }
    } else {
      next()
    }
  } else {
    // 如果已登录，并且前往登录/注册页，则根据角色重定向到对应的首页
    if (isLoggedIn && userData && to.path.startsWith('/auth')) {
      switch(userData.role) {
        case 'admin':
          next({ name: 'AdminDashboard' })
          break
        case 'teacher':
          next({ name: 'LessonDesigner' })
          break
        case 'student':
          next({ name: 'StudentCourses' })
          break
        default:
          next()
      }
    } else {
      next()
    }
  }
})

export default router 