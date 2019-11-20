import { NextFunction } from 'express'
import { isEmail } from 'validator'

import { GetCommonStudentsRequest, RegistrationRequest, SuspendRequest, RetrieveForNotificationRequest } from '@definitions/account'
import { MiddlewareResponse } from '@definitions/middleware'

export const validateGetCommonStudents = (req: GetCommonStudentsRequest, res: MiddlewareResponse, next: NextFunction) => {
  const { teacher } = req.query

  if (!teacher || teacher.length === 0) {
    return res.status(400).json({
      message: 'Missing required fields.'
    })
  }

  const areValidEmails = teacher.every((t) => isEmail(t))

  if (!areValidEmails) {
    return res.status(400).json({
      message: 'Emails badly formatted.'
    })
  }

  return next()
}

export const validateRegistration = (req: RegistrationRequest, res: MiddlewareResponse, next: NextFunction) => {
  const { teacher, students } = req.body

  if ((!teacher || teacher === '') || (!students && students.length === 0)) {
    return res.status(400).json({
      message: 'Missing required fields.'
    })
  }

  const areValidEmails = isEmail(teacher) && students.every((s) => isEmail(s))

  if (!areValidEmails) {
    return res.status(400).json({
      message: 'Emails badly formatted.'
    })
  }

  return next()
}

export const validateSuspend = (req: SuspendRequest, res: MiddlewareResponse, next: NextFunction) => {
  const { student } = req.body

  if (!student || student === '') {
    return res.status(400).json({
      message: 'Missing required fields.'
    })
  }

  const isValidEmail = isEmail(student)

  if (!isValidEmail) {
    return res.status(400).json({
      message: 'Emails badly formatted.'
    })
  }

  return next()
}

export const validateRetrieveForNotifications = (req: RetrieveForNotificationRequest, res: MiddlewareResponse, next: NextFunction) => {
  const { teacher, notification } = req.body

  if ((!teacher || teacher === '') || (!notification && notification === '')) {
    return res.status(400).json({
      message: 'Missing required fields.'
    })
  }

  const isValidEmail = isEmail(teacher)

  if (!isValidEmail) {
    return res.status(400).json({
      message: 'Emails badly formatted.'
    })
  }

  return next()
}
