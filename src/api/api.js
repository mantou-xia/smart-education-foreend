// 导出所有API接口
import * as auth from './auth';
import * as teacher from './teacher';
import * as student from './student';
import * as knowledge from './knowledge';
import * as question from './question';
import * as exam from './exam';
import * as course from './course';
import * as learningProgress from './learningProgress';
import * as teachingAssistant from './teachingAssistant';
import * as studentExam from './studentExam';

export {
  auth,
  teacher,
  student,
  knowledge,
  question,
  exam,
  course,
  learningProgress,
  teachingAssistant,
  studentExam
}; 

/**
 * 使用样式

import { auth, student } from '@/api/api';

// 登录
auth.login({
  username: 'student1',
  password: '123456'
}).then(response => {
  // 保存token
  const { accessToken, refreshToken } = response.tokens;
  // ...处理登录成功
}).catch(error => {
  // 处理错误
});

// 获取学生信息
student.getStudentById(1).then(response => {
  // 处理学生数据
}).catch(error => {
  // 处理错误
});

 */