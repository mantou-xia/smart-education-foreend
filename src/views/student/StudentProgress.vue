<template>
  <div class="student-progress">
    <h2>学习进度</h2>
    
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
      <div class="progress-list">
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
</template>

<script>
export default {
  name: 'StudentProgress',
  data() {
    return {
      overallProgress: 45,
      stats: {
        completedCourses: 2,
        completedAssignments: 5,
        studyHours: 36
      },
      courseProgress: [
        {
          id: 1,
          name: '计算机基础',
          progress: 60
        },
        {
          id: 2,
          name: 'Web开发',
          progress: 30
        }
      ]
    }
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
</style> 