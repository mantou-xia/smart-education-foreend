<template>
  <div class="student-api-test-center">
    <h1>学生 API 测试中心</h1>
    
    <el-row :gutter="20">
      <el-col :span="8" v-for="(test, index) in apiTests" :key="index">
        <el-card 
          class="test-card" 
          shadow="hover"
          @click="navigateToTest(test.path)"
        >
          <div class="card-content">
            <el-icon :size="40" class="icon">
              <component :is="test.icon" />
            </el-icon>
            <div class="text">
              <h3>{{ test.title }}</h3>
              <p>{{ test.description }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  DocumentChecked, 
  Notebook, 
  ChatDotRound, 
  DataBoard, 
  Calendar, 
  Tickets 
} from '@element-plus/icons-vue'

export default {
  name: 'StudentAPITestCenter',
  setup() {
    const router = useRouter()

    const apiTests = ref([
      {
        title: '认证 API 测试',
        description: '测试用户认证相关接口',
        path: '/student/api-test/auth',
        icon: DocumentChecked
      },
      {
        title: '学生 API 测试',
        description: '测试学生信息相关接口',
        path: '/student/api-test/student',
        icon: Notebook
      },
      {
        title: '课程 API 测试',
        description: '测试课程相关接口',
        path: '/student/api-test/course',
        icon: Tickets
      },
      {
        title: '学习进度 API 测试',
        description: '测试学习进度相关接口',
        path: '/student/api-test/learning-progress',
        icon: DataBoard
      },
      {
        title: '学习计划 API 测试',
        description: '测试学习计划相关接口',
        path: '/student/api-test/learning-plan',
        icon: Notebook
      },
      {
        title: '考勤 API 测试',
        description: '测试考勤相关接口',
        path: '/student/api-test/attendance',
        icon: Calendar
      },
      {
        title: '考试 API 测试',
        description: '测试学生考试相关接口',
        path: '/student/api-test/exam',
        icon: Tickets
      },
      {
        title: '智能助理 API 测试',
        description: '测试智能助理相关接口',
        path: '/student/api-test/assistant',
        icon: ChatDotRound
      }
    ])

    const navigateToTest = (path) => {
      router.push(path)
    }

    return {
      apiTests,
      navigateToTest
    }
  }
}
</script>

<style scoped>
.student-api-test-center {
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.test-card:hover {
  transform: scale(1.05);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon {
  color: var(--el-color-primary);
}

.text h3 {
  margin: 0 0 10px;
}

.text p {
  margin: 0;
  color: var(--el-text-color-secondary);
}
</style> 