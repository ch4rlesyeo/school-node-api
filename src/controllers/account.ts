import { Response, } from 'express'
import { Sequelize } from 'sequelize'
import { Controller, Post, Get, Middleware } from '@overnightjs/core'

import { Models } from '@definitions/model'
import {
  GetCommonStudentsRequest,
  RegistrationRequest,
  SuspendRequest,
  RetrieveForNotificationRequest
} from '@definitions/account'
import {
  validateGetCommonStudents,
  validateRegistration,
  validateSuspend,
  validateRetrieveForNotifications
} from '../middlewares/account'
import TeacherService from '../services/teacher'

interface Props {
  sequelize: Sequelize,
  models: Models
}

@Controller('api')
export class AccountController {
  private readonly teacherService: TeacherService

  constructor (props: Props) {
    const { sequelize, models } = props

    this.teacherService = new TeacherService(sequelize, models)
  }

  @Get('commonstudents')
  @Middleware(validateGetCommonStudents)
  private async getCommonStudents(req: GetCommonStudentsRequest, res: Response): Promise<Response> {
    try {
      const { teacher } = req.query

      const resp = await this.teacherService.findCommonStudents(teacher)

      return res.status(200).json(resp)
    } catch (error) {
      console.log('Some error logger here', error)
      return res.status(500).send()
    }
  }

  @Post('register')
  @Middleware(validateRegistration)
  private async registration(req: RegistrationRequest, res: Response): Promise<Response> {
    try {
      const { teacher, students } = req.body

      await this.teacherService.linkTeacherToStudents(teacher, students)

      return res.status(204).send()
    } catch (error) {
      console.log('Some error logger here', error)
      return res.status(500).send()
    }
  }

  @Post('suspend')
  @Middleware(validateSuspend)
  private async suspendStudent(req: SuspendRequest, res: Response): Promise<Response> {
    try {
      const { student } = req.body

      await this.teacherService.suspendStudent(student)

      return res.status(204).send()
    } catch (error) {
      console.log('Some error logger here', error)
      return res.status(500).send()
    }
  }

  @Post('retrievefornotifications')
  @Middleware(validateRetrieveForNotifications)
  private async retrieveForNotifications(req: RetrieveForNotificationRequest, res: Response): Promise<Response> {
    try {
      const { teacher, notification } = req.body

      const resp = await this.teacherService.retrieveForNotifications(teacher, notification)

      return res.status(200).json(resp)
    } catch (error) {
      console.log('Some error logger here', error)
      return res.status(500).send()
    }
  }
}
