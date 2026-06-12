import type { User } from './store/authStore'

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  campus?: 'Bidholi' | 'Kandoli' | 'Development' | string
  maxCapacity: number
  status: string
  bannerImage?: string
  category: string
  clubId?: number
  coordinatorId?: number
  engagementScore?: number
  registrationCount?: number
  passCode?: string
}

export interface Club {
  id: number
  name: string
  description: string
  bannerImage?: string
  creatorId?: number
  creator?: User
  membersCount: number
  status: string
}

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export interface Attendee {
  studentId: number
  name: string
  email: string
  department: string
  checkedIn: boolean
  checkedInAt: string | null
  passCode: string
}

export interface SmartSlot {
  date: string
  time: string
  conflictScore: number
  explanation: string
}

export interface RegistrationTrendItem {
  name: string
  count: number
}

export interface ClubEngagementItem {
  name: string
  score: number
  members: number
}

export interface EventCategoryHeatmapItem {
  category: string
  value: number
}

export interface EngagementStats {
  platformScore: number
  registrationsTrend: RegistrationTrendItem[]
  clubEngagement: ClubEngagementItem[]
  eventCategoryHeatmap: EventCategoryHeatmapItem[]
}
