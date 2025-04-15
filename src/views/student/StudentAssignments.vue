<template>
  <div class="student-assignments">
    <h2>我的作业</h2>
    <div class="assignment-list">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
        <div class="assignment-header">
          <h3>{{ assignment.title }}</h3>
          <span class="assignment-status" :class="assignment.status">{{ assignment.statusText }}</span>
        </div>
        <div class="assignment-info">
          <p class="course-name">课程：{{ assignment.course }}</p>
          <p class="deadline">截止时间：{{ assignment.deadline }}</p>
          <p class="description">{{ assignment.description }}</p>
        </div>
        <div class="assignment-actions">
          <button class="btn" :class="{'btn-primary': assignment.status === 'pending'}" 
                  @click="handleAssignment(assignment)">
            {{ assignment.status === 'pending' ? '提交作业' : '查看详情' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentAssignments',
  data() {
    return {
      assignments: [
        {
          id: 1,
          title: '计算机基础作业1',
          course: '计算机基础',
          deadline: '2024-03-20 23:59',
          description: '完成操作系统基础知识的练习题',
          status: 'pending',
          statusText: '待提交'
        },
        {
          id: 2,
          title: 'Web开发作业1',
          course: 'Web开发',
          deadline: '2024-03-25 23:59',
          description: '使用HTML和CSS完成一个简单的网页布局',
          status: 'submitted',
          statusText: '已提交'
        }
      ]
    }
  },
  methods: {
    handleAssignment(assignment) {
      if (assignment.status === 'pending') {
        // TODO: 实现提交作业的逻辑
        console.log('提交作业:', assignment.title)
      } else {
        // TODO: 实现查看作业详情的逻辑
        console.log('查看作业详情:', assignment.title)
      }
    }
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
</style> 