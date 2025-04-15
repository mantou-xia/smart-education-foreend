<template>
  <div class="lesson-designer">
    <div class="card">
      <div class="card-header">
        <h3>课程内容自动生成</h3>
      </div>
      <div class="card-body">
        <form class="form" @submit.prevent="generateLesson">
          <div class="form-group">
            <label>学科类型</label>
            <select v-model="lessonForm.subjectType">
              <option value="programming">计算机编程</option>
              <option value="math">数学</option>
              <option value="physics">物理</option>
              <option value="english">英语</option>
            </select>
          </div>
          <div class="form-group">
            <label>课程大纲</label>
            <textarea v-model="lessonForm.courseOutline" placeholder="请输入课程大纲内容"></textarea>
          </div>
          <div class="form-group">
            <label>课程时长（分钟）</label>
            <input type="number" v-model="lessonForm.duration" placeholder="例如：45" />
          </div>
          <div class="form-group">
            <label>难度级别</label>
            <div class="radio-group">
              <label><input type="radio" v-model="lessonForm.difficultyLevel" value="basic" /> 基础</label>
              <label><input type="radio" v-model="lessonForm.difficultyLevel" value="intermediate" /> 中级</label>
              <label><input type="radio" v-model="lessonForm.difficultyLevel" value="advanced" /> 高级</label>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isGenerating">
              {{ isGenerating ? '生成中...' : '生成教学内容' }}
            </button>
            <button type="button" class="btn" @click="resetForm">重置</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card" v-if="generatedLesson">
      <div class="card-header">
        <h3>生成的教学内容</h3>
      </div>
      <div class="card-body">
        <div class="result-section">
          <h4>课程标题</h4>
          <p>{{ generatedLesson.title }}</p>
        </div>
        
        <div class="result-section">
          <h4>教学目标</h4>
          <ul>
            <li v-for="(objective, index) in generatedLesson.objectives" :key="'obj-'+index">
              {{ objective }}
            </li>
          </ul>
        </div>
        
        <div class="result-section">
          <h4>教学重点</h4>
          <ul>
            <li v-for="(point, index) in generatedLesson.keyPoints" :key="'key-'+index">
              {{ point }}
            </li>
          </ul>
        </div>
        
        <div class="result-section">
          <h4>内容部分</h4>
          <div class="content-section" v-for="(section, index) in generatedLesson.contentSections" :key="'sec-'+index">
            <h5>{{ section.title }}</h5>
            <p>{{ section.content }}</p>
            <div class="section-info">
              <span>建议时长: {{ section.duration }}分钟</span>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn btn-primary" @click="saveLesson">保存教案</button>
          <button class="btn" @click="printLesson">打印预览</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonDesigner',
  data() {
    return {
      isGenerating: false,
      lessonForm: {
        subjectType: 'programming',
        courseOutline: '',
        duration: 45,
        difficultyLevel: 'intermediate'
      },
      generatedLesson: null
    }
  },
  methods: {
    generateLesson() {
      // 在实际项目中，这里会调用API
      this.isGenerating = true;
      
      // 模拟API调用
      setTimeout(() => {
        this.generatedLesson = {
          title: '循环与迭代 - Python编程基础',
          objectives: [
            '理解循环的基本概念和应用场景',
            '掌握Python中for循环和while循环的使用',
            '能够实现基本的迭代算法'
          ],
          keyPoints: [
            'for循环的语法和使用方法',
            'while循环的条件控制',
            '循环嵌套和迭代器概念'
          ],
          contentSections: [
            {
              title: '循环概念介绍',
              content: '循环是编程中最基本的控制结构之一，用于重复执行特定代码块。Python提供了for和while两种主要的循环结构，本节将介绍它们的基本概念和应用场景。',
              duration: 10
            },
            {
              title: 'for循环详解',
              content: 'Python的for循环主要用于遍历序列（如列表、元组、字典、集合、字符串）或其他可迭代对象。我们将学习for循环的基本语法、range()函数的使用以及列表推导式。',
              duration: 15
            },
            {
              title: 'while循环与控制',
              content: 'while循环在条件为真时重复执行代码块。本节将介绍while循环的基本结构、条件控制以及break和continue语句的使用方法。',
              duration: 15
            }
          ]
        };
        this.isGenerating = false;
      }, 2000);
    },
    resetForm() {
      this.lessonForm = {
        subjectType: 'programming',
        courseOutline: '',
        duration: 45,
        difficultyLevel: 'intermediate'
      };
      this.generatedLesson = null;
    },
    saveLesson() {
      // 保存教案的逻辑
      alert('教案已保存！');
    },
    printLesson() {
      // 打印预览的逻辑
      window.print();
    }
  }
}
</script>

<style scoped>
.lesson-designer {
  margin-bottom: 30px;
}

.result-section {
  margin-bottom: 20px;
}

.result-section h4 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #3f51b5;
}

.content-section {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #3f51b5;
}

.content-section h5 {
  font-size: 15px;
  margin-bottom: 8px;
}

.section-info {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}

@media print {
  .form,
  .form-actions {
    display: none;
  }
}
</style> 