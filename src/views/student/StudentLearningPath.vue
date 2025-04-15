<template>
  <div class="learning-path-page">
    <div class="page-header">
      <h1>个性化学习路径</h1>
      <p class="subtitle">基于你的学习情况，为你定制专属学习计划</p>
    </div>

    <div class="features-grid">
      <!-- 知识图谱导航 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">🗺️</i>
          <h3>知识图谱导航</h3>
        </div>
        <div class="card-content">
          <div class="knowledge-map">
            <div class="map-container">
              <div class="map-placeholder">
                <div class="node">JavaScript</div>
                <div class="node">Vue.js</div>
                <div class="node">React</div>
                <div class="node">Node.js</div>
                <div class="connection"></div>
              </div>
            </div>
            <div class="map-controls">
              <button class="zoom-btn">+</button>
              <button class="zoom-btn">-</button>
              <button class="reset-btn">重置视图</button>
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
              <span class="update-time">最近更新：2024-03-20</span>
            </div>
            <div class="weakness-list">
              <div class="weakness-item">
                <div class="topic">JavaScript异步编程</div>
                <div class="progress-bar">
                  <div class="progress" style="width: 45%"></div>
                </div>
                <div class="score">45%</div>
              </div>
              <div class="weakness-item">
                <div class="topic">Vue组件通信</div>
                <div class="progress-bar">
                  <div class="progress" style="width: 60%"></div>
                </div>
                <div class="score">60%</div>
              </div>
              <div class="weakness-item">
                <div class="topic">算法复杂度分析</div>
                <div class="progress-bar">
                  <div class="progress" style="width: 30%"></div>
                </div>
                <div class="score">30%</div>
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
              <button class="edit-btn">编辑计划</button>
            </div>
            <div class="plan-content">
              <div class="plan-item">
                <div class="day">周一</div>
                <div class="task">JavaScript异步编程基础</div>
                <div class="duration">2小时</div>
              </div>
              <div class="plan-item">
                <div class="day">周二</div>
                <div class="task">Promise与async/await</div>
                <div class="duration">2小时</div>
              </div>
              <div class="plan-item">
                <div class="day">周三</div>
                <div class="task">Vue组件通信方式</div>
                <div class="duration">2小时</div>
              </div>
              <div class="plan-item">
                <div class="day">周四</div>
                <div class="task">算法复杂度分析基础</div>
                <div class="duration">2小时</div>
              </div>
              <div class="plan-item">
                <div class="day">周五</div>
                <div class="task">综合练习与复习</div>
                <div class="duration">2小时</div>
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
            <div class="recommendation-item">
              <div class="resource-type">视频课程</div>
              <div class="resource-title">JavaScript异步编程详解</div>
              <div class="resource-meta">
                <span class="duration">2小时</span>
                <span class="difficulty">中级</span>
              </div>
            </div>
            <div class="recommendation-item">
              <div class="resource-type">练习题库</div>
              <div class="resource-title">Vue组件通信实战练习</div>
              <div class="resource-meta">
                <span class="count">20题</span>
                <span class="difficulty">初级</span>
              </div>
            </div>
            <div class="recommendation-item">
              <div class="resource-type">文章</div>
              <div class="resource-title">算法复杂度分析入门指南</div>
              <div class="resource-meta">
                <span class="read-time">15分钟</span>
                <span class="difficulty">初级</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentLearningPath'
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
  position: relative;
  overflow: hidden;
}

.map-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.node {
  padding: 8px 16px;
  background: #e3f2fd;
  border-radius: 20px;
  color: #1976d2;
  font-size: 14px;
}

.connection {
  width: 2px;
  height: 40px;
  background: #90caf9;
}

.map-controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.zoom-btn, .reset-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
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
  font-size: 14px;
  color: #333;
}

.update-time {
  font-size: 12px;
  color: #999;
}

.weakness-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.weakness-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topic {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.progress-bar {
  flex: 2;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3f51b5;
  border-radius: 4px;
}

.score {
  width: 40px;
  text-align: right;
  font-size: 14px;
  color: #666;
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
  font-size: 14px;
  color: #333;
}

.edit-btn {
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.plan-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}

.day {
  width: 40px;
  font-size: 14px;
  color: #666;
}

.task {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.duration {
  width: 60px;
  text-align: right;
  font-size: 12px;
  color: #666;
}

/* 资源推荐样式 */
.resource-recommendations {
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation-item {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.resource-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.resource-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.resource-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 