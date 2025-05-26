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
          <span>根据教师ID获取知识点列表</span>
          <el-input v-model="teacherId" placeholder="教师ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetKnowledgeByTeacherId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result2">{{ result2 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID获取知识点列表</span>
          <el-input v-model="courseId" placeholder="课程ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="primary" @click="testGetKnowledgeByCourseId">执行测试</el-button>
        </div>
      </template>
      <pre v-if="result3">{{ result3 }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>根据课程ID和教师ID获取知识点列表</span>
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
          <el-input v-model="saveForm.name" placeholder="知识点名称" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="saveForm.description" placeholder="描述" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="saveForm.difficultyLevel" placeholder="难度等级" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="saveForm.teacherId" placeholder="教师ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveForm.courseId" placeholder="课程ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="saveForm.teachPlan" placeholder="教学计划" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testSaveKnowledge">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultSave">{{ resultSave }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>更新知识点</span>
          <el-input v-model="updateForm.knowledgeId" placeholder="知识点ID" style="width: 80px; margin-right: 5px;" />
          <el-input v-model="updateForm.name" placeholder="知识点名称" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateForm.description" placeholder="描述" style="width: 120px; margin-right: 5px;" />
          <el-input v-model="updateForm.difficultyLevel" placeholder="难度等级" style="width: 100px; margin-right: 5px;" />
          <el-input v-model="updateForm.teachPlan" placeholder="教学计划" style="width: 120px; margin-right: 5px;" />
          <el-button type="primary" @click="testUpdateKnowledge">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultUpdate">{{ resultUpdate }}</pre>
    </el-card>
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>删除知识点</span>
          <el-input v-model="deleteKnowledgeId" placeholder="知识点ID" style="width: 120px; margin-right: 10px;" />
          <el-button type="danger" @click="testDeleteKnowledgeById">执行测试</el-button>
        </div>
      </template>
      <pre v-if="resultDelete">{{ resultDelete }}</pre>
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
    const result1 = ref('')
    const result2 = ref('')
    const result3 = ref('')
    const result4 = ref('')
    const saveForm = reactive({ name: '', description: '', difficultyLevel: '', teacherId: '', courseId: '', teachPlan: '' })
    const updateForm = reactive({ knowledgeId: '', name: '', description: '', difficultyLevel: '', teachPlan: '' })
    const deleteKnowledgeId = ref('')
    const resultSave = ref('')
    const resultUpdate = ref('')
    const resultDelete = ref('')

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
      try {
        resultSave.value = JSON.stringify(await knowledgeAPI.saveKnowledge(saveForm), null, 2)
      } catch (e) {
        resultSave.value = e.message || '新增知识点失败'
      }
    }
    const testUpdateKnowledge = async () => {
      try {
        resultUpdate.value = JSON.stringify(await knowledgeAPI.updateKnowledge(updateForm), null, 2)
      } catch (e) {
        resultUpdate.value = e.message || '更新知识点失败'
      }
    }
    const testDeleteKnowledgeById = async () => {
      try {
        resultDelete.value = JSON.stringify(await knowledgeAPI.deleteKnowledgeById(deleteKnowledgeId.value), null, 2)
      } catch (e) {
        resultDelete.value = e.message || '删除知识点失败'
      }
    }

    return {
      knowledgeId, teacherId, courseId, courseId2, teacherId2, result1, result2, result3, result4,
      saveForm, updateForm, deleteKnowledgeId, resultSave, resultUpdate, resultDelete,
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