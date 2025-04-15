<template>
  <div class="student-management">
    <h2>学生管理</h2>
    
    <!-- 搜索和过滤工具栏 -->
    <div class="toolbar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索学生姓名或学号..." 
          @input="searchStudents"
        >
        <button class="search-btn">
          <i class="icon-search">🔍</i>
        </button>
      </div>
      
      <div class="filter-group">
        <select v-model="courseFilter">
          <option value="">所有课程</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary" @click="showImportModal">导入学生</button>
        <button class="btn" @click="exportStudentData">导出数据</button>
      </div>
    </div>
    
    <!-- 学生列表 -->
    <div class="card">
      <div class="card-header">
        <h3>学生列表</h3>
        <div class="header-actions">
          <span class="total-count">共 {{ filteredStudents.length }} 名学生</span>
        </div>
      </div>
      <div class="card-body">
        <table class="students-table">
          <thead>
            <tr>
              <th class="checkbox-column">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th>学号</th>
              <th>姓名</th>
              <th>性别</th>
              <th>注册日期</th>
              <th>状态</th>
              <th>已选课程</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td class="checkbox-column">
                <input type="checkbox" v-model="selectedStudents" :value="student.id">
              </td>
              <td>{{ student.studentId }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.gender }}</td>
              <td>{{ formatDate(student.registerDate) }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="student.status"
                >
                  {{ getStatusText(student.status) }}
                </span>
              </td>
              <td>{{ student.courses.length }}</td>
              <td class="actions-column">
                <button class="btn-icon" @click="viewStudent(student)">查看</button>
                <button class="btn-icon" @click="editStudent(student)">编辑</button>
                <button class="btn-icon danger" @click="confirmDeleteStudent(student)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" v-if="filteredStudents.length === 0">
          <p>没有找到符合条件的学生</p>
        </div>
        
        <div class="batch-actions" v-if="selectedStudents.length > 0">
          <div class="selection-info">
            已选择 {{ selectedStudents.length }} 名学生
          </div>
          <div class="batch-buttons">
            <button class="btn" @click="assignCourse">分配课程</button>
            <button class="btn danger" @click="confirmBatchDelete">批量删除</button>
          </div>
        </div>
        
        <div class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="page-number"
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
    
    <!-- 学生详情弹窗 -->
    <div class="modal" v-if="showStudentModal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ isEditMode ? '编辑学生信息' : '学生详情' }}</h4>
          <button class="close-btn" @click="closeStudentModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="studentName">姓名</label>
            <input 
              type="text" 
              id="studentName" 
              v-model="currentStudent.name"
              :disabled="!isEditMode"
            >
          </div>
          
          <div class="form-group">
            <label for="studentId">学号</label>
            <input 
              type="text" 
              id="studentId" 
              v-model="currentStudent.studentId"
              :disabled="!isEditMode"
            >
          </div>
          
          <div class="form-group">
            <label for="studentGender">性别</label>
            <select 
              id="studentGender" 
              v-model="currentStudent.gender"
              :disabled="!isEditMode"
            >
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="studentStatus">状态</label>
            <select 
              id="studentStatus" 
              v-model="currentStudent.status"
              :disabled="!isEditMode"
            >
              <option value="active">在读</option>
              <option value="inactive">休学</option>
              <option value="graduated">已毕业</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>已选课程</label>
            <div class="student-courses">
              <div 
                v-for="studentCourse in studentCourses" 
                :key="studentCourse.id"
                class="student-course-item"
              >
                <span>{{ studentCourse.title }}</span>
                <button 
                  v-if="isEditMode" 
                  class="remove-course-btn"
                  @click="removeCourse(studentCourse.id)"
                >
                  &times;
                </button>
              </div>
              
              <div v-if="isEditMode" class="add-course">
                <select v-model="courseToAdd">
                  <option value="">添加课程...</option>
                  <option 
                    v-for="course in availableCourses" 
                    :key="course.id" 
                    :value="course.id"
                  >
                    {{ course.title }}
                  </option>
                </select>
                <button 
                  class="add-course-btn" 
                  @click="addCourse"
                  :disabled="!courseToAdd"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="closeStudentModal">取消</button>
          <button 
            v-if="isEditMode" 
            class="btn btn-primary" 
            @click="saveStudent"
          >
            保存
          </button>
        </div>
      </div>
    </div>
    
    <!-- 导入学生弹窗 -->
    <div class="modal" v-if="showImportStudentModal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>导入学生</h4>
          <button class="close-btn" @click="closeImportModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="import-options">
            <div class="form-group">
              <label for="importFile">选择CSV文件</label>
              <input type="file" id="importFile" accept=".csv">
            </div>
            
            <div class="import-template">
              <div class="template-header">文件模板格式</div>
              <div class="template-content">
                学号,姓名,性别,邮箱<br>
                10001,张三,男,zhangsan@example.com<br>
                10002,李四,女,lisi@example.com
              </div>
              <button class="btn" @click="downloadTemplate">下载模板</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="closeImportModal">取消</button>
          <button class="btn btn-primary" @click="importStudents">导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentManagement',
  data() {
    return {
      searchQuery: '',
      courseFilter: '',
      currentPage: 1,
      pageSize: 10,
      
      selectAll: false,
      selectedStudents: [],
      
      showStudentModal: false,
      showImportStudentModal: false,
      isEditMode: false,
      currentStudent: null,
      courseToAdd: '',
      
      // 示例数据
      courses: [
        { id: 1, title: '计算机基础入门' },
        { id: 2, title: '数据结构与算法' },
        { id: 3, title: 'Web开发基础' }
      ],
      
      students: [
        {
          id: 1,
          studentId: '20230001',
          name: '张三',
          gender: '男',
          registerDate: new Date('2023-09-01'),
          status: 'active',
          courses: [1, 2]
        },
        {
          id: 2,
          studentId: '20230002',
          name: '李四',
          gender: '女',
          registerDate: new Date('2023-09-01'),
          status: 'active',
          courses: [1]
        },
        {
          id: 3,
          studentId: '20230003',
          name: '王五',
          gender: '男',
          registerDate: new Date('2023-09-02'),
          status: 'active',
          courses: [1, 2, 3]
        },
        {
          id: 4,
          studentId: '20230004',
          name: '赵六',
          gender: '男',
          registerDate: new Date('2023-09-03'),
          status: 'inactive',
          courses: [1]
        },
        {
          id: 5,
          studentId: '20230005',
          name: '钱七',
          gender: '女',
          registerDate: new Date('2023-09-05'),
          status: 'active',
          courses: [2, 3]
        }
      ]
    }
  },
  computed: {
    filteredStudents() {
      let result = [...this.students]
      
      // 应用搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(student => 
          student.name.toLowerCase().includes(query) || 
          student.studentId.includes(query)
        )
      }
      
      // 应用课程过滤
      if (this.courseFilter) {
        result = result.filter(student => 
          student.courses.includes(parseInt(this.courseFilter))
        )
      }
      
      return result
    },
    
    // 分页数据
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredStudents.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.pageSize) || 1
    },
    
    // 当前学生的课程
    studentCourses() {
      if (!this.currentStudent) return []
      
      return this.courses.filter(course => 
        this.currentStudent.courses.includes(course.id)
      )
    },
    
    // 可添加的课程（排除已选课程）
    availableCourses() {
      if (!this.currentStudent) return []
      
      return this.courses.filter(course => 
        !this.currentStudent.courses.includes(course.id)
      )
    }
  },
  methods: {
    searchStudents() {
      this.currentPage = 1
    },
    
    changePage(page) {
      this.currentPage = page
    },
    
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedStudents = this.filteredStudents.map(student => student.id)
      } else {
        this.selectedStudents = []
      }
    },
    
    viewStudent(student) {
      this.currentStudent = JSON.parse(JSON.stringify(student))
      this.isEditMode = false
      this.showStudentModal = true
    },
    
    editStudent(student) {
      this.currentStudent = JSON.parse(JSON.stringify(student))
      this.isEditMode = true
      this.showStudentModal = true
    },
    
    closeStudentModal() {
      this.showStudentModal = false
      this.currentStudent = null
      this.isEditMode = false
      this.courseToAdd = ''
    },
    
    saveStudent() {
      // 实际应用中会调用API保存学生数据
      const index = this.students.findIndex(s => s.id === this.currentStudent.id)
      if (index !== -1) {
        this.students[index] = { ...this.currentStudent }
      }
      this.closeStudentModal()
    },
    
    confirmDeleteStudent(student) {
      if (confirm(`确定要删除学生 ${student.name} 吗？`)) {
        this.deleteStudent(student.id)
      }
    },
    
    deleteStudent(id) {
      this.students = this.students.filter(student => student.id !== id)
      this.selectedStudents = this.selectedStudents.filter(sid => sid !== id)
    },
    
    confirmBatchDelete() {
      if (confirm(`确定要删除选中的 ${this.selectedStudents.length} 名学生吗？`)) {
        this.batchDeleteStudents()
      }
    },
    
    batchDeleteStudents() {
      this.students = this.students.filter(student => 
        !this.selectedStudents.includes(student.id)
      )
      this.selectedStudents = []
      this.selectAll = false
    },
    
    assignCourse() {
      // 实际应用中会打开一个选择课程的弹窗
      alert(`为 ${this.selectedStudents.length} 名学生分配课程`)
    },
    
    addCourse() {
      if (this.courseToAdd && this.currentStudent) {
        if (!this.currentStudent.courses.includes(parseInt(this.courseToAdd))) {
          this.currentStudent.courses.push(parseInt(this.courseToAdd))
        }
        this.courseToAdd = ''
      }
    },
    
    removeCourse(courseId) {
      if (this.currentStudent) {
        this.currentStudent.courses = this.currentStudent.courses.filter(id => id !== courseId)
      }
    },
    
    showImportModal() {
      this.showImportStudentModal = true
    },
    
    closeImportModal() {
      this.showImportStudentModal = false
    },
    
    importStudents() {
      // 实际应用中会处理文件上传和数据导入
      alert('学生导入功能将在这里实现')
      this.closeImportModal()
    },
    
    downloadTemplate() {
      // 实际应用中会生成并下载CSV模板
      alert('模板下载功能将在这里实现')
    },
    
    exportStudentData() {
      // 实际应用中会导出学生数据为CSV或Excel
      alert('学生数据导出功能将在这里实现')
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN')
    },
    
    getStatusText(status) {
      const statusMap = {
        'active': '在读',
        'inactive': '休学',
        'graduated': '已毕业'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.student-management {
  padding: 0;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.search-box input {
  padding: 10px;
  border: none;
  outline: none;
  width: 250px;
  font-size: 14px;
}

.search-btn {
  background: none;
  border: none;
  padding: 0 10px;
  cursor: pointer;
  color: #666;
}

.filter-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
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

.btn.danger {
  background: #fff1f0;
  color: #f5222d;
}

.btn.danger:hover {
  background: #ffd4d2;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.header-actions {
  color: #666;
  font-size: 14px;
}

.card-body {
  padding: 0;
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

.checkbox-column {
  width: 40px;
  text-align: center;
}

.checkbox-column input {
  cursor: pointer;
}

.actions-column {
  display: flex;
  gap: 5px;
}

.btn-icon {
  padding: 5px 8px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
}

.btn-icon:hover {
  background: #f5f5f5;
}

.btn-icon.danger {
  border-color: #ffccc7;
  color: #f5222d;
}

.btn-icon.danger:hover {
  background: #fff1f0;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.active {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.inactive {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.graduated {
  background: #e6f7ff;
  color: #1890ff;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #999;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.selection-info {
  font-size: 14px;
  color: #333;
}

.batch-buttons {
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  color: #333;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
  margin: 0 10px;
}

.page-number {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-number.active {
  background: #3f51b5;
  color: white;
  border-color: #3f51b5;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f9f9f9;
  cursor: not-allowed;
}

.student-courses {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.student-course-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
}

.student-course-item:last-child {
  border-bottom: none;
}

.remove-course-btn {
  background: none;
  border: none;
  color: #f5222d;
  cursor: pointer;
  font-size: 16px;
}

.add-course {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-course select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-course-btn {
  padding: 8px 12px;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-course-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.import-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.import-template {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.template-header {
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.template-content {
  font-family: monospace;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}
</style> 