export interface Promotion {
  id: string
  name: string
  description: string
  discount: number
  startDate: string
  endDate: string
  destinations: string[]
  isActive: boolean
  createdAt: string
}
