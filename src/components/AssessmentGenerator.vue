<template>
  <div class="assessment-generator">
    <div class="card">
      <div class="card-header">
        <h3>生成考核试题</h3>
      </div>
      <div class="card-body">
        <form class="form" @submit.prevent="generateAssessment">
          <div class="form-group">
            <label>关联教案</label>
            <select v-model="assessmentForm.lessonId">
              <option value="lesson001">循环与迭代 - Python编程基础</option>
              <option value="lesson002">微积分应用 - 数学进阶</option>
              <option value="lesson003">牛顿力学 - 物理基础</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>考核类型</label>
            <select v-model="assessmentForm.assessmentType">
              <option value="quiz">课堂小测</option>
              <option value="homework">课后作业</option>
              <option value="exam">单元测试</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>题目类型</label>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="assessmentForm.questionTypes" value="choice" /> 选择题</label>
              <label><input type="checkbox" v-model="assessmentForm.questionTypes" value="fill" /> 填空题</label>
              <label><input type="checkbox" v-model="assessmentForm.questionTypes" value="short" /> 简答题</label>
              <label><input type="checkbox" v-model="assessmentForm.questionTypes" value="programming" /> 编程题</label>
            </div>
          </div>
          
          <div class="form-group">
            <label>难度级别</label>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="assessmentForm.difficultyLevels" value="basic" /> 基础</label>
              <label><input type="checkbox" v-model="assessmentForm.difficultyLevels" value="intermediate" /> 中级</label>
              <label><input type="checkbox" v-model="assessmentForm.difficultyLevels" value="advanced" /> 挑战</label>
            </div>
          </div>
          
          <div class="form-group">
            <label>题目数量</label>
            <input type="number" v-model="assessmentForm.questionCount" min="1" max="50" />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isGenerating">
              {{ isGenerating ? '生成中...' : '生成考核内容' }}
            </button>
            <button type="button" class="btn" @click="resetForm">重置</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card" v-if="generatedAssessment">
      <div class="card-header">
        <div class="header-with-actions">
          <h3>生成的考核试题</h3>
          <div>
            <button class="btn btn-sm btn-text"><i class="icon-edit"></i> 编辑</button>
            <button class="btn btn-sm btn-text"><i class="icon-download"></i> 导出</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="assessment-info">
          <div class="info-item">
            <span class="label">考核ID:</span>
            <span class="value">{{ generatedAssessment.assessmentId }}</span>
          </div>
          <div class="info-item">
            <span class="label">总分:</span>
            <span class="value">{{ generatedAssessment.totalScore }}分</span>
          </div>
          <div class="info-item">
            <span class="label">预计完成时间:</span>
            <span class="value">{{ generatedAssessment.estimatedTime }}分钟</span>
          </div>
        </div>
        
        <div class="questions-container">
          <div v-for="(question, index) in generatedAssessment.questions" :key="index" class="question-item">
            <div class="question-header">
              <h4>{{ index + 1 }}. <span class="question-type">[{{ getQuestionTypeText(question.type) }}]</span></h4>
              <div class="question-info">
                <span class="difficulty" :class="'difficulty-' + question.difficulty">{{ getDifficultyText(question.difficulty) }}</span>
                <span class="score">{{ question.scorePoints }}分</span>
              </div>
            </div>
            
            <div class="question-content">
              {{ question.content }}
            </div>
            
            <div v-if="question.options && question.options.length" class="options-list">
              <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
                <span class="option-label">{{ String.fromCharCode(65 + optIndex) }}.</span>
                <span class="option-text">{{ option }}</span>
              </div>
            </div>
            
            <div class="question-footer">
              <div class="collapsible-section">
                <button class="toggle-btn" @click="toggleAnswer(index)">
                  {{ showAnswers[index] ? '隐藏答案' : '查看答案' }}
                </button>
                <div v-show="showAnswers[index]" class="answer-section">
                  <div class="answer-content">
                    <h5>参考答案:</h5>
                    <p>{{ question.referenceAnswer }}</p>
                  </div>
                </div>
              </div>
              
              <div class="question-tags">
                <span v-for="(tag, tagIndex) in question.relatedKnowledge" :key="tagIndex" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn btn-primary" @click="saveAssessment">保存试题</button>
          <button class="btn" @click="generateMore">生成更多</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssessmentGenerator',
  data() {
    return {
      isGenerating: false,
      assessmentForm: {
        lessonId: 'lesson001',
        assessmentType: 'quiz',
        questionTypes: ['choice', 'short'],
        difficultyLevels: ['basic', 'intermediate'],
        questionCount: 5
      },
      generatedAssessment: null,
      showAnswers: {}
    }
  },
  methods: {
    generateAssessment() {
      this.isGenerating = true;
      
      // 模拟API调用
      setTimeout(() => {
        this.generatedAssessment = {
          assessmentId: 'ASM' + Math.floor(Math.random() * 10000),
          totalScore: 100,
          estimatedTime: 30,
          questions: [
            {
              questionId: 'Q1001',
              type: 'choice',
              difficulty: 'basic',
              content: '在Python中，下列哪一个不是循环语句？',
              options: [
                'for i in range(10):',
                'while True:',
                'if x > 0:',
                'for item in list:'
              ],
              referenceAnswer: 'C',
              scorePoints: 10,
              relatedKnowledge: ['循环基础', '控制结构']
            },
            {
              questionId: 'Q1002',
              type: 'choice',
              difficulty: 'intermediate',
              content: '在Python中，以下哪个表达式等价于 for i in range(5):',
              options: [
                'for i in range(0, 5)',
                'for i in range(1, 6)',
                'for i in range(0, 5, 1)',
                'for i in [0, 1, 2, 3, 4, 5]'
              ],
              referenceAnswer: 'A',
              scorePoints: 15,
              relatedKnowledge: ['range函数', 'for循环']
            },
            {
              questionId: 'Q1003',
              type: 'short',
              difficulty: 'intermediate',
              content: '简要解释Python中break和continue语句的区别。',
              referenceAnswer: 'break语句用于完全退出循环，不再执行循环中的剩余语句。continue语句用于跳过当前迭代中的剩余语句，直接进入下一次迭代。',
              scorePoints: 20,
              relatedKnowledge: ['break语句', 'continue语句', '循环控制']
            },
            {
              questionId: 'Q1004',
              type: 'programming',
              difficulty: 'advanced',
              content: '编写一个Python函数，使用嵌套循环打印以下图案：\n*\n**\n***\n****\n*****',
              referenceAnswer: 'def print_pattern():\n    for i in range(5):\n        for j in range(i+1):\n            print("*", end="")\n        print()\n\nprint_pattern()',
              scorePoints: 25,
              relatedKnowledge: ['嵌套循环', '模式打印', '函数定义']
            },
            {
              questionId: 'Q1005',
              type: 'short',
              difficulty: 'advanced',
              content: '解释Python中列表推导式的概念和优势，并给出一个将列表中所有偶数元素加倍的列表推导式示例。',
              referenceAnswer: '列表推导式是Python中一种简洁创建列表的方法，它可以用一行代码替代传统的循环方式创建列表，提高代码可读性和执行效率。\n\n示例：[x*2 for x in my_list if x % 2 == 0]',
              scorePoints: 30,
              relatedKnowledge: ['列表推导式', '函数式编程', '列表操作']
            }
          ]
        };
        
        // 初始化答案显示状态
        this.showAnswers = {};
        this.generatedAssessment.questions.forEach((_, index) => {
          this.showAnswers[index] = false;
        });
        
        this.isGenerating = false;
      }, 2000);
    },
    resetForm() {
      this.assessmentForm = {
        lessonId: 'lesson001',
        assessmentType: 'quiz',
        questionTypes: ['choice', 'short'],
        difficultyLevels: ['basic', 'intermediate'],
        questionCount: 5
      };
      this.generatedAssessment = null;
    },
    getQuestionTypeText(type) {
      const types = {
        'choice': '选择题',
        'fill': '填空题',
        'short': '简答题',
        'programming': '编程题'
      };
      return types[type] || type;
    },
    getDifficultyText(difficulty) {
      const levels = {
        'basic': '基础',
        'intermediate': '中级',
        'advanced': '挑战'
      };
      return levels[difficulty] || difficulty;
    },
    toggleAnswer(index) {
      this.showAnswers[index] = !this.showAnswers[index];
    },
    saveAssessment() {
      alert('试题已保存！');
    },
    generateMore() {
      alert('您可以调整参数生成更多试题');
    }
  }
}
</script>

<style scoped>
.assessment-generator {
  margin-bottom: 30px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input {
  width: auto;
  margin-right: 5px;
}

.header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-text {
  background: none;
  border: none;
  color: #3f51b5;
}

.btn-text:hover {
  background-color: rgba(63, 81, 181, 0.1);
}

.assessment-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item .label {
  font-weight: 500;
  margin-right: 5px;
  color: #666;
}

.info-item .value {
  font-weight: 500;
}

.questions-container {
  margin-bottom: 20px;
}

.question-item {
  margin-bottom: 25px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fff;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.question-type {
  font-size: 14px;
  font-weight: normal;
  color: #666;
}

.question-info {
  display: flex;
  gap: 10px;
}

.difficulty {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.difficulty-basic {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.difficulty-intermediate {
  background-color: #fff8e1;
  color: #ff8f00;
}

.difficulty-advanced {
  background-color: #ffebee;
  color: #c62828;
}

.score {
  font-weight: 500;
}

.question-content {
  margin-bottom: 15px;
  white-space: pre-line;
}

.options-list {
  margin-left: 10px;
  margin-bottom: 15px;
}

.option-item {
  margin-bottom: 8px;
  display: flex;
}

.option-label {
  min-width: 25px;
  font-weight: 500;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.toggle-btn {
  background: none;
  border: none;
  color: #3f51b5;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  text-decoration: underline;
}

.answer-section {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f2ff;
  border-radius: 4px;
}

.answer-content h5 {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  padding: 2px 8px;
  background-color: #e0e0e0;
  border-radius: 10px;
  font-size: 12px;
  color: #424242;
}
</style> 