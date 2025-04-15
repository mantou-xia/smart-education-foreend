<template>
  <div class="assistant-page">
    <div class="page-header">
      <h1>在线学习助手</h1>
      <p class="subtitle">智能辅助，让学习更高效</p>
    </div>

    <div class="features-grid">
      <!-- 智能问答系统 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">💬</i>
          <h3>智能问答系统</h3>
        </div>
        <div class="card-content">
          <div class="chat-container">
            <div class="chat-messages">
              <div class="message system">
                <p>你好！我是你的学习助手，有什么问题都可以问我。</p>
              </div>
            </div>
            <div class="chat-input">
              <input type="text" placeholder="输入你的问题..." />
              <button class="send-btn">发送</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 个性化练习生成 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">📝</i>
          <h3>个性化练习生成</h3>
        </div>
        <div class="card-content">
          <div class="exercise-form">
            <div class="form-group">
              <label>选择知识点</label>
              <select>
                <option>全部知识点</option>
                <option>JavaScript基础</option>
                <option>Vue.js框架</option>
                <option>算法与数据结构</option>
              </select>
            </div>
            <div class="form-group">
              <label>难度级别</label>
              <div class="radio-group">
                <label><input type="radio" name="difficulty" checked /> 基础</label>
                <label><input type="radio" name="difficulty" /> 进阶</label>
                <label><input type="radio" name="difficulty" /> 挑战</label>
              </div>
            </div>
            <button class="generate-btn">生成练习</button>
          </div>
        </div>
      </div>

      <!-- 实时错误纠正 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">✅</i>
          <h3>实时错误纠正</h3>
        </div>
        <div class="card-content">
          <div class="code-editor">
            <div class="editor-header">
              <span class="language-tag">JavaScript</span>
            </div>
            <div class="editor-content">
              <pre><code>// 在这里输入你的代码</code></pre>
            </div>
            <div class="editor-footer">
              <button class="check-btn">检查代码</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习进度追踪 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">📊</i>
          <h3>学习进度追踪</h3>
        </div>
        <div class="card-content">
          <div class="progress-stats">
            <div class="stat-item">
              <div class="stat-value">85%</div>
              <div class="stat-label">总体进度</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">92%</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">7</div>
              <div class="stat-label">连续学习天数</div>
            </div>
          </div>
          <div class="progress-chart">
            <div class="chart-placeholder">学习进度图表</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentAssistant'
}
</script>

<style scoped>
.assistant-page {
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

/* 智能问答样式 */
.chat-container {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  max-width: 80%;
}

.message.system {
  background: #e3f2fd;
  margin-right: auto;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-btn {
  padding: 8px 16px;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 练习生成样式 */
.exercise-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.generate-btn {
  padding: 10px;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

/* 代码编辑器样式 */
.code-editor {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.editor-header {
  padding: 8px 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
}

.language-tag {
  font-size: 12px;
  color: #666;
}

.editor-content {
  flex: 1;
  background: #f8f9fa;
  padding: 10px;
  font-family: monospace;
}

.editor-footer {
  padding: 10px;
  text-align: right;
}

.check-btn {
  padding: 8px 16px;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 学习进度样式 */
.progress-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #3f51b5;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.progress-chart {
  height: 200px;
  background: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 