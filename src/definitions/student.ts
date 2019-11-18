
export type StudentStatus = 'active' | 'inactive' | 'suspended'

export interface Student {
  uuid?: string,
  email: string,
  status: StudentStatus,
  updatedAt?: Date,
  createdAt?: Date
}
