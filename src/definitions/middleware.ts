import { Response } from 'express'

import { Omit } from '@utils/format'
import { ErrorMessage } from './query'

type Status = {
  status(code: number): {
    json(error: ErrorMessage): Response
  }
}

export type MiddlewareResponse = Omit<Response, 'status'> & Status
