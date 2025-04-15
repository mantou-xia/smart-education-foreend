<template>
  <div class="data-analysis">
    <div class="analysis-header">
      <div class="filter-bar">
        <div class="filter-item">
          <label>班级</label>
          <select v-model="filters.classId">
            <option value="class001">2023级软件工程1班</option>
            <option value="class002">2023级软件工程2班</option>
            <option value="class003">2023级计算机科学1班</option>
          </select>
        </div>
        <div class="filter-item">
          <label>课程</label>
          <select v-model="filters.courseId">
            <option value="course001">Python编程基础</option>
            <option value="course002">数据结构与算法</option>
            <option value="course003">Web前端开发</option>
          </select>
        </div>
        <div class="filter-item">
          <label>时间段</label>
          <select v-model="filters.timeRange">
            <option value="week">最近一周</option>
            <option value="month">最近一个月</option>
            <option value="semester">本学期</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="generateReport">生成报告</button>
      </div>
      
      <div class="report-summary" v-if="report">
        <div class="summary-card">
          <div class="summary-value">{{ report.overallPerformance.averageScore.toFixed(1) }}</div>
          <div class="summary-label">平均分</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">{{ (report.overallPerformance.passRate * 100).toFixed(1) }}%</div>
          <div class="summary-label">通过率</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">{{ (report.overallPerformance.excellentRate * 100).toFixed(1) }}%</div>
          <div class="summary-label">优秀率</div>
        </div>
        <div class="summary-card" :class="{'positive': report.overallPerformance.improvementTrend > 0, 'negative': report.overallPerformance.improvementTrend < 0}">
          <div class="summary-value">
            {{ report.overallPerformance.improvementTrend > 0 ? '+' : '' }}{{ (report.overallPerformance.improvementTrend * 100).toFixed(1) }}%
          </div>
          <div class="summary-label">提升趋势</div>
        </div>
      </div>
    </div>
    
    <div class="analysis-content" v-if="report">
      <div class="row">
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <h3>知识点掌握热图</h3>
            </div>
            <div class="card-body">
              <div class="knowledge-heatmap">
                <div class="heatmap-item" v-for="(point, index) in report.knowledgePointsMastery" :key="index">
                  <div class="point-name">{{ point.name }}</div>
                  <div class="point-bar">
                    <div class="point-progress" :style="{width: point.masteryRate * 100 + '%', backgroundColor: getMasteryColor(point.masteryRate)}"></div>
                  </div>
                  <div class="point-value">{{ (point.masteryRate * 100).toFixed(0) }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <h3>主要学习挑战</h3>
            </div>
            <div class="card-body">
              <ul class="challenge-list">
                <li v-for="(challenge, index) in report.topChallenges" :key="index">
                  {{ challenge }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>建议教学重点</h3>
            </div>
            <div class="card-body">
              <div class="focus-list">
                <div class="focus-item" v-for="(focus, index) in report.recommendedFocus" :key="index">
                  <div class="focus-icon">
                    <i class="icon-star"></i>
                  </div>
                  <div class="focus-content">{{ focus }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3>教学改进建议</h3>
            </div>
            <div class="card-body">
              <div class="improvement-suggestion">
                {{ report.improvementSuggestions }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="header-with-actions">
                <h3>学生表现详情</h3>
                <button class="btn btn-sm btn-text">
                  <i class="icon-download"></i> 导出数据
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="student-table-wrapper">
                <table class="student-table">
                  <thead>
                    <tr>
                      <th>学号</th>
                      <th>姓名</th>
                      <th>平均分</th>
                      <th>完成率</th>
                      <th>进步指数</th>
                      <th>薄弱知识点</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, index) in studentPerformance" :key="index">
                      <td>{{ student.id }}</td>
                      <td>{{ student.name }}</td>
                      <td>{{ student.averageScore }}</td>
                      <td>
                        <div class="progress-bar">
                          <div class="progress" :style="{width: student.completionRate * 100 + '%'}"></div>
                        </div>
                        <span>{{ (student.completionRate * 100).toFixed(0) }}%</span>
                      </td>
                      <td>
                        <span :class="{'trend-up': student.progressIndex > 0, 'trend-down': student.progressIndex < 0}">
                          {{ student.progressIndex > 0 ? '+' : '' }}{{ student.progressIndex }}
                        </span>
                      </td>
                      <td>
                        <div class="tag-list">
                          <span class="tag" v-for="(weakness, wIndex) in student.weakPoints" :key="wIndex">
                            {{ weakness }}
                          </span>
                        </div>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-text">详情</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-state" v-if="!report">
      <div class="empty-icon">📊</div>
      <h3>请选择班级和课程生成学情分析报告</h3>
      <p>分析报告将显示班级整体表现、知识点掌握情况和个性化教学建议</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataAnalysis',
  data() {
    return {
      filters: {
        classId: 'class001',
        courseId: 'course001',
        timeRange: 'month'
      },
      report: null,
      studentPerformance: []
    }
  },
  methods: {
    generateReport() {
      // 模拟API调用生成报告
      setTimeout(() => {
        this.report = {
          classId: this.filters.classId,
          generationDate: new Date().toISOString().split('T')[0],
          overallPerformance: {
            averageScore: 78.5,
            passRate: 0.92,
            excellentRate: 0.35,
            improvementTrend: 0.12
          },
          knowledgePointsMastery: [
            { pointId: 'k001', name: 'Python变量与数据类型', masteryRate: 0.89, difficultLevel: 0.2 },
            { pointId: 'k002', name: 'Python条件语句', masteryRate: 0.82, difficultLevel: 0.3 },
            { pointId: 'k003', name: 'Python循环结构', masteryRate: 0.76, difficultLevel: 0.4 },
            { pointId: 'k004', name: 'Python函数定义与调用', masteryRate: 0.71, difficultLevel: 0.5 },
            { pointId: 'k005', name: 'Python列表操作', masteryRate: 0.65, difficultLevel: 0.6 },
            { pointId: 'k006', name: 'Python字典与集合', masteryRate: 0.58, difficultLevel: 0.7 },
            { pointId: 'k007', name: 'Python文件操作', masteryRate: 0.42, difficultLevel: 0.8 }
          ],
          topChallenges: [
            'Python文件操作中的异常处理逻辑',
            '字典与集合的高级用法和性能优化',
            '嵌套循环的理解和应用',
            '函数参数传递机制的掌握'
          ],
          recommendedFocus: [
            '增加文件操作的实践案例，强化异常处理',
            '设计字典与集合的对比练习，突出各自优势',
            '通过递进式难度的循环练习强化理解',
            '设计可视化工具展示函数调用过程'
          ],
          improvementSuggestions: '根据分析结果，建议在教学中增加更多的实践案例，特别是关于文件操作和异常处理的部分。可以考虑采用小组合作的形式，让学生相互讲解和示范。另外，针对函数参数传递机制的理解，可以设计更直观的可视化教具或动画，帮助学生理解参数传递的过程。循环结构的教学可以采用由简到繁的案例设计，并增加实际应用场景的演示。'
        };
        
        // 模拟学生表现数据
        this.studentPerformance = [
          { 
            id: '20230001', 
            name: '张三', 
            averageScore: 92, 
            completionRate: 0.95, 
            progressIndex: 5, 
            weakPoints: ['文件操作'] 
          },
          { 
            id: '20230002', 
            name: '李四', 
            averageScore: 78, 
            completionRate: 0.85, 
            progressIndex: 3, 
            weakPoints: ['字典', '函数参数'] 
          },
          { 
            id: '20230003', 
            name: '王五', 
            averageScore: 65, 
            completionRate: 0.70, 
            progressIndex: -2, 
            weakPoints: ['循环', '异常处理', '文件操作'] 
          },
          { 
            id: '20230004', 
            name: '赵六', 
            averageScore: 85, 
            completionRate: 0.90, 
            progressIndex: 0, 
            weakPoints: ['高级函数'] 
          },
          { 
            id: '20230005', 
            name: '钱七', 
            averageScore: 70, 
            completionRate: 0.75, 
            progressIndex: 4, 
            weakPoints: ['字典', '集合'] 
          }
        ];
      }, 1000);
    },
    getMasteryColor(rate) {
      // 根据掌握率返回不同颜色
      if (rate >= 0.8) return '#4caf50';
      if (rate >= 0.6) return '#8bc34a';
      if (rate >= 0.4) return '#ffc107';
      if (rate >= 0.2) return '#ff9800';
      return '#f44336';
    }
  }
}
</script>

<style scoped>
.data-analysis {
  margin-bottom: 30px;
}

.analysis-header {
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  align-items: flex-end;
}

.filter-item {
  flex: 1;
}

.filter-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.filter-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.report-summary {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.summary-card {
  flex: 1;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.summary-value {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 5px;
}

.summary-label {
  font-size: 14px;
  color: #666;
}

.positive .summary-value {
  color: #4caf50;
}

.negative .summary-value {
  color: #f44336;
}

.row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.col-6 {
  flex: 0 0 calc(50% - 10px);
}

.col-12 {
  flex: 0 0 100%;
}

.knowledge-heatmap {
  margin-top: 10px;
}

.heatmap-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.point-name {
  width: 170px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.point-bar {
  flex: 1;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 10px;
}

.point-progress {
  height: 100%;
  border-radius: 5px;
}

.point-value {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
}

.challenge-list, .focus-list {
  padding-left: 20px;
}

.challenge-list li, .focus-item {
  margin-bottom: 10px;
}

.focus-item {
  display: flex;
}

.focus-icon {
  margin-right: 10px;
  color: #ffc107;
}

.improvement-suggestion {
  line-height: 1.6;
  white-space: pre-line;
}

.student-table-wrapper {
  overflow-x: auto;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-table th, .student-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.student-table th {
  background-color: #f5f5f5;
  font-weight: 500;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 3px;
}

.trend-up {
  color: #4caf50;
}

.trend-down {
  color: #f44336;
}

.tag-list {
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin-bottom: 10px;
  font-weight: 500;
}

.empty-state p {
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}
</style> 