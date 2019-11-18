import { Sequelize, DataTypes, Model } from 'sequelize'

import { Teacher } from '@definitions/teacher'

export type TeacherModel = typeof Model & { new (modelName: string, attributes?: any, options?: any): Teacher }

export default (sequelize: Sequelize) => {
  return sequelize.define('teachers', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: DataTypes.STRING
  }, {
    indexes: [{
      fields: ['uuid', 'email']
    }]
  }) as TeacherModel
}
