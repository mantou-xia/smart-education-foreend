<template>
  <div class="learning-path-page">
    <div class="page-header">
      <h1>个性化学习路径</h1>
      <p class="subtitle">基于你的学习情况，为你定制专属学习计划</p>
    </div>

    <div v-if="loading" class="loading-state">
      加载中...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else class="features-grid">
      <!-- 知识图谱导航 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">🗺️</i>
          <h3>知识图谱导航</h3>
        </div>
        <div class="card-content">
          <div class="knowledge-map">
            <div class="map-container">
              <div v-if="knowledgePoints.length === 0" class="empty-state">
                暂无知识点数据
              </div>
              <div v-else class="map-placeholder">
                <div v-for="point in knowledgePoints" :key="point.id"
                     class="node" :style="getNodeStyle(point)">
                  {{ point.name }}
                </div>
                <div class="connection"></div>
              </div>
            </div>
            <div class="map-controls">
              <button class="zoom-btn" @click="zoomIn">+</button>
              <button class="zoom-btn" @click="zoomOut">-</button>
              <button class="reset-btn" @click="resetView">重置视图</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 薄弱点识别 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">🔍</i>
          <h3>薄弱点识别</h3>
        </div>
        <div class="card-content">
          <div class="weakness-analysis">
            <div class="analysis-header">
              <h4>你的薄弱知识点</h4>
              <span class="update-time">最近更新：{{ lastUpdateDate }}</span>
            </div>
            <div v-if="weaknessPoints.length === 0" class="empty-state">
              暂未识别到薄弱点，请继续学习
            </div>
            <div v-else class="weakness-list">
              <div v-for="point in weaknessPoints" :key="point.id" class="weakness-item">
                <div class="topic">{{ point.name }}</div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: point.masteryLevel + '%' }"></div>
                </div>
                <div class="score">{{ point.masteryLevel }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 定制学习计划 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">📅</i>
          <h3>定制学习计划</h3>
        </div>
        <div class="card-content">
          <div class="learning-plan">
            <div class="plan-header">
              <h4>本周学习计划</h4>
              <button class="edit-btn" @click="editPlan">编辑计划</button>
            </div>
            <div v-if="learningPlan.length === 0" class="empty-state">
              暂无学习计划，点击"编辑计划"创建
            </div>
            <div v-else class="plan-content">
              <div v-for="(plan, index) in learningPlan" :key="index" class="plan-item">
                <div class="day">{{ plan.day }}</div>
                <div class="task">{{ plan.task }}</div>
                <div class="duration">{{ plan.duration }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 资源智能推荐 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">📚</i>
          <h3>资源智能推荐</h3>
        </div>
        <div class="card-content">
          <div class="resource-recommendations">
            <div v-if="recommendations.length === 0" class="empty-state">
              暂无推荐资源
            </div>
            <div v-else class="recommendation-list">
              <div v-for="resource in recommendations" :key="resource.id" class="recommendation-item">
                <div class="resource-type">{{ resource.type }}</div>
                <div class="resource-title">{{ resource.title }}</div>
                <div class="resource-meta">
                  <span class="duration">{{ resource.duration }}</span>
                  <span class="difficulty">{{ resource.difficulty }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUserInfo } from '@/utils/auth';
import { knowledge, learningProgress, course } from '@/api/api';
import { student } from '@/api/api';

export default {
  name: 'StudentLearningPath',
  setup() {
    // 页面状态
    const loading = ref(false);
    const error = ref('');

    // 知识图谱数据
    const knowledgePoints = ref([]);
    const zoomLevel = ref(1);

    // 薄弱点数据
    const weaknessPoints = ref([]);
    const lastUpdateDate = ref(formatDate(new Date()));

    // 学习计划数据
    const learningPlan = ref([]);

    // 推荐资源数据
    const recommendations = ref([]);

    // 格式化日期
    function formatDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 知识节点样式（根据掌握程度设置不同颜色）
    const getNodeStyle = (point) => {
      let color = '#4CAF50'; // 默认绿色
      
      if (point.masteryLevel < 40) {
        color = '#F44336'; // 红色（薄弱）
      } else if (point.masteryLevel < 70) {
        color = '#FF9800'; // 橙色（需加强）
      }
      
      return {
        'border-color': color,
        'color': color
      };
    };

    // 缩放控制
    const zoomIn = () => {
      zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
    };

    const zoomOut = () => {
      zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
    };

    const resetView = () => {
      zoomLevel.value = 1;
    };

    // 编辑学习计划
    const editPlan = () => {
      alert('编辑学习计划功能将在后续版本中推出');
    };

    // 初始化数据
    const initializeData = async () => {
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

        // 获取所有课程
        const courses = await course.getAllCourses();
        
        // 获取知识点数据（假设知识点是按课程组织的）
        const knowledgePromises = courses.map(async (courseItem) => {
          try {
            const points = await knowledge.getKnowledgeByCourseId(courseItem.id);
            return points;
          } catch (e) {
            console.error(`获取课程${courseItem.name}知识点失败:`, e);
            return [];
          }
        });
        
        // 合并所有知识点
        const allPoints = (await Promise.all(knowledgePromises)).flat();
        
        // 获取学生知识点掌握程度
        const progressData = await learningProgress.getStudentProgress(studentId);
        
        // 为知识点添加掌握程度
        const pointsWithMastery = allPoints.map(point => {
          const progress = progressData.find(p => p.knowledgePointId === point.id);
          return {
            ...point,
            masteryLevel: progress ? Math.round(progress.masteryLevel * 100) : 0
          };
        });
        
        // 设置知识点和薄弱点
        knowledgePoints.value = pointsWithMastery;
        
        // 识别薄弱点（掌握度低于70%的点）
        weaknessPoints.value = pointsWithMastery
          .filter(point => point.masteryLevel < 70)
          .sort((a, b) => a.masteryLevel - b.masteryLevel) // 按掌握度从低到高排序
          .slice(0, 5); // 取前5个最薄弱的点
          
        // 生成推荐学习资源（基于薄弱点）
        const recommendedResources = weaknessPoints.value.map(point => {
          // 这里应该调用推荐API，但假设没有这个API，我们模拟生成数据
          const types = ['视频课程', '练习题库', '文章', '课件'];
          const difficulties = ['初级', '中级', '高级'];
          
          const type = types[Math.floor(Math.random() * types.length)];
          const duration = type === '视频课程' ? `${Math.floor(Math.random() * 3) + 1}小时` :
                          type === '文章' ? `${Math.floor(Math.random() * 30) + 5}分钟` :
                          type === '练习题库' ? `${Math.floor(Math.random() * 20) + 5}题` : '未知';
                          
          return {
            id: `rec-${point.id}`,
            type,
            title: `${point.name}学习资源`,
            duration,
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)]
          };
        });
        
        recommendations.value = recommendedResources;
        
        // 生成学习计划（基于薄弱点）
        const dayNames = ['周一', '周二', '周三', '周四', '周五'];
        const learningPlanItems = weaknessPoints.value.slice(0, 5).map((point, index) => {
          return {
            day: dayNames[index] || `第${index + 1}天`,
            task: `${point.name}学习`,
            duration: '2小时'
          };
        });
        
        if (learningPlanItems.length > 0) {
          // 添加一个综合练习
          learningPlanItems.push({
            day: '周末',
            task: '综合练习与复习',
            duration: '3小时'
          });
        }
        
        learningPlan.value = learningPlanItems;
        
      } catch (e) {
        console.error('获取学习路径数据失败:', e);
        error.value = '获取学习路径数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };

    // 组件挂载时初始化数据
    onMounted(initializeData);

    return {
      loading,
      error,
      knowledgePoints,
      weaknessPoints,
      lastUpdateDate,
      learningPlan,
      recommendations,
      getNodeStyle,
      zoomIn,
      zoomOut,
      resetView,
      editPlan
    };
  }
}
</script>

<style scoped>
.learning-path-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.icon {
  font-size: 20px;
}

.card-content {
  padding: 20px;
}

/* 知识图谱样式 */
.knowledge-map {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.node {
  position: absolute;
  background: white;
  border: 2px solid #3f51b5;
  border-radius: 50%;
  padding: 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
  text-align: center;
}

.node:nth-child(1) { top: 50px; left: 50px; }
.node:nth-child(2) { top: 100px; left: 150px; }
.node:nth-child(3) { top: 150px; left: 80px; }
.node:nth-child(4) { top: 80px; right: 50px; }
.node:nth-child(5) { top: 180px; right: 80px; }

.connection {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><line x1="50" y1="50" x2="150" y2="100" stroke="%23ccc" stroke-width="2"/><line x1="150" y1="100" x2="80" y2="150" stroke="%23ccc" stroke-width="2"/><line x1="150" y1="100" x2="250" y2="80" stroke="%23ccc" stroke-width="2"/></svg>') no-repeat center center;
  z-index: -1;
}

.map-controls {
  display: flex;
  gap: 10px;
}

.zoom-btn, .reset-btn {
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn {
  margin-left: auto;
}

/* 薄弱点识别样式 */
.weakness-analysis {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.analysis-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.update-time {
  font-size: 12px;
  color: #999;
}

.weakness-list {
  overflow-y: auto;
}

.weakness-item {
  display: grid;
  grid-template-columns: 1fr 2fr 40px;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.topic {
  font-size: 14px;
  color: #333;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #f44336;
  border-radius: 3px;
}

.score {
  font-size: 14px;
  color: #f44336;
  text-align: right;
}

/* 学习计划样式 */
.learning-plan {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.plan-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.edit-btn {
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.plan-content {
  overflow-y: auto;
}

.plan-item {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.day {
  font-size: 14px;
  color: #666;
}

.task {
  font-size: 14px;
  color: #333;
}

.duration {
  font-size: 14px;
  color: #666;
  text-align: right;
}

/* 资源推荐样式 */
.resource-recommendations {
  height: 300px;
  overflow-y: auto;
}

.recommendation-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 15px;
}

.resource-type {
  font-size: 12px;
  color: #1890ff;
  margin-bottom: 5px;
}

.resource-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 500;
}

.resource-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 