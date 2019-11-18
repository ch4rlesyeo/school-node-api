import { expect, assert } from 'chai'
import { isEqual } from 'lodash'
import { Sequelize } from 'sequelize'

import { Models } from '@definitions/model'
import setupModels from '@models/setup'
import TeacherService from '@services/teacher'

const commonStudents = ['student1@example.com', 'student2@example.com']

const linkTeacherToStudentsMock = {
  teacher: 'teacher1@example.com',
  students: [
    ...commonStudents,
    'student3@example.com',
    'student4@example.com'
  ]
}

const retrieveForNotificationsMock = {
  teacher: 'teacher2@example.com',
  students: [
    ...commonStudents,
    'student5@example.com',
  ]
}

describe('Unit test for teacher service', () => {
  let sequelize: Sequelize
  let models: Models
  let teacherService: TeacherService

  before(async () => {
    const result = await setupModels(true)

    models = result.models
    sequelize = result.sequelize
    teacherService = new TeacherService(sequelize, models)
  })

  it('teacher should not exist or be created', async () => {
    const teacher = await teacherService.findTeacherByEmail(linkTeacherToStudentsMock.teacher)

    expect(teacher).eql(null)
  })

  it('teacher should be created if does not exist', async () => {
    const teacher = await teacherService.findTeacherByEmail(linkTeacherToStudentsMock.teacher, true)

    assert((teacher !== null) && (teacher !== undefined))
  })

  it('students should not exist or be created', async () => {
    const students = await teacherService.findStudentsByEmail(linkTeacherToStudentsMock.students)

    expect(students).eql([])
  })

  it('students should be created if do not exist', async () => {
    const students = await teacherService.findStudentsByEmail(linkTeacherToStudentsMock.students, true)

    assert(students.length === linkTeacherToStudentsMock.students.length)
  })

  it('should create and link students to first teacher', async () => {
    const linked = await teacherService.linkTeacherToStudents(linkTeacherToStudentsMock.teacher, linkTeacherToStudentsMock.students)

    expect(linked).equal(true)
  })

  it('should create and link students to second teacher', async () => {
    const linked = await teacherService.linkTeacherToStudents(retrieveForNotificationsMock.teacher, retrieveForNotificationsMock.students)

    expect(linked).equal(true)
  })

  it('should create and link students to secondary teacher', async () => {
    const commonResult = await teacherService.findCommonStudents([linkTeacherToStudentsMock.teacher, retrieveForNotificationsMock.teacher])

    expect(isEqual(commonStudents.sort(), commonResult.students.sort())).equal(true)
  })
})
