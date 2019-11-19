export interface ErrorMessage {
  message: string
}

export interface FindCommonStudentQuery {
  students?: string[],
  error?: ErrorMessage
}

export interface RetrieveForNotificationsQuery {
  recipients?: string[],
  error?: ErrorMessage
}
