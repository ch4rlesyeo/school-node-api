import { Sequelize, Op, QueryTypes } from 'sequelize'
import { filter, findIndex, uniq } from 'lodash'

import { FindCommonStudentQuery, RetrieveForNotificationsQuery } from '@definitions/query'
import { Models } from '@definitions/model'
import { Teacher } from '@definitions/teacher'
import { Student, StudentStatus } from '@definitions/student'
import { TeacherStudent } from '@definitions/teacherStudent'

export default class {
  private readonly models: Models
  private readonly sequelize: Sequelize

  constructor (sequelize: Sequelize, models: Models) {
    this.models = models
    this.sequelize = sequelize
  }

  async findTeacherByEmail (email: string, createIfNotExist?: boolean): Promise<Teacher> {
    let teacher: Teacher = await this.models.teacher.findOne({ where: { email: email } })

    if (!teacher && createIfNotExist) {
      teacher = await this.models.teacher.create({ email: email }).then((result) => result.toJSON())
    }

    return teacher
  }

  async findStudentsByEmail (emails: string[], createIfNotExist?: boolean): Promise<Student[]> {
    let students: Student[] = await this.models.student.findAll({
      raw: true,
      where: Sequelize.or({
        email: { [Op.in]: emails }
      })
    })

    if (createIfNotExist) {
      const studentsForCreate: string[] = filter(emails, (e) => findIndex(students, (s) => s.email === e) === -1)

      if (studentsForCreate.length > 0) {
        // create new students that do not exist
        const createStudentsPromises = studentsForCreate.map((email) => {
          return this.models.student.create({ email }).then((result) => result.toJSON())
        })

        const newStudents = await Promise.all(createStudentsPromises)

        students = students.concat(newStudents)
      }
    }

    return students
  }

  async linkTeacherToStudents(teacherEmail: string, studentEmails: string[]): Promise<boolean> {
    const teacher = await this.findTeacherByEmail(teacherEmail, true)

    const students = await this.findStudentsByEmail(studentEmails, true)

    // check if students are linked to the teacher
    const teacherStudents: TeacherStudent[] = await this.models.teacherStudent.findAll({
      raw: true,
      where: Sequelize.and({
        teacherId: teacher.uuid,
        studentId: { [Op.in]: students.map((s) => s.uuid) }
      })
    })

    // filter out students that linked
    const studentsForLink: Student[] = filter(students, (s) => findIndex(teacherStudents, (ts) => s.uuid === ts.studentId) === -1)

    if (studentsForLink.length > 0) {
      // link students to teacher that do not exist
      const linkStudentsPromises = studentsForLink.map((s) => {
        return this.models.teacherStudent.create({ studentId: s.uuid, teacherId: teacher.uuid })
      })

      await Promise.all(linkStudentsPromises)
    }

    return true
  }

  async findCommonStudents(teacherEmails: string[]): Promise<FindCommonStudentQuery> {
    if (!teacherEmails || teacherEmails.length === 0) {
      return {
        error: {
          message: 'Missing required fields.'
        }
      }
    }

    const students: Student[] = await this.sequelize.query(`
      SELECT s.email from teachers t
      INNER JOIN teacherStudents ts on t.uuid = ts.teacherId
      INNER JOIN students s on s.uuid = ts.studentId
      WHERE t.email IN(:teacherEmails)
      GROUP BY ts.studentId
      HAVING (COUNT(ts.studentId) = :count)
    `, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        count: teacherEmails.length,
        teacherEmails: teacherEmails.map((email) => email)
      }
    }).then((rows) => rows)

    return {
      students: students ? students.map((s) => s.email) : []
    }
  }

  async suspendStudent(email: string): Promise<boolean> {
    if (!email || email === '') {
      return false
    }

    const suspendStatus: StudentStatus = 'suspended'

    await this.models.student.update({
      status: suspendStatus
    }, {
      where: {
        email,
        status: {
          [Op.not]: suspendStatus
        }
      }
    })

    return true
  }

  async retrieveForNotifications(teacherEmail: string, notification: string): Promise<RetrieveForNotificationsQuery> {
    if (!notification || notification === '' || !teacherEmail || teacherEmail === '') {
      return {
        error: {
          message: 'Missing required fields.'
        }
      }
    }

    const teacher: Teacher = await this.models.teacher.findOne({
      raw: true,
      where: {
        email: teacherEmail
      }
    })

    if (!teacher) {
      return {
        error: {
          message: 'Invalid teacher.'
        }
      }
    }

    const matchedEmails = notification.match(/@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
    const mentionedEmails = matchedEmails ? matchedEmails.map((e) => e.substr(1)) : []

    const suspendStatus: StudentStatus = 'suspended'

    const recipients = await this.sequelize.query(`
      SELECT s.email from teachers t
      INNER JOIN teacherStudents ts on t.uuid = ts.teacherId
      INNER JOIN students s on s.uuid = ts.studentId
      WHERE (t.email = :teacherEmail ${mentionedEmails.length > 0 ? 'OR s.email IN (:mentionedEmails)' : ''}) AND s.status != :suspendStatus
    `, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        teacherEmail,
        suspendStatus,
        mentionedEmails
      }
    }).then((rows) => uniq(rows.map((r) => r.email)))

    return {
      recipients: recipients
    }
  }
}
