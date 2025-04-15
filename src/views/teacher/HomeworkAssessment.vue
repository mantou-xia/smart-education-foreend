<template>
  <div class="assessment">
    <h2>作业评估</h2>
    
    <!-- 作业创建表单 -->
    <div class="card">
      <div class="card-header">
        <h3>{{ isEditing ? '编辑作业' : '发布新作业' }}</h3>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for="assignmentTitle">作业标题</label>
          <input 
            type="text" 
            id="assignmentTitle" 
            v-model="assignmentForm.title" 
            placeholder="输入作业标题"
          >
        </div>
        
        <div class="form-group">
          <label for="associatedCourse">关联课程</label>
          <select id="associatedCourse" v-model="assignmentForm.courseId">
            <option value="">请选择课程</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="description">作业描述</label>
          <textarea 
            id="description" 
            v-model="assignmentForm.description" 
            placeholder="输入作业描述和要求"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group half-width">
            <label for="difficulty">难度级别</label>
            <select id="difficulty" v-model="assignmentForm.difficulty">
              <option value="easy">基础</option>
              <option value="medium">进阶</option>
              <option value="hard">挑战</option>
            </select>
          </div>
          
          <div class="form-group half-width">
            <label for="deadlineDate">截止日期</label>
            <input type="date" id="deadlineDate" v-model="assignmentForm.deadlineDate">
          </div>
        </div>
        
        <div class="form-group">
          <label>题目类型</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="assignmentForm.questionTypes" value="choice">
              选择题
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="assignmentForm.questionTypes" value="completion">
              填空题
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="assignmentForm.questionTypes" value="essay">
              简答题
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="assignmentForm.questionTypes" value="code">
              编程题
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="questionCount">题目数量</label>
          <input 
            type="number" 
            id="questionCount" 
            v-model="assignmentForm.questionCount" 
            min="1" 
            max="20"
          >
        </div>
        
        <div class="form-actions">
          <button class="btn" @click="resetForm">取消</button>
          <button 
            class="btn btn-primary" 
            @click="generateQuestions" 
            :disabled="isGenerating"
          >
            {{ isGenerating ? '生成中...' : '生成题目' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 生成的作业内容 -->
    <div class="card" v-if="generatedQuestions.length > 0">
      <div class="card-header">
        <h3>生成的题目</h3>
      </div>
      <div class="card-body">
        <div class="questions-header">
          <div class="questions-summary">
            共 {{ generatedQuestions.length }} 道题目，总分：{{ totalScore }} 分
          </div>
          <div class="questions-actions">
            <button class="btn btn-primary" @click="saveAssignment">发布作业</button>
            <button class="btn" @click="regenerateQuestions">重新生成</button>
          </div>
        </div>
        
        <div class="questions-list">
          <div 
            v-for="(question, index) in generatedQuestions" 
            :key="index" 
            class="question-item"
          >
            <div class="question-header">
              <div class="question-index">题目 {{ index + 1 }}</div>
              <div class="question-type">{{ getQuestionTypeText(question.type) }}</div>
              <div class="question-score">{{ question.score }} 分</div>
            </div>
            <div class="question-content">{{ question.content }}</div>
            
            <!-- 选择题选项 -->
            <div class="question-options" v-if="question.type === 'choice'">
              <div 
                v-for="(option, optIndex) in question.options" 
                :key="optIndex" 
                class="question-option"
              >
                <span class="option-label">{{ String.fromCharCode(65 + optIndex) }}.</span>
                {{ option }}
              </div>
            </div>
            
            <div class="question-meta">
              <div class="question-difficulty">
                难度：{{ getDifficultyText(question.difficulty) }}
              </div>
              <div class="question-knowledge">
                知识点：{{ question.knowledgePoint }}
              </div>
            </div>
            
            <div class="question-answer">
              <div class="answer-header">参考答案</div>
              <div class="answer-content">{{ question.referenceAnswer }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 待评阅作业列表 -->
    <div class="card">
      <div class="card-header">
        <h3>待评阅作业</h3>
      </div>
      <div class="card-body">
        <div class="tabs">
          <div 
            class="tab" 
            :class="{ active: activeTab === 'pending' }" 
            @click="activeTab = 'pending'"
          >
            待评阅
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'completed' }" 
            @click="activeTab = 'completed'"
          >
            已评阅
          </div>
        </div>
        
        <table class="assignments-table">
          <thead>
            <tr>
              <th>作业标题</th>
              <th>关联课程</th>
              <th>提交学生</th>
              <th>提交时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="submission in filteredSubmissions" :key="submission.id">
              <td>{{ submission.title }}</td>
              <td>{{ getCourseTitle(submission.courseId) }}</td>
              <td>{{ submission.studentName }}</td>
              <td>{{ formatDate(submission.submittedAt) }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="submission.status"
                >
                  {{ getStatusText(submission.status) }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  class="btn-icon" 
                  @click="reviewSubmission(submission.id)"
                >
                  {{ submission.status === 'pending' ? '评阅' : '查看' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" v-if="filteredSubmissions.length === 0">
          <p>{{ activeTab === 'pending' ? '暂无待评阅作业' : '暂无已评阅作业' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeworkAssessment',
  data() {
    return {
      activeTab: 'pending',
      isEditing: false,
      isGenerating: false,
      editingId: null,
      assignmentForm: {
        title: '',
        courseId: '',
        description: '',
        difficulty: 'medium',
        deadlineDate: '',
        questionTypes: [],
        questionCount: 5
      },
      generatedQuestions: [],
      // 示例课程数据
      courses: [
        { id: 1, title: '计算机基础入门' },
        { id: 2, title: '数据结构与算法' }
      ],
      // 示例作业提交数据
      submissions: [
        {
          id: 1,
          title: '计算机基础测验',
          courseId: 1,
          studentName: '张三',
          submittedAt: new Date('2023-12-10 14:30'),
          status: 'pending'
        },
        {
          id: 2,
          title: '数据结构习题',
          courseId: 2,
          studentName: '李四',
          submittedAt: new Date('2023-12-09 16:45'),
          status: 'pending'
        },
        {
          id: 3,
          title: '编程基础练习',
          courseId: 1,
          studentName: '王五',
          submittedAt: new Date('2023-12-05 09:15'),
          status: 'completed'
        }
      ]
    }
  },
  computed: {
    // 过滤当前标签页的作业提交
    filteredSubmissions() {
      return this.submissions.filter(submission => {
        return this.activeTab === 'pending' 
          ? submission.status === 'pending' 
          : submission.status === 'completed'
      })
    },
    // 计算总分
    totalScore() {
      return this.generatedQuestions.reduce((total, question) => total + question.score, 0)
    }
  },
  methods: {
    generateQuestions() {
      // 模拟生成题目
      this.isGenerating = true
      setTimeout(() => {
        // 根据用户选择生成不同类型的题目
        this.generatedQuestions = []
        const types = this.assignmentForm.questionTypes.length > 0 
          ? this.assignmentForm.questionTypes 
          : ['choice', 'essay']
        
        for (let i = 0; i < this.assignmentForm.questionCount; i++) {
          const typeIndex = i % types.length
          const type = types[typeIndex]
          
          let question = {
            id: i + 1,
            type: type,
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            score: type === 'choice' ? 5 : (type === 'completion' ? 8 : (type === 'essay' ? 10 : 15)),
            knowledgePoint: '基础概念'
          }
          
          // 根据题目类型设置不同的内容
          switch (type) {
            case 'choice':
              question.content = '以下哪个不是编程语言的基本数据类型？'
              question.options = ['整数', '浮点数', '字符串', '数据库']
              question.referenceAnswer = 'D'
              break
            case 'completion':
              question.content = '在Java中，用于输出内容到控制台的语句是 ______。'
              question.referenceAnswer = 'System.out.println()'
              break
            case 'essay':
              question.content = '简述面向对象编程的三大特性，并举例说明。'
              question.referenceAnswer = '封装、继承、多态。封装：将数据和操作数据的方法封装在一起...'
              break
            case 'code':
              question.content = '编写一个函数，实现两个数字的交换，不使用临时变量。'
              question.referenceAnswer = 'function swap(a, b) {\n  a = a + b;\n  b = a - b;\n  a = a - b;\n  return [a, b];\n}'
              break
          }
          
          this.generatedQuestions.push(question)
        }
        
        this.isGenerating = false
      }, 1500)
    },
    resetForm() {
      this.assignmentForm = {
        title: '',
        courseId: '',
        description: '',
        difficulty: 'medium',
        deadlineDate: '',
        questionTypes: [],
        questionCount: 5
      }
      this.isEditing = false
      this.editingId = null
      this.generatedQuestions = []
    },
    saveAssignment() {
      // 保存作业逻辑
      alert('作业已发布成功！')
      this.resetForm()
    },
    regenerateQuestions() {
      this.generateQuestions()
    },
    reviewSubmission(id) {
      // 模拟进入评阅页面
      alert(`查看作业提交 ID: ${id}`)
    },
    getCourseTitle(courseId) {
      const course = this.courses.find(c => c.id === courseId)
      return course ? course.title : '未知课程'
    },
    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN')
    },
    getStatusText(status) {
      const statusMap = {
        'pending': '待评阅',
        'completed': '已评阅'
      }
      return statusMap[status] || status
    },
    getQuestionTypeText(type) {
      const typeMap = {
        'choice': '选择题',
        'completion': '填空题',
        'essay': '简答题',
        'code': '编程题'
      }
      return typeMap[type] || type
    },
    getDifficultyText(difficulty) {
      const difficultyMap = {
        'easy': '基础',
        'medium': '进阶',
        'hard': '挑战'
      }
      return difficultyMap[difficulty] || difficulty
    }
  }
}
</script>

<style scoped>
.assessment {
  padding: 0;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.card-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-row {
  display: flex;
  gap: 20px;
}

.half-width {
  flex: 1;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #f5f5f5;
  color: #333;
}

.btn:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #3f51b5;
  color: white;
}

.btn-primary:hover {
  background: #303f9f;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.questions-summary {
  font-weight: 500;
  color: #333;
}

.questions-actions {
  display: flex;
  gap: 10px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.question-index {
  font-weight: 500;
  color: #333;
}

.question-type {
  margin-left: 15px;
  padding: 3px 8px;
  background: #e8eaf6;
  color: #3f51b5;
  border-radius: 4px;
  font-size: 12px;
}

.question-score {
  margin-left: auto;
  color: #ff5722;
  font-weight: 500;
}

.question-content {
  margin-bottom: 15px;
  color: #333;
  line-height: 1.6;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  padding-left: 15px;
}

.option-label {
  font-weight: 500;
  margin-right: 5px;
}

.question-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: #666;
  font-size: 13px;
}

.question-answer {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}

.answer-header {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
  font-size: 14px;
}

.answer-content {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.tabs {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 0;
  cursor: pointer;
  color: #666;
  position: relative;
}

.tab.active {
  color: #3f51b5;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3f51b5;
}

.assignments-table {
  width: 100%;
  border-collapse: collapse;
}

.assignments-table th,
.assignments-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.assignments-table th {
  font-weight: 500;
  color: #555;
  background: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.completed {
  background: #f6ffed;
  color: #52c41a;
}

.actions-cell {
  display: flex;
  gap: 10px;
}

.btn-icon {
  padding: 5px 10px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  color: #666;
}

.btn-icon:hover {
  background: #f5f5f5;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #999;
}
</style> 