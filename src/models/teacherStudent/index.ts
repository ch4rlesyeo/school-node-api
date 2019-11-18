import { Sequelize, DataTypes, Model } from 'sequelize'

import { TeacherStudent } from '@definitions/teacherStudent'

export type TeacherStudentModel = typeof Model & { new (modelName: string, attributes?: any, options?: any): TeacherStudent }

export default (sequelize: Sequelize) => {
  return sequelize.define('teacherStudents', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    teacherId: DataTypes.UUID,
    studentId: DataTypes.UUID
  }, {
    indexes: [{
      fields: ['uuid', 'teacherId', 'studentId']
    }]
  }) as TeacherStudentModel
}
