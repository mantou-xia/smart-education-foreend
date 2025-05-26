<template>
  <div class="student-progress">
    <h2>学习进度</h2>
    
    <div v-if="loading" class="loading-state">
      加载中...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else>
      <div class="progress-overview">
        <div class="overview-card">
          <h3>总体进度</h3>
          <div class="progress-circle">
            <div class="circle-progress" :style="{ '--progress': overallProgress }">
              <span class="progress-text">{{ overallProgress }}%</span>
            </div>
          </div>
        </div>
        
        <div class="overview-card">
          <h3>学习统计</h3>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-label">已学习课程</span>
              <span class="stat-value">{{ stats.completedCourses }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">完成作业</span>
              <span class="stat-value">{{ stats.completedAssignments }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">学习时长</span>
              <span class="stat-value">{{ stats.studyHours }}小时</span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="course-progress">
        <h3>课程进度详情</h3>
        <div v-if="courseProgress.length === 0" class="empty-state">
          暂无课程进度数据
        </div>
        <div v-else class="progress-list">
          <div v-for="course in courseProgress" :key="course.id" class="progress-item">
            <div class="course-name">{{ course.name }}</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
            </div>
            <div class="progress-percent">{{ course.progress }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { courseAPI, learningProgressAPI, studentAPI } from '@/api/api';

export default {
  name: 'StudentProgress',
  setup() {
    const loading = ref(false);
    const error = ref('');
    const overallProgress = ref(0);
    const stats = reactive({
      completedCourses: 0,
      completedAssignments: 0,
      studyHours: 0
    });
    const courseProgress = ref([]);
    
    // 获取学生学习进度数据
    const fetchProgressData = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        // 直接使用 getSelfStudentInfo() 获取当前登录学生信息
        const selfStudentInfo = await studentAPI.getSelfStudentInfo();
        
        if (!selfStudentInfo || !selfStudentInfo.studentId) {
          throw new Error('无法获取学生信息');
        }
        
        const studentId = selfStudentInfo.studentId;
        console.log('获取当前学生ID:', studentId);
        
        // 获取学生的整体学习进度
        const overallData = await learningProgressAPI.getOverallProgress(studentId);
        overallProgress.value = Math.round(overallData.overallPercentage || 0);
        
        // 获取学习统计数据
        const statisticsData = await learningProgressAPI.getProgressStatistics(studentId);
        stats.completedCourses = statisticsData.completedCourses || 0;
        stats.completedAssignments = statisticsData.completedAssignments || 0;
        stats.studyHours = statisticsData.totalStudyHours || 0;
        
        // 获取所有课程
        const allCourses = await courseAPI.getAllCourses();
        
        // 获取课程进度详情
        const courseProgressPromises = allCourses.map(async courseItem => {
          try {
            const progressData = await learningProgressAPI.getCourseProgress(studentId, courseItem.id);
            return {
              id: courseItem.id,
              name: courseItem.name,
              description: courseItem.description || '暂无描述',
              progress: Math.round(progressData.progressPercentage || 0)
            };
          } catch (e) {
            console.error(`获取课程${courseItem.name}进度失败:`, e);
            return {
              id: courseItem.id,
              name: courseItem.name,
              description: courseItem.description || '暂无描述',
              progress: 0
            };
          }
        });
        
        courseProgress.value = await Promise.all(courseProgressPromises);
        
      } catch (e) {
        console.error('获取学习进度数据失败:', e);
        error.value = e.message || '获取学习进度数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    // 组件挂载时获取数据
    onMounted(fetchProgressData);
    
    return {
      loading,
      error,
      overallProgress,
      stats,
      courseProgress
    };
  }
}
</script>

<style scoped>
.student-progress {
  padding: 20px;
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.overview-card h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.progress-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.circle-progress {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#1890ff calc(var(--progress) * 1%), #f0f0f0 0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.course-progress {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.course-progress h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-item {
  display: grid;
  grid-template-columns: 1fr 2fr 60px;
  gap: 15px;
  align-items: center;
}

.course-name {
  color: #333;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1890ff;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percent {
  text-align: right;
  color: #666;
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
</style> 