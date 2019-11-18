import { Sequelize } from 'sequelize'
import mysql2 from 'mysql2'

import { Setup } from '../definitions/model'
import teacher from './teacher'
import student from './student'
import teacherStudent from './teacherStudent'

export default async (sync?: boolean): Promise<Setup> => {
  const sequelize = new Sequelize('schooldb', 'dbmasteruser', 'pa$$w0rd', {
    host: 'ls-36f86beea68e3eaf7af73671c028cebbeceeaa83.chtzngyilkwd.ap-southeast-1.rds.amazonaws.com',
    dialect: 'mysql',
    dialectModule: mysql2
  })

  const models = {
    teacher: teacher(sequelize),
    student: student(sequelize),
    teacherStudent: teacherStudent(sequelize)
  }

  if (sync) {
    await sequelize.sync({
      force: true
    })
  }

  return {
    models,
    sequelize
  }
}
