<template>
  <div class="student-courses">
    <h2>我的课程</h2>
    <div v-if="loading" class="loading-state">
      加载中...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="course-header">
          <h3>{{ course.name }}</h3>
          <span class="course-status" :class="getStatusClass(course.progress)">
            {{ getStatusText(course.progress) }}
          </span>
        </div>
        <div class="course-info">
          <p>{{ course.description || '暂无描述' }}</p>
          <div class="course-meta">
            <span>教师：{{ course.teacherName || '未指定' }}</span>
            <span>进度：{{ Math.round(course.progress || 0) }}%</span>
          </div>
        </div>
        <div class="course-actions">
          <button class="btn btn-primary" @click="enterCourse(course)">进入课程</button>
        </div>
      </div>
      <div v-if="courses.length === 0" class="empty-state">
        暂无课程数据
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUserInfo, getToken } from '@/utils/auth';
import { course, learningProgress, student } from '@/api/api';

export default {
  name: 'StudentCourses',
  setup() {
    const courses = ref([]);
    const loading = ref(false);
    const error = ref('');
    
    // 获取学生课程数据
    const fetchCourses = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        // 获取当前登录的用户信息
        const userInfo = getUserInfo();
        if (!userInfo) {
          throw new Error('无法获取用户信息，请重新登录');
        }
        
        // 获取学生ID
        let studentId;
        
        // 直接通过API获取学生ID
        if (userInfo && userInfo.username) {
            try {
              // 通过用户名获取学生信息
              const apiStudentInfo = await student.getStudentByUsername(userInfo.username);
            if (apiStudentInfo && apiStudentInfo.studentId) {
              studentId = apiStudentInfo.studentId;
                console.log('通过API获取学生ID:', studentId);
            } else {
              throw new Error('API返回的学生信息不完整');
              }
            } catch (e) {
              console.error('获取学生信息失败:', e);
            throw new Error('无法通过API获取学生ID');
          }
        } else {
          throw new Error('无法获取用户名');
        }
        
        if (!studentId) {
          throw new Error('无法获取学生ID');
        }
        
        // 获取当前token
        const token = getToken();
        
        // 获取所有课程，传递token
        const allCourses = await course.getAllCourses(token);
        
        // 获取学生的课程进度，传递token
        const progressData = await learningProgress.getStudentProgress(studentId, token);
        
        // 合并课程信息和进度信息
        const coursesWithProgress = allCourses.map(courseItem => {
          // 查找该课程的进度信息
          const progress = progressData.find(p => p.courseId === courseItem.id);
          
          return {
            ...courseItem,
            progress: progress ? progress.progressPercentage : 0
          };
        });
        
        courses.value = coursesWithProgress;
      } catch (e) {
        console.error('获取课程数据失败:', e);
        
        // 提供更详细的错误信息
        let errorMessage = '获取课程数据失败，请稍后重试';
        
        if (e.response) {
          // 服务器返回错误
          errorMessage = `服务器错误: ${e.response.data?.message || e.response.statusText}`;
        } else if (e.request) {
          // 请求已发出，但没有收到响应
          errorMessage = '网络错误：未能连接到服务器';
        } else {
          // 在设置请求时发生了错误
          errorMessage = `请求错误: ${e.message}`;
        }
        
        error.value = errorMessage;
      } finally {
        loading.value = false;
      }
    };
    
    const getStatusClass = (progress) => {
      if (progress >= 100) return 'completed';
      if (progress > 0) return 'in-progress';
      return 'not-started';
    };
    
    const getStatusText = (progress) => {
      if (progress >= 100) return '已完成';
      if (progress > 0) return '学习中';
      return '未开始';
    };
    
    const enterCourse = (course) => {
      // 实现进入课程的具体逻辑
      console.log('进入课程:', course.name);
      // 可以跳转到课程详情页
      // router.push({ name: 'CourseDetail', params: { id: course.id } });
    };
    
    // 组件挂载时获取课程数据
    onMounted(fetchCourses);
    
    return {
      courses,
      loading,
      error,
      getStatusClass,
      getStatusText,
      enterCourse
    };
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

.course-status.not-started {
  background: #f5f5f5;
  color: #999;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.error-state {
  color: #f5222d;
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