<template>
  <div class="data-analysis">
    <h2>数据分析</h2>
    
    <!-- 选择课程过滤器 -->
    <div class="filter-bar">
      <div class="filter-item">
        <label for="courseFilter">选择课程</label>
        <select id="courseFilter" v-model="selectedCourse">
          <option value="">全部课程</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
      </div>
      
      <div class="filter-item">
        <label for="timeRangeFilter">时间范围</label>
        <select id="timeRangeFilter" v-model="timeRange">
          <option value="week">最近一周</option>
          <option value="month">最近一个月</option>
          <option value="semester">本学期</option>
          <option value="all">全部时间</option>
        </select>
      </div>
      
      <button class="btn btn-primary" @click="refreshData">刷新数据</button>
    </div>
    
    <!-- 总体学习情况统计 -->
    <div class="card">
      <div class="card-header">
        <h3>总体学习情况</h3>
      </div>
      <div class="card-body">
        <div class="stat-cards">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalStudents }}</div>
            <div class="stat-label">学生人数</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ stats.completionRate }}%</div>
            <div class="stat-label">完成率</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ stats.averageScore }}</div>
            <div class="stat-label">平均分</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ stats.excellentRate }}%</div>
            <div class="stat-label">优秀率</div>
          </div>
        </div>
        
        <div class="progress-chart">
          <h4>作业完成情况</h4>
          <div class="chart-bars">
            <div 
              v-for="(assignment, index) in assignments" 
              :key="index"
              class="chart-bar-container"
            >
              <div class="chart-bar-label">{{ assignment.title }}</div>
              <div class="chart-bar-wrapper">
                <div 
                  class="chart-bar" 
                  :style="{ width: assignment.completionRate + '%' }"
                >
                  {{ assignment.completionRate }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 知识点掌握热图 -->
    <div class="card">
      <div class="card-header">
        <h3>知识点掌握情况</h3>
      </div>
      <div class="card-body">
        <div class="knowledge-heatmap">
          <div class="heatmap-legend">
            <div class="legend-item">
              <span class="legend-color" style="background-color: #e6f7ff"></span>
              <span>较弱</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #91d5ff"></span>
              <span>一般</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #1890ff"></span>
              <span>良好</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #0050b3"></span>
              <span>优秀</span>
            </div>
          </div>
          
          <div class="heatmap-grid">
            <div 
              v-for="(point, index) in knowledgePoints" 
              :key="index"
              class="heat-cell"
              :class="getHeatClass(point.masteryLevel)"
              @click="showPointDetails(point)"
            >
              <div class="heat-cell-content">
                <div class="heat-cell-name">{{ point.name }}</div>
                <div class="heat-cell-value">{{ point.masteryLevel }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学生个体分析 -->
    <div class="card">
      <div class="card-header">
        <h3>学生个体分析</h3>
      </div>
      <div class="card-body">
        <div class="students-filter">
          <input 
            type="text" 
            v-model="studentSearch" 
            placeholder="搜索学生姓名..." 
            class="student-search"
          >
        </div>
        
        <table class="students-table">
          <thead>
            <tr>
              <th>学生姓名</th>
              <th>完成作业数</th>
              <th>平均分</th>
              <th>学习时长</th>
              <th>学习活跃度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.completedAssignments }} / {{ assignments.length }}</td>
              <td>{{ student.averageScore }}</td>
              <td>{{ student.studyHours }}小时</td>
              <td>
                <div class="activity-indicator">
                  <div 
                    class="activity-level" 
                    :style="{ width: student.activityLevel + '%' }"
                    :class="getActivityClass(student.activityLevel)"
                  ></div>
                </div>
              </td>
              <td>
                <button class="btn-icon" @click="viewStudentDetail(student.id)">
                  查看详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 教学建议 -->
    <div class="card">
      <div class="card-header">
        <h3>教学改进建议</h3>
      </div>
      <div class="card-body">
        <div class="suggestion-list">
          <div 
            v-for="(suggestion, index) in teachingSuggestions" 
            :key="index"
            class="suggestion-item"
          >
            <div class="suggestion-icon">💡</div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-desc">{{ suggestion.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataAnalysis',
  data() {
    return {
      selectedCourse: '',
      timeRange: 'month',
      studentSearch: '',
      
      // 示例数据
      courses: [
        { id: 1, title: '计算机基础入门' },
        { id: 2, title: '数据结构与算法' }
      ],
      
      stats: {
        totalStudents: 45,
        completionRate: 78,
        averageScore: 82.5,
        excellentRate: 35
      },
      
      assignments: [
        { id: 1, title: '计算机基础测验1', completionRate: 92 },
        { id: 2, title: '计算机基础测验2', completionRate: 85 },
        { id: 3, title: '操作系统作业', completionRate: 76 },
        { id: 4, title: '网络基础作业', completionRate: 68 },
        { id: 5, title: '期中考试', completionRate: 100 }
      ],
      
      knowledgePoints: [
        { id: 1, name: '计算机组成', masteryLevel: 87 },
        { id: 2, name: '操作系统', masteryLevel: 75 },
        { id: 3, name: '编程基础', masteryLevel: 92 },
        { id: 4, name: '算法设计', masteryLevel: 63 },
        { id: 5, name: '数据结构', masteryLevel: 58 },
        { id: 6, name: '网络通信', masteryLevel: 72 },
        { id: 7, name: '数据库', masteryLevel: 45 },
        { id: 8, name: 'Web基础', masteryLevel: 79 },
        { id: 9, name: '软件工程', masteryLevel: 66 }
      ],
      
      students: [
        { 
          id: 1, 
          name: '张三', 
          completedAssignments: 5, 
          averageScore: 88,
          studyHours: 46,
          activityLevel: 85
        },
        { 
          id: 2, 
          name: '李四', 
          completedAssignments: 4, 
          averageScore: 75,
          studyHours: 32,
          activityLevel: 65
        },
        { 
          id: 3, 
          name: '王五', 
          completedAssignments: 5, 
          averageScore: 95,
          studyHours: 58,
          activityLevel: 95
        },
        { 
          id: 4, 
          name: '赵六', 
          completedAssignments: 3, 
          averageScore: 68,
          studyHours: 24,
          activityLevel: 45
        },
        { 
          id: 5, 
          name: '钱七', 
          completedAssignments: 4, 
          averageScore: 82,
          studyHours: 38,
          activityLevel: 72
        }
      ],
      
      teachingSuggestions: [
        {
          title: '加强数据结构教学',
          description: '学生在数据结构方面的掌握程度较低，建议增加更多实例和练习，特别是链表和树结构的应用。'
        },
        {
          title: '增加算法设计实践',
          description: '算法设计部分学生理解较浅，可以通过更多的编程实践来加深理解。'
        },
        {
          title: '数据库知识需要补强',
          description: '数据库是当前掌握最弱的环节，建议增加基础讲解和实际操作演示。'
        },
        {
          title: '差异化教学',
          description: '班级内学生学习能力差异较大，可以考虑分组教学或提供难度不同的作业选择。'
        }
      ]
    }
  },
  computed: {
    filteredStudents() {
      if (!this.studentSearch) {
        return this.students
      }
      const search = this.studentSearch.toLowerCase()
      return this.students.filter(student => 
        student.name.toLowerCase().includes(search)
      )
    }
  },
  methods: {
    refreshData() {
      // 刷新数据逻辑，这里简单模拟
      this.isLoading = true
      setTimeout(() => {
        // 更新部分数据以模拟刷新效果
        this.stats.completionRate = Math.floor(Math.random() * 20) + 70
        this.stats.averageScore = (Math.random() * 10 + 75).toFixed(1)
        this.isLoading = false
      }, 800)
    },
    getHeatClass(level) {
      if (level >= 85) return 'heat-excellent'
      if (level >= 70) return 'heat-good'
      if (level >= 55) return 'heat-average'
      return 'heat-weak'
    },
    getActivityClass(level) {
      if (level >= 80) return 'activity-high'
      if (level >= 60) return 'activity-medium'
      return 'activity-low'
    },
    showPointDetails(point) {
      // 点击知识点显示详情，这里简单模拟
      alert(`知识点"${point.name}"掌握情况详情\n掌握度: ${point.masteryLevel}%`)
    },
    viewStudentDetail(studentId) {
      // 查看学生详情，这里简单模拟
      alert(`查看学生ID: ${studentId} 的详细学习数据`)
    }
  }
}
</script>

<style scoped>
.data-analysis {
  padding: 0;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  align-items: flex-end;
}

.filter-item {
  flex: 1;
}

.filter-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.filter-item select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

.btn-primary {
  background: #3f51b5;
  color: white;
}

.btn:hover {
  opacity: 0.9;
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

/* 统计卡片 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
}

.stat-value {
  font-size: 28px;
  font-weight: 500;
  color: #3f51b5;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* 图表 */
.progress-chart {
  margin-top: 20px;
}

.progress-chart h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chart-bar-container {
  display: flex;
  align-items: center;
}

.chart-bar-label {
  width: 150px;
  font-size: 14px;
  color: #666;
  text-align: right;
  padding-right: 15px;
}

.chart-bar-wrapper {
  flex: 1;
  background: #f0f0f0;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background: #3f51b5;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  transition: width 0.5s ease;
}

/* 热图 */
.knowledge-heatmap {
  margin-top: 10px;
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.heat-cell {
  height: 80px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.heat-cell:hover {
  transform: scale(1.05);
}

.heat-cell-content {
  text-align: center;
}

.heat-cell-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.heat-cell-value {
  font-size: 14px;
}

.heat-weak {
  background-color: #e6f7ff;
  color: #333;
}

.heat-average {
  background-color: #91d5ff;
  color: #333;
}

.heat-good {
  background-color: #1890ff;
  color: white;
}

.heat-excellent {
  background-color: #0050b3;
  color: white;
}

/* 学生表格 */
.students-filter {
  margin-bottom: 20px;
}

.student-search {
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th,
.students-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.students-table th {
  font-weight: 500;
  color: #555;
  background: #f9f9f9;
}

.activity-indicator {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.activity-level {
  height: 100%;
  border-radius: 4px;
}

.activity-high {
  background: #52c41a;
}

.activity-medium {
  background: #faad14;
}

.activity-low {
  background: #ff4d4f;
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

/* 教学建议 */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-item {
  display: flex;
  gap: 15px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.suggestion-icon {
  font-size: 24px;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.suggestion-desc {
  color: #666;
  line-height: 1.5;
}
</style> 