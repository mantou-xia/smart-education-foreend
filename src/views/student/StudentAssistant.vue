<template>
  <div class="assistant-page">
    <div class="page-header">
      <h1>在线学习助手</h1>
      <p class="subtitle">智能辅助，让学习更高效</p>
    </div>

    <div v-if="loading" class="loading-state">
      加载中...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else class="features-grid">
      <!-- 智能问答系统 -->
      <div class="feature-card">
        <div class="card-header">
          <i class="icon">💬</i>
          <h3>智能问答系统</h3>
        </div>
        <div class="card-content">
          <div class="chat-container">
            <div class="chat-messages">
              <div v-for="(message, index) in chatMessages" :key="index" 
                   :class="['message', message.type]">
                <p>{{ message.content }}</p>
              </div>
            </div>
            <div class="chat-input">
              <input type="text" v-model="userQuestion" placeholder="输入你的问题..." 
                     @keyup.enter="sendQuestion" />
              <button class="send-btn" @click="sendQuestion" 
                      :disabled="isProcessingQuestion">
                {{ isProcessingQuestion ? '处理中...' : '发送' }}
              </button>
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
              <select v-model="exerciseParams.knowledgePoint">
                <option value="">全部知识点</option>
                <option v-for="point in knowledgePoints" 
                        :key="point.id" :value="point.id">
                  {{ point.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>难度级别</label>
              <div class="radio-group">
                <label><input type="radio" v-model="exerciseParams.difficulty" value="EASY" /> 基础</label>
                <label><input type="radio" v-model="exerciseParams.difficulty" value="MEDIUM" /> 进阶</label>
                <label><input type="radio" v-model="exerciseParams.difficulty" value="HARD" /> 挑战</label>
              </div>
            </div>
            <button class="generate-btn" @click="generateExercises" 
                    :disabled="isGeneratingExercises">
              {{ isGeneratingExercises ? '生成中...' : '生成练习' }}
            </button>
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
              <textarea v-model="codeInput" placeholder="// 在这里输入你的代码"></textarea>
            </div>
            <div class="editor-footer">
              <button class="check-btn" @click="checkCode" 
                      :disabled="isCheckingCode">
                {{ isCheckingCode ? '检查中...' : '检查代码' }}
              </button>
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
              <div class="stat-value">{{ stats.overallProgress }}%</div>
              <div class="stat-label">总体进度</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.completionRate }}%</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.consecutiveDays }}</div>
              <div class="stat-label">连续学习天数</div>
            </div>
          </div>
          <div class="progress-chart" v-if="progressChartLoaded">
            <canvas id="progressChart" width="100%" height="200"></canvas>
          </div>
          <div class="progress-chart" v-else>
            <div class="chart-placeholder">加载学习进度图表中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { getUserInfo } from '@/utils/auth';
import { learningProgress, teachingAssistant, knowledge, student } from '@/api/api';

export default {
  name: 'StudentAssistant',
  setup() {
    // 页面状态
    const loading = ref(false);
    const error = ref('');
    
    // 聊天功能
    const chatMessages = ref([
      { type: 'system', content: '你好！我是你的学习助手，有什么问题都可以问我。' }
    ]);
    const userQuestion = ref('');
    const isProcessingQuestion = ref(false);
    
    // 练习生成功能
    const knowledgePoints = ref([]);
    const exerciseParams = reactive({
      knowledgePoint: '',
      difficulty: 'MEDIUM'
    });
    const isGeneratingExercises = ref(false);
    
    // 代码检查功能
    const codeInput = ref('');
    const isCheckingCode = ref(false);
    
    // 学习进度统计
    const stats = reactive({
      overallProgress: 0,
      completionRate: 0,
      consecutiveDays: 0
    });
    const progressChartLoaded = ref(false);
    
    // 发送问题
    const sendQuestion = async () => {
      if (!userQuestion.value.trim() || isProcessingQuestion.value) return;
      
      // 添加用户消息到聊天记录
      chatMessages.value.push({
        type: 'user',
        content: userQuestion.value
      });
      
      isProcessingQuestion.value = true;
      
      try {
        // 调用后端API获取智能回复
        // 这里假设使用教学助手API，真实情况可能需要专门的聊天API
        const response = await teachingAssistant.generateTeachingPlan({
          subjectType: 'QA',
          courseOutline: userQuestion.value,
          courseDocuments: [],
          duration: 0,
          difficultyLevel: 'BASIC',
          teachingStyle: 'INTERACTIVE'
        });
        
        // 添加系统回复消息
        chatMessages.value.push({
          type: 'system',
          content: response.content || '很抱歉，暂时无法回答您的问题。'
        });
        
        // 清空输入框
        userQuestion.value = '';
      } catch (e) {
        console.error('处理问题失败:', e);
        chatMessages.value.push({
          type: 'system',
          content: '很抱歉，处理您的问题时出现了错误。请稍后再试。'
        });
      } finally {
        isProcessingQuestion.value = false;
      }
    };
    
    // 生成练习
    const generateExercises = async () => {
      isGeneratingExercises.value = true;
      
      try {
        // 此处调用生成练习的API
        // 如果后端没有现成API，可以通过提示用户练习生成中
        console.log('生成练习，参数:', exerciseParams);
        
        // 模拟API响应时间
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('练习已生成，请到作业页面查看');
      } catch (e) {
        console.error('生成练习失败:', e);
        alert('生成练习失败，请稍后再试');
      } finally {
        isGeneratingExercises.value = false;
      }
    };
    
    // 检查代码
    const checkCode = async () => {
      if (!codeInput.value.trim()) {
        alert('请先输入代码');
        return;
      }
      
      isCheckingCode.value = true;
      
      try {
        // 此处调用代码检查API
        // 如果后端没有现成API，可以给出一个默认提示
        console.log('检查代码:', codeInput.value);
        
        // 模拟API响应时间
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('代码检查完成，没有发现错误！');
      } catch (e) {
        console.error('检查代码失败:', e);
        alert('检查代码失败，请稍后再试');
      } finally {
        isCheckingCode.value = false;
      }
    };
    
    // 初始化页面数据
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
            const studentInfo = await student.getStudentByUsername(userInfo.username);
            if (studentInfo && studentInfo.studentId) {
              studentId = studentInfo.studentId;
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
        
        // 获取知识点列表
        const knowledgeList = await knowledge.getAllKnowledgePoints();
        knowledgePoints.value = knowledgeList;
        
        // 获取学习进度统计
        const progressData = await learningProgress.getOverallProgress(studentId);
        const statisticsData = await learningProgress.getProgressStatistics(studentId);
        
        // 设置学习统计数据
        stats.overallProgress = Math.round(progressData.overallPercentage || 0);
        stats.completionRate = Math.round(statisticsData.completionRate || 0);
        stats.consecutiveDays = statisticsData.consecutiveDays || 0;
        
        // 异步加载进度图表（模拟数据）
        setTimeout(() => {
          progressChartLoaded.value = true;
          // 如果要使用图表库如Chart.js，可以在这里初始化图表
          // 假设已经有了DOM元素 id="progressChart"
        }, 500);
        
      } catch (e) {
        console.error('初始化数据失败:', e);
        error.value = '获取学习助手数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    // 组件挂载时初始化数据
    onMounted(initializeData);
    
    return {
      loading,
      error,
      chatMessages,
      userQuestion,
      isProcessingQuestion,
      sendQuestion,
      knowledgePoints,
      exerciseParams,
      isGeneratingExercises,
      generateExercises,
      codeInput,
      isCheckingCode,
      checkCode,
      stats,
      progressChartLoaded
    };
  }
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

.loading-state,
.error-state {
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

.message.user {
  background: #e8f5e9;
  margin-left: auto;
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

.send-btn:disabled {
  background: #b0bec5;
  cursor: not-allowed;
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

.generate-btn:disabled {
  background: #b0bec5;
  cursor: not-allowed;
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
  position: relative;
}

.editor-content textarea {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 10px;
  font-family: monospace;
  resize: none;
  outline: none;
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

.check-btn:disabled {
  background: #b0bec5;
  cursor: not-allowed;
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