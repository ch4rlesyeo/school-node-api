import { Sequelize, DataTypes, Model } from 'sequelize'

import { Student, StudentStatus } from '@definitions/student'

export type StudentModel = typeof Model & { new (modelName: string, attributes?: any, options?: any): Student }

export default (sequelize: Sequelize) => {
  const defaultStatus: StudentStatus = 'active'

  return sequelize.define('students', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: defaultStatus
    }
  }, {
    indexes: [{
      fields: ['uuid', 'email', 'status']
    }]
  }) as StudentModel
}
