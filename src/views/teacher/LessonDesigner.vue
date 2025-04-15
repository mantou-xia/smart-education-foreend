<template>
  <div class="lesson-designer">
    <h2>课程设计</h2>
    
    <!-- 课程设计表单 -->
    <div class="card">
      <div class="card-header">
        <h3>{{ editing ? '编辑课程' : '创建新课程' }}</h3>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for="courseTitle">课程标题</label>
          <input 
            type="text" 
            id="courseTitle" 
            v-model="courseForm.title" 
            placeholder="输入课程标题"
          >
        </div>
        
        <div class="form-group">
          <label for="courseSubject">学科类型</label>
          <select id="courseSubject" v-model="courseForm.subject">
            <option value="">请选择</option>
            <option value="computer">计算机科学</option>
            <option value="math">数学</option>
            <option value="physics">物理</option>
            <option value="chemistry">化学</option>
            <option value="language">语言</option>
          </select>
        </div>

        <div class="form-group">
          <label for="courseDifficulty">难度级别</label>
          <select id="courseDifficulty" v-model="courseForm.difficulty">
            <option value="">请选择</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="courseOutline">课程大纲</label>
          <textarea 
            id="courseOutline" 
            v-model="courseForm.outline" 
            placeholder="输入课程大纲和核心知识点"
            rows="5"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="courseDuration">课程时长（分钟）</label>
          <input 
            type="number" 
            id="courseDuration" 
            v-model="courseForm.duration" 
            min="30" 
            step="10"
          >
        </div>

        <div class="form-actions">
          <button class="btn" @click="resetForm">取消</button>
          <button 
            class="btn btn-primary" 
            @click="handleGenerateCourse" 
            :disabled="isGenerating"
          >
            {{ isGenerating ? '生成中...' : (editing ? '更新课程' : '生成课程') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 生成的课程内容 -->
    <div class="card" v-if="generatedCourse">
      <div class="card-header">
        <h3>生成结果</h3>
      </div>
      <div class="card-body">
        <div class="result-actions">
          <button class="btn btn-primary" @click="saveCourse">保存课程</button>
          <button class="btn" @click="regenerate">重新生成</button>
        </div>
        
        <div class="result-preview">
          <h4>{{ generatedCourse.title }}</h4>
          
          <div class="result-section">
            <h5>教学目标</h5>
            <ul>
              <li v-for="(objective, index) in generatedCourse.objectives" :key="index">
                {{ objective }}
              </li>
            </ul>
          </div>
          
          <div class="result-section">
            <h5>课程内容</h5>
            <div v-for="(section, index) in generatedCourse.contentSections" :key="index" class="content-section">
              <h6>{{ section.title }} ({{ section.duration }}分钟)</h6>
              <p>{{ section.content }}</p>
            </div>
          </div>
          
          <div class="result-section">
            <h5>互动环节</h5>
            <div v-for="(activity, index) in generatedCourse.interactiveSections" :key="index" class="activity-item">
              <h6>{{ activity.type }}</h6>
              <p>{{ activity.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 已保存的课程列表 -->
    <div class="card saved-courses">
      <div class="card-header">
        <h3>我的课程</h3>
      </div>
      <div class="card-body">
        <div v-if="savedCourses.length === 0" class="empty-courses">
          <p>暂无保存的课程</p>
        </div>
        <table v-else class="courses-table">
          <thead>
            <tr>
              <th>课程标题</th>
              <th>学科</th>
              <th>难度</th>
              <th>时长</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in savedCourses" :key="course.id">
              <td>{{ course.title }}</td>
              <td>{{ getSubjectText(course.subject) }}</td>
              <td>{{ getDifficultyText(course.difficulty) }}</td>
              <td>{{ course.duration }}分钟</td>
              <td>{{ formatDate(course.createdAt) }}</td>
              <td class="actions-cell">
                <button class="btn-icon" @click="editCourse(course)">编辑</button>
                <button class="btn-icon" @click="deleteCourse(course.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonDesigner',
  data() {
    return {
      courseForm: {
        title: '',
        subject: '',
        difficulty: '',
        outline: '',
        duration: 60
      },
      isGenerating: false,
      editing: false,
      editingId: null,
      generatedCourse: null,
      savedCourses: [
        {
          id: 1,
          title: '计算机基础入门',
          subject: 'computer',
          difficulty: 'beginner',
          duration: 90,
          createdAt: new Date('2023-10-15')
        },
        {
          id: 2,
          title: '数据结构与算法',
          subject: 'computer',
          difficulty: 'intermediate',
          duration: 120,
          createdAt: new Date('2023-11-02')
        }
      ]
    }
  },
  methods: {
    handleGenerateCourse() {
      // 模拟生成课程内容
      this.isGenerating = true
      setTimeout(() => {
        this.generatedCourse = {
          title: this.courseForm.title,
          objectives: [
            '理解基本的编程概念和术语',
            '掌握基础语法和数据类型',
            '能够编写简单的程序解决问题'
          ],
          contentSections: [
            {
              title: '编程基础介绍',
              content: '介绍编程的基本概念，包括什么是程序、算法、变量等核心概念。通过实际例子说明编程的应用场景。',
              duration: 20
            },
            {
              title: '数据类型与变量',
              content: '详细介绍常见的数据类型，包括整数、浮点数、字符串等，以及如何声明和使用变量存储数据。',
              duration: 25
            },
            {
              title: '控制流结构',
              content: '学习条件语句和循环语句，如何控制程序的执行流程，包括if-else语句和for循环等。',
              duration: 30
            }
          ],
          interactiveSections: [
            {
              type: '小组讨论',
              description: '让学生讨论编程在日常生活中的应用场景，加深对编程价值的理解。'
            },
            {
              type: '实践练习',
              description: '引导学生完成一个简单的编程练习，应用所学知识解决实际问题。'
            }
          ]
        }
        this.isGenerating = false
      }, 1500)
    },
    resetForm() {
      this.courseForm = {
        title: '',
        subject: '',
        difficulty: '',
        outline: '',
        duration: 60
      }
      this.editing = false
      this.editingId = null
      this.generatedCourse = null
    },
    saveCourse() {
      if (this.editing && this.editingId) {
        // 更新已有课程
        const index = this.savedCourses.findIndex(course => course.id === this.editingId)
        if (index !== -1) {
          this.savedCourses[index] = {
            ...this.savedCourses[index],
            title: this.courseForm.title,
            subject: this.courseForm.subject,
            difficulty: this.courseForm.difficulty,
            duration: this.courseForm.duration
          }
        }
      } else {
        // 添加新课程
        const newCourse = {
          id: Date.now(),
          title: this.courseForm.title,
          subject: this.courseForm.subject,
          difficulty: this.courseForm.difficulty,
          duration: this.courseForm.duration,
          createdAt: new Date()
        }
        this.savedCourses.push(newCourse)
      }
      
      this.resetForm()
    },
    regenerate() {
      this.handleGenerateCourse()
    },
    editCourse(course) {
      this.courseForm = {
        title: course.title,
        subject: course.subject,
        difficulty: course.difficulty,
        outline: course.outline || '',
        duration: course.duration
      }
      this.editing = true
      this.editingId = course.id
      
      // 滚动到顶部表单位置
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    deleteCourse(id) {
      if (confirm('确定要删除这个课程吗？')) {
        this.savedCourses = this.savedCourses.filter(course => course.id !== id)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN')
    },
    getSubjectText(subject) {
      const subjectMap = {
        'computer': '计算机科学',
        'math': '数学',
        'physics': '物理',
        'chemistry': '化学',
        'language': '语言'
      }
      return subjectMap[subject] || subject
    },
    getDifficultyText(difficulty) {
      const difficultyMap = {
        'beginner': '初级',
        'intermediate': '中级',
        'advanced': '高级'
      }
      return difficultyMap[difficulty] || difficulty
    }
  }
}
</script>

<style scoped>
.lesson-designer {
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

.result-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.result-preview {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
}

.result-preview h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  color: #3f51b5;
}

.result-section {
  margin-bottom: 20px;
}

.result-section h5 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.content-section,
.activity-item {
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #e0e0e0;
}

.content-section h6,
.activity-item h6 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 15px;
  color: #555;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th,
.courses-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.courses-table th {
  font-weight: 500;
  color: #555;
  background: #f9f9f9;
}

.empty-courses {
  text-align: center;
  padding: 30px;
  color: #999;
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
</style> 