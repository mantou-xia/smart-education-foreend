<template>
  <div class="student-assignments">
    <h2>我的作业</h2>
    
    <div v-if="loading" class="loading-state">
      加载中...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else class="assignment-list">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
        <div class="assignment-header">
          <h3>{{ assignment.title }}</h3>
          <span class="assignment-status" :class="assignment.status">{{ assignment.statusText }}</span>
        </div>
        <div class="assignment-info">
          <p class="course-name">课程：{{ assignment.course }}</p>
          <p class="deadline">截止时间：{{ formatDate(assignment.deadline) }}</p>
          <p class="description">{{ assignment.description }}</p>
        </div>
        <div class="assignment-actions">
          <button class="btn" :class="{'btn-primary': assignment.status === 'pending'}" 
                  @click="handleAssignment(assignment)">
            {{ assignment.status === 'pending' ? '提交作业' : '查看详情' }}
          </button>
        </div>
      </div>
      <div v-if="assignments.length === 0" class="empty-state">
        暂无作业数据
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUserInfo } from '@/utils/auth';
import { studentExam, exam, course, student } from '@/api/api';

export default {
  name: 'StudentAssignments',
  setup() {
    const assignments = ref([]);
    const loading = ref(false);
    const error = ref('');
    
    // 获取学生作业数据
    const fetchAssignments = async () => {
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
        
        // 获取学生的考试成绩列表（包括作业）
        // 这里我们假设后端API把作业也当作一种考试类型
        const examScores = await studentExam.getStudentExamScores(studentId);
        
        // 获取详细的考试/作业信息
        const assignmentPromises = examScores
          .filter(item => item.examType === 'ASSIGNMENT' || item.type === 'ASSIGNMENT') // 只过滤作业类型
          .map(async item => {
            try {
              // 获取作业详情
              const examDetail = await exam.getExamById(item.examId);
              
              // 获取课程信息
              let courseName = '未知课程';
              if (examDetail.courseId) {
                try {
                  const courseDetail = await course.getCourseById(examDetail.courseId);
                  courseName = courseDetail.name;
                } catch (e) {
                  console.error('获取课程信息失败:', e);
                }
              }
              
              // 判断状态
              let status = 'pending';
              let statusText = '待提交';
              
              if (item.submitted) {
                status = 'submitted';
                statusText = '已提交';
                
                if (item.graded) {
                  status = 'graded';
                  statusText = '已批改';
                }
              }
              
              return {
                id: item.examId,
                title: examDetail.title,
                course: courseName,
                deadline: examDetail.endTime || examDetail.deadline,
                description: examDetail.description || '无描述',
                status,
                statusText,
                score: item.score,
                examDetail
              };
            } catch (e) {
              console.error(`获取作业${item.examId}详情失败:`, e);
              return null;
            }
          });
          
        const assignmentResults = await Promise.all(assignmentPromises);
        assignments.value = assignmentResults.filter(item => item !== null);
      } catch (e) {
        console.error('获取作业数据失败:', e);
        error.value = '获取作业数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '无截止日期';
      
      try {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      } catch (e) {
        return dateString;
      }
    };
    
    const handleAssignment = (assignment) => {
      if (assignment.status === 'pending') {
        // 实现提交作业的逻辑
        console.log('提交作业:', assignment.title);
        // 可以跳转到作业提交页面
        // router.push({ name: 'SubmitAssignment', params: { id: assignment.id } });
      } else {
        // 实现查看作业详情的逻辑
        console.log('查看作业详情:', assignment.title);
        // 可以跳转到作业详情页面
        // router.push({ name: 'AssignmentDetail', params: { id: assignment.id } });
      }
    };
    
    // 组件挂载时获取数据
    onMounted(fetchAssignments);
    
    return {
      assignments,
      loading,
      error,
      formatDate,
      handleAssignment
    };
  }
}
</script>

<style scoped>
.student-assignments {
  padding: 20px;
}

.assignment-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.assignment-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.assignment-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.assignment-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.assignment-status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.assignment-status.submitted {
  background: #f6ffed;
  color: #52c41a;
}

.assignment-status.graded {
  background: #e6f7ff;
  color: #1890ff;
}

.assignment-info {
  margin-bottom: 15px;
}

.course-name, .deadline {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
}

.description {
  color: #333;
  margin: 10px 0;
  line-height: 1.5;
}

.assignment-actions {
  text-align: right;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #f5f5f5;
  color: #333;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.error-state {
  color: #f5222d;
}
</style> 