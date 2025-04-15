<template>
  <div class="student-courses">
    <h2>我的课程</h2>
    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="course-header">
          <h3>{{ course.name }}</h3>
          <span class="course-status" :class="course.status">{{ course.statusText }}</span>
        </div>
        <div class="course-info">
          <p>{{ course.description }}</p>
          <div class="course-meta">
            <span>教师：{{ course.teacher }}</span>
            <span>进度：{{ course.progress }}%</span>
          </div>
        </div>
        <div class="course-actions">
          <button class="btn btn-primary" @click="enterCourse(course)">进入课程</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentCourses',
  data() {
    return {
      courses: [
        {
          id: 1,
          name: '计算机基础',
          description: '学习计算机基础知识，包括操作系统、网络基础等内容',
          teacher: '张老师',
          progress: 60,
          status: 'in-progress',
          statusText: '学习中'
        },
        {
          id: 2,
          name: 'Web开发',
          description: '学习HTML、CSS、JavaScript等Web开发技术',
          teacher: '李老师',
          progress: 30,
          status: 'in-progress',
          statusText: '学习中'
        }
      ]
    }
  },
  methods: {
    enterCourse(course) {
      // TODO: 实现进入课程的具体逻辑
      console.log('进入课程:', course.name)
    }
  }
}
</script>

<style scoped>
.student-courses {
  padding: 20px;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.course-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.course-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.course-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.course-status.in-progress {
  background: #e6f7ff;
  color: #1890ff;
}

.course-status.completed {
  background: #f6ffed;
  color: #52c41a;
}

.course-info {
  flex: 1;
}

.course-info p {
  color: #666;
  margin-bottom: 15px;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
}

.course-actions {
  margin-top: 15px;
  text-align: right;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}
</style> 