import { createRouter, createWebHistory } from 'vue-router'
import { cleanRedundantAuth } from '@/utils/auth'

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
      },
      {
        path: 'api-test-center',
        name: 'StudentAPITestCenter',
        component: () => import('../views/student/StudentAPITestCenter.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/attendance',
        name: 'StudentAttendanceAPITest',
        component: () => import('../views/student/APITestComponents/AttendanceAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/exam',
        name: 'StudentExamAPITest',
        component: () => import('../views/student/APITestComponents/StudentExamAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/assistant',
        name: 'StudentAssistantAPITest',
        component: () => import('../views/student/APITestComponents/StudentAssistantAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/auth',
        name: 'StudentAuthAPITest',
        component: () => import('../views/student/APITestComponents/AuthAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/student',
        name: 'StudentStudentAPITest',
        component: () => import('../views/student/APITestComponents/StudentAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/course',
        name: 'StudentCourseAPITest',
        component: () => import('../views/student/APITestComponents/CourseAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/learning-progress',
        name: 'StudentLearningProgressAPITest',
        component: () => import('../views/student/APITestComponents/LearningProgressAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'api-test/learning-plan',
        name: 'StudentLearningPlanAPITest',
        component: () => import('../views/student/APITestComponents/LearningPlanAPITest.vue'),
        meta: { bypassAuth: true }
      },
      {
        path: 'global-api-test-center',
        name: 'GlobalAPITestCenter',
        component: () => import('../views/student/GlobalAPITestCenter.vue'),
        meta: { bypassAuth: true }
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
  console.log(`路由守卫: 从 ${from.path} 到 ${to.path}`);
  
  // 每次路由导航时清理冗余认证信息
  cleanRedundantAuth();
  
  // 如果路由元信息中有 bypassAuth，直接放行
  if (to.meta.bypassAuth) {
    console.log('API测试页面，直接放行');
    return next();
  }
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  console.log('路由守卫: 登录状态:', isLoggedIn);
  
  // 检查token状态
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (token) {
    console.log('路由守卫: 已检测到token');
  }
  
  if (refreshToken && !isLoggedIn) {
    console.warn('异常情况: 检测到refreshToken但用户未登录，清除token');
    // 清除意外残留的token
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  }
  
  let userData = null
  
  // 尝试获取用户数据（支持两种可能的键名）
  try {
    // 首先尝试从userData获取
    userData = JSON.parse(localStorage.getItem('userData'))
    
    // 如果不存在，尝试从user_info获取
    if (!userData) {
      const userInfo = JSON.parse(localStorage.getItem('user_info'))
      if (userInfo) {
        // 从user_info中提取角色信息
        let role = 'student' // 默认角色
        if (userInfo.roles && userInfo.roles.length > 0) {
          // 处理可能的角色格式 "ROLE_XXX"
          const roleStr = String(userInfo.roles[0]).toUpperCase()
          if (roleStr.includes('TEACHER')) {
            role = 'teacher'
          } else if (roleStr.includes('STUDENT')) {
            role = 'student'
          } else if (roleStr.includes('ADMIN')) {
            role = 'admin'
          }
        } else if (userInfo.userType) {
          // 尝试使用userType字段
          role = userInfo.userType
        }
        
        userData = {
          username: userInfo.username,
          role: role
        }
        
        // 同步保存到userData键，确保一致性
        localStorage.setItem('userData', JSON.stringify(userData))
      }
    }
  } catch (e) {
    console.error('无法解析用户数据', e)
  }
  
  // 如果路径是登录页或注册页，直接放行
  if (to.name === 'Login' || to.name === 'Register') {
    console.log('路由守卫: 前往登录/注册页面，直接放行');
    next();
    return;
  }
  
  console.log('路由守卫检查用户数据:', userData)
  
  // 需要登录的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn || !userData) {
      console.log('用户未登录或数据无效，重定向到登录页')
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
    
    console.log('角色权限检查:', hasRoleAccess, '用户角色:', userData.role)
    
    if (!hasRoleAccess) {
      // 用户没有权限访问该页面，重定向到对应角色的默认页面
      console.log('用户无权限访问此路由，重定向到角色默认页面')
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