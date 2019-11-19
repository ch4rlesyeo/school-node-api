import { Request } from 'express'
import { Omit } from '@utils/format'

export interface GetCommonStudentsQuery {
  query: {
    teacher: string[]
  }
}

export type RegistrationRequestBody = {
  body: {
    teacher: string,
    students: string[]
  }
}

export type SuspendRequestBody = {
  body: {
    student: string
  }
}

export type RetrieveForNotificationBody = {
  body: {
    teacher: string,
    notification: string
  }
}

export type GetCommonStudentsRequest = Omit<Request, 'query'> & GetCommonStudentsQuery
export type RegistrationRequest = Omit<Request, 'body'> & RegistrationRequestBody
export type SuspendRequest = Omit<Request, 'body'> & SuspendRequestBody
export type RetrieveForNotificationRequest = Omit<Request, 'body'> & RetrieveForNotificationBody
