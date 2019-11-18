export interface QueryError {
  message: string
}

export interface FindCommonStudentQuery {
  students?: string[],
  error?: QueryError
}

export interface RetrieveForNotificationsQuery {
  recipients?: string[],
  error?: QueryError
}
