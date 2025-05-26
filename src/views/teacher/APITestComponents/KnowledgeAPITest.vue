<template>
  <div class="knowledge-api-test">
    <h2>知识点 API 测试</h2>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据ID获取知识点</span>
          <el-input v-model="knowledgeId" placeholder="知识点ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetKnowledgeById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result1">{{ result1 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据教师ID获取知识点</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetKnowledgeByTeacherId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID获取知识点</span>
          <el-input v-model="courseId" placeholder="课程ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetKnowledgeByCourseId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID和教师ID获取知识点</span>
          <el-input v-model="courseId2" placeholder="课程ID" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="teacherId2" placeholder="教师ID" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testGetKnowledgeByTeacherInCourse">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result4">{{ result4 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>新增知识点</span>
          <el-input v-model="saveData.name" placeholder="名称" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="saveData.description" placeholder="描述" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="saveData.difficultyLevel" placeholder="难度" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.teacherId" placeholder="教师ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.courseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveData.teachPlan" placeholder="教学计划" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveKnowledge">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result5">{{ result5 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新知识点</span>
          <el-input v-model="updateData.knowledgeId" placeholder="知识点ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.name" placeholder="名称" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="updateData.description" placeholder="描述" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="updateData.difficultyLevel" placeholder="难度" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateData.teachPlan" placeholder="教学计划" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateKnowledge">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result6">{{ result6 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>删除知识点</span>
          <el-input v-model="deleteId" placeholder="知识点ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="danger" @click="testDeleteKnowledgeById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result7">{{ result7 }}</pre>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { knowledgeAPI } from '@/api/api'

export default {
  name: 'KnowledgeAPITest',
  setup() {
    const knowledgeId = ref('')
    const teacherId = ref('')
    const courseId = ref('')
    const courseId2 = ref('')
    const teacherId2 = ref('')
    const saveData = reactive({ name: '', description: '', difficultyLevel: '', teacherId: '', courseId: '', teachPlan: '' })
    const updateData = reactive({ knowledgeId: '', name: '', description: '', difficultyLevel: '', teachPlan: '' })
    const deleteId = ref('')
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')
    const result4 = ref('')
    const result5 = ref('')
    const result6 = ref('')
    const result7 = ref('')

    const testGetKnowledgeById = async () => {
      result1.value = JSON.stringify(await knowledgeAPI.getKnowledgeById(knowledgeId.value), null, 2)
    }
    const testGetKnowledgeByTeacherId = async () => {
      result2.value = JSON.stringify(await knowledgeAPI.getKnowledgeByTeacherId(teacherId.value), null, 2)
    }
    const testGetKnowledgeByCourseId = async () => {
      result3.value = JSON.stringify(await knowledgeAPI.getKnowledgeByCourseId(courseId.value), null, 2)
    }
    const testGetKnowledgeByTeacherInCourse = async () => {
      result4.value = JSON.stringify(await knowledgeAPI.getKnowledgeByTeacherInCourse(courseId2.value, teacherId2.value), null, 2)
    }
    const testSaveKnowledge = async () => {
      result5.value = JSON.stringify(await knowledgeAPI.saveKnowledge(saveData), null, 2)
    }
    const testUpdateKnowledge = async () => {
      result6.value = JSON.stringify(await knowledgeAPI.updateKnowledge(updateData), null, 2)
    }
    const testDeleteKnowledgeById = async () => {
      result7.value = JSON.stringify(await knowledgeAPI.deleteKnowledgeById(deleteId.value), null, 2)
    }

    return {
      knowledgeId, teacherId, courseId, courseId2, teacherId2, saveData, updateData, deleteId,
      result1, result2, result3, result4, result5, result6, result7,
      testGetKnowledgeById, testGetKnowledgeByTeacherId, testGetKnowledgeByCourseId, testGetKnowledgeByTeacherInCourse,
      testSaveKnowledge, testUpdateKnowledge, testDeleteKnowledgeById
    }
  }
}
</script>

<style scoped>
.knowledge-api-test { display: flex; flex-direction: column; gap: 20px; }
.test-card { margin-bottom: 20px; }
.card-header { display: flex; align-items: center; gap: 10px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style> 