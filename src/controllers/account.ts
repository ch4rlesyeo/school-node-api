import { Request, Response, } from 'express'
import { Sequelize } from 'sequelize'
import { Controller, Post, Get } from '@overnightjs/core'

import { Models } from '@definitions/model'
import TeacherService from '../services/teacher'

interface Props {
  sequelize: Sequelize,
  models: Models
}

interface RegistrationBody {
  teacher: string,
  students: string[]
}

interface SuspendBody {
  student: string
}

interface RetrieveForNotificationsBody {
  teacher: string,
  notification: string
}

@Controller('api')
export class AccountController {
  private readonly sequelize: Sequelize
  private readonly models: Models
  private readonly teacherService: TeacherService

  constructor (props: Props) {
    const { sequelize, models } = props

    this.models = models
    this.sequelize = sequelize
    this.teacherService = new TeacherService(sequelize, models)
  }

  @Get('commonstudents')
  private getCommonStudents(req: Request, res: Response): Promise<Response> {
    return this.teacherService.findCommonStudents(req.query.teacher).then((resp) => {
      return res.status(200).json(resp)
    }).catch((error) => {
      console.log(error)
      return res.status(500).send()
    })
  }

  @Post('register')
  private registration(req: Request, res: Response): Promise<Response> {
    const body: RegistrationBody = req.body

    return this.teacherService.linkTeacherToStudents(body.teacher, body.students).then(() => {
      return res.status(204).send()
    }).catch((error) => {
      console.log(error)
      return res.status(500).send()
    })
  }

  @Post('suspend')
  private suspendStudent(req: Request, res: Response): Promise<Response> {
    const body: SuspendBody = req.body

    return this.teacherService.suspendStudent(body.student).then(() => {
      return res.status(204).send()
    }).catch((error) => {
      console.log(error)
      return res.status(500).send()
    })
  }

  @Post('retrievefornotifications')
  private retrieveForNotifications(req: Request, res: Response): Promise<Response> {
    const body: RetrieveForNotificationsBody = req.body

    return this.teacherService.retrieveForNotifications(body.teacher, body.notification).then((resp) => {
      return res.status(200).json(resp)
    }).catch((error) => {
      console.log(error)
      return res.status(500).send()
    })
  }
}
