import { Sequelize } from 'sequelize'
import { TeacherModel } from '../models/teacher'
import { StudentModel } from '../models/student'
import { TeacherStudentModel } from '../models/teacherStudent'

export interface Models {
  teacher: TeacherModel,
  student: StudentModel,
  teacherStudent: TeacherStudentModel
}

export interface Setup {
  sequelize: Sequelize,
  models: Models
}
