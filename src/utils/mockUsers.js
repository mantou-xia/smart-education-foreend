/**
 * 模拟用户数据库
 * 实际项目中，这些数据应该存储在后端数据库中
 */

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
    username: 'teacher1',
    password: '123456',
    role: 'teacher',
    name: '王老师'
  },
  {
    id: 3,
    username: 'teacher2',
    password: '123456',
    role: 'teacher',
    name: '李老师'
  },
  {
    id: 4,
    username: 'student1',
    password: '123456',
    role: 'student',
    name: '张同学'
  },
  {
    id: 5,
    username: 'student2',
    password: '123456',
    role: 'student',
    name: '刘同学'
  }
]

/**
 * 模拟用户登录验证
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Object|null} 成功返回用户信息，失败返回null
 */
export function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password)
  
  if (user) {
    // 不返回密码字段
    // eslint-disable-next-line
    const { password, ...userInfo } = user
    return userInfo
  }
  
  return null
}

/**
 * 根据用户角色获取默认首页路径
 * @param {string} role 用户角色
 * @returns {string} 首页路径
 */
export function getHomePageByRole(role) {
  switch(role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/lesson-designer' 
    case 'student':
      return '/student/courses'
    default:
      return '/'
  }
} 