import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore, type User } from '../store/authStore'
import { store } from '../store/index'
import type { Event, Club } from '../types'

const BASE_URL = '/api'

// Client-side Mock Data Store (Fallback if backend is offline/loading)
const MOCK_USERS: User[] = [
  { id: 1, name: 'Alex Rivera', email: 'student@unisphere.edu', role: 'STUDENT', department: 'Computer Science', profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 2, name: 'Dr. Sarah Jenkins', email: 'faculty@unisphere.edu', role: 'FACULTY', department: 'Data Science', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 3, name: 'Admin Chief', email: 'admin@unisphere.edu', role: 'ADMIN', department: 'Administration', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
]

let mockClubs: Club[] = [
  { id: 1, name: 'UPES ACM Student Chapter', description: 'Deep dive into algorithmic challenges, hackathons, and software engineering principles at UPES.', bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', creatorId: 2, membersCount: 142, status: 'ACTIVE' },
  { id: 2, name: 'UPES IEEE Student Branch', description: 'Promoting technical innovation and excellence in engineering, science, and computing at UPES Dehradun.', bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', creatorId: 2, membersCount: 98, status: 'ACTIVE' },
  { id: 3, name: 'UPES NSS Chapter', description: 'National Service Scheme unit at UPES, focusing on rural development, blood donation drives, and sustainability campaigns.', bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', creatorId: 2, membersCount: 64, status: 'ACTIVE' },
  { id: 4, name: 'UPES Uurja Cultural Club', description: 'The premier cultural hub of UPES showcasing music, dance, theatre, and visual arts competitions.', bannerImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', creatorId: 2, membersCount: 42, status: 'ACTIVE' },
  { id: 5, name: 'UPES Microsoft Technical Community', description: 'Fostering industry readiness and hands-on coding in Microsoft technologies and cloud services at UPES.', bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', creatorId: 2, membersCount: 88, status: 'ACTIVE' },
  { id: 6, name: 'UPES Sports Committee', description: 'Hosting intramural sporting leagues, athletic meets, and Spandan sports events at Bidholi campus.', bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', creatorId: 2, membersCount: 112, status: 'ACTIVE' },
  { id: 7, name: 'UPES BioGenics Lab Club', description: 'Fusing biology with state-of-the-art computational tools.', bannerImage: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800', creatorId: 2, membersCount: 12, status: 'PENDING' }
]

let mockEvents: Event[] = [
  {
    id: 1,
    title: 'UPES ACM Hack-a-Sphere 2026',
    description: 'The ultimate 24-hour campus hackathon at UPES Bidholi! Build solutions for sustainability, education, or healthcare. Win exciting prizes and placement interviews.',
    date: '2026-06-15',
    time: '09:00',
    location: 'Main Auditorium, Bidholi Campus',
    campus: 'Bidholi',
    maxCapacity: 150,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    category: 'TECH',
    clubId: 1,
    coordinatorId: 2,
    engagementScore: 92.5
  },
  {
    id: 2,
    title: 'UPES AI Innovations Summit',
    description: 'An interactive seminar hosted by IEEE UPES discussing the socioeconomic impacts of generative AI models, deepfakes, and automated campus grading systems.',
    date: '2026-06-20',
    time: '14:00',
    location: 'Energy Acres Block Hall A, Bidholi',
    campus: 'Bidholi',
    maxCapacity: 100,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
    category: 'ACADEMIC',
    clubId: 2,
    coordinatorId: 2,
    engagementScore: 78.0
  },
  {
    id: 3,
    title: 'UPES NSS Cleanliness & Greenery Drive',
    description: 'Help NSS UPES collect plastic waste and set up recycling hubs near the Bidholi student dormitories. T-shirts and refreshments provided to volunteers!',
    date: '2026-06-12',
    time: '08:00',
    location: 'Bidholi Campus Quadrangle',
    campus: 'Bidholi',
    maxCapacity: 50,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
    category: 'SPORTS',
    clubId: 3,
    coordinatorId: 2,
    engagementScore: 65.2
  },
  {
    id: 4,
    title: 'UPES ACM Quantum Computing Seminar',
    description: 'An advanced seminar detailing qubits, superposition, and quantum cryptographic algorithms. Recommended for CS & Engineering students.',
    date: '2026-06-28',
    time: '16:00',
    location: 'CS Block Room 101, Bidholi',
    campus: 'Bidholi',
    maxCapacity: 30,
    status: 'PENDING',
    bannerImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'TECH',
    clubId: 1,
    coordinatorId: 2,
    engagementScore: 0.0
  },
  {
    id: 5,
    title: 'UPES Uurja Fest 2026',
    description: 'The flagship annual cultural festival of UPES featuring dance battles, band performances, street plays, and celebrity night.',
    date: '2026-06-22',
    time: '17:00',
    location: 'Central Amphitheater, Bidholi Campus',
    campus: 'Bidholi',
    maxCapacity: 300,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'CULTURAL',
    clubId: 4,
    coordinatorId: 2,
    engagementScore: 85.0
  },
  {
    id: 6,
    title: 'UPES Spandan Startup Pitch Arena',
    description: 'Pitch your startup idea to guest angel investors. Top 3 proposals win incubation grants and office spaces in the UPES Research Park.',
    date: '2026-06-25',
    time: '15:00',
    location: 'Management Block Seminar Hall, Bidholi',
    campus: 'Bidholi',
    maxCapacity: 80,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    category: 'ACADEMIC',
    clubId: 5,
    coordinatorId: 2,
    engagementScore: 72.0
  },
  {
    id: 7,
    title: 'UPES Spandan Basketball Clash',
    description: 'The annual inter-school athletic clash between School of Computer Science and School of Business! Free energy drinks and fan merchandise at the entrance.',
    date: '2026-06-18',
    time: '18:00',
    location: 'Indoor Sports Arena, Kandoli Campus',
    campus: 'Kandoli',
    maxCapacity: 200,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    category: 'SPORTS',
    clubId: 6,
    coordinatorId: 2,
    engagementScore: 90.0
  },
  {
    id: 8,
    title: 'UPES Hypervision Photography Workshop',
    description: 'Learn framing, shutter speed controls, and lighting adjustments from professional photographers. Cameras will be provided.',
    date: '2026-06-29',
    time: '10:00',
    location: 'Design Studio, Bidholi Campus',
    campus: 'Bidholi',
    maxCapacity: 40,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800',
    category: 'CULTURAL',
    clubId: 4,
    coordinatorId: 2,
    engagementScore: 68.0
  }
]

const mockRegistrations = [
  { id: 1, eventId: 1, studentId: 1, registrationDate: '2026-06-09T10:00:00.000Z', status: 'REGISTERED', passCode: 'PASS-1-100432' },
  { id: 2, eventId: 2, studentId: 1, registrationDate: '2026-06-09T10:30:00.000Z', status: 'REGISTERED', passCode: 'PASS-2-990423' },
]

const mockAttendance = [
  { id: 1, eventId: 3, studentId: 1, checkedInAt: '2026-06-08T08:15:00.000Z', checkedById: 2 }
]

const mockNotifications = [
  { id: 1, userId: 1, title: 'Event Registered', message: 'You have successfully registered for Hack-a-Sphere 2026. Your QR pass is available in your wallet.', type: 'REGISTRATION', isRead: false, createdAt: '2026-06-09T10:00:00.000Z' },
  { id: 2, userId: 2, title: 'New Event Pending Approval', message: 'Your event Intro to Quantum Computing is pending admin review.', type: 'EVENT_APPROVAL', isRead: false, createdAt: '2026-06-09T12:00:00.000Z' }
]

const mockFeedback = [
  { id: 1, eventId: 3, studentId: 1, rating: 5, comment: 'Well organized and meaningful work!', createdAt: '2026-06-08T11:00:00.000Z' }
]

// API Client Helper
async function request(path: string, options: RequestInit = {}) {
  const token = store.getState().auth.token
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

// Custom API Hooks
export function useLogin() {
  const setAuth = useAuthStore(state => state.setAuth)
  return useMutation({
    mutationFn: async (credentials: { email: string; password?: string }) => {
      try {
        return await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        })
      } catch (err) {
        console.warn('Backend offline, falling back to mock login.', err)
        const found = MOCK_USERS.find(u => u.email === credentials.email)
        if (found && credentials.password === 'password') {
          const mockToken = `mock-jwt-token-for-${found.role.toLowerCase()}`
          return { user: found, token: mockToken }
        }
        throw new Error('Invalid email or password. Use: student@unisphere.edu, faculty@unisphere.edu, or admin@unisphere.edu with password "password"', { cause: err })
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
    }
  })
}

export function useRegister() {
  const setAuth = useAuthStore(state => state.setAuth)
  return useMutation({
    mutationFn: async (details: { name: string; email: string; password?: string; role?: 'STUDENT' | 'FACULTY' | 'ADMIN'; department?: string }) => {
      try {
        return await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(details)
        })
      } catch (err) {
        console.warn('Backend offline, generating mock user.', err)
        const newUser: User = {
          id: MOCK_USERS.length + 1,
          name: details.name,
          email: details.email,
          role: details.role || 'STUDENT',
          department: details.department || 'General Science',
          profileImage: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
        }
        MOCK_USERS.push(newUser)
        const mockToken = `mock-jwt-token-for-${newUser.role.toLowerCase()}`
        return { user: newUser, token: mockToken }
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
    }
  })
}

// EVENTS API
export function useEvents(category?: string) {
  return useQuery({
    queryKey: ['events', category],
    queryFn: async () => {
      try {
        const url = category ? `/events?category=${category}` : '/events'
        return await request(url)
      } catch {
        let events = mockEvents.filter(e => e.status === 'APPROVED')
        if (category) events = events.filter(e => e.category === category)
        return events
      }
    }
  })
}

export function useMyRegistrations() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['my-registrations', user?.id],
    queryFn: async () => {
      try {
        return await request('/events/my-registrations')
      } catch {
        const myRegs = mockRegistrations.filter(r => r.studentId === user?.id && r.status === 'REGISTERED')
        return mockEvents
          .filter(e => myRegs.some(r => r.eventId === e.id))
          .map(e => {
            const reg = myRegs.find(r => r.eventId === e.id)
            return {
              ...e,
              passCode: reg?.passCode
            }
          })
      }
    },
    enabled: !!user
  })
}

export function useRegisterForEvent() {
  const user = useAuthStore(state => state.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (eventId: number) => {
      try {
        return await request(`/events/${eventId}/register`, { method: 'POST' })
      } catch {
        const code = `PASS-${eventId}-${Math.floor(100000 + Math.random() * 900000)}`
        mockRegistrations.push({
          id: mockRegistrations.length + 1,
          eventId,
          studentId: user?.id || 1,
          registrationDate: new Date().toISOString(),
          status: 'REGISTERED',
          passCode: code
        })
        mockNotifications.push({
          id: mockNotifications.length + 1,
          userId: user?.id || 1,
          title: 'Registered Successfully',
          message: `Your pass is reserved for event ID: ${eventId}`,
          type: 'REGISTRATION',
          isRead: false,
          createdAt: new Date().toISOString()
        })
        return { message: 'Successfully registered', passCode: code }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations'] })
    }
  })
}

export function useSubmitFeedback() {
  const user = useAuthStore(state => state.user)
  return useMutation({
    mutationFn: async ({ eventId, rating, comment }: { eventId: number; rating: number; comment: string }) => {
      try {
        return await request(`/events/${eventId}/feedback`, {
          method: 'POST',
          body: JSON.stringify({ rating, comment })
        })
      } catch {
        mockFeedback.push({
          id: mockFeedback.length + 1,
          eventId,
          studentId: user?.id || 1,
          rating,
          comment,
          createdAt: new Date().toISOString()
        })
        return { message: 'Feedback submitted' }
      }
    }
  })
}

export function useCoordinatorEvents() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['coordinator-events', user?.id],
    queryFn: async () => {
      try {
        return await request('/events/coordinator')
      } catch {
        return mockEvents.filter(e => e.coordinatorId === user?.id)
      }
    },
    enabled: !!user
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)
  return useMutation({
    mutationFn: async (eventData: {
      title: string
      description: string
      date: string
      time: string
      location: string
      maxCapacity: number | string
      category: string
      clubId: number | string
      bannerImage?: string
    }) => {
      try {
        return await request('/events', {
          method: 'POST',
          body: JSON.stringify(eventData)
        })
      } catch {
        const newEvent = {
          id: mockEvents.length + 1,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          maxCapacity: Number(eventData.maxCapacity),
          status: 'PENDING',
          bannerImage: eventData.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          category: eventData.category || 'TECH',
          clubId: Number(eventData.clubId),
          coordinatorId: user?.id || 2,
          engagementScore: 0.0
        }
        mockEvents.push(newEvent)
        return newEvent
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordinator-events'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (eventId: number) => {
      try {
        return await request(`/events/${eventId}`, { method: 'DELETE' })
      } catch {
        mockEvents = mockEvents.filter(e => e.id !== eventId)
        return { message: 'Event deleted' }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordinator-events'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

// CLUBS API
export function useClubs() {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      try {
        return await request('/clubs')
      } catch {
        return mockClubs.filter(c => c.status === 'ACTIVE')
      }
    }
  })
}

export function useCreateClub() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (clubData: { name: string; description: string; bannerImage?: string }) => {
      try {
        return await request('/clubs', {
          method: 'POST',
          body: JSON.stringify(clubData)
        })
      } catch {
        const newClub = {
          id: mockClubs.length + 1,
          name: clubData.name,
          description: clubData.description,
          bannerImage: clubData.bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
          creatorId: 2,
          membersCount: 1,
          status: 'PENDING'
        }
        mockClubs.push(newClub)
        return newClub
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
    }
  })
}

// ADMIN API
export function usePendingEvents() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['pending-events'],
    queryFn: async () => {
      try {
        return await request('/admin/events/pending')
      } catch {
        return mockEvents.filter(e => e.status === 'PENDING')
      }
    },
    enabled: user?.role === 'ADMIN'
  })
}

export function useApproveEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ eventId, approve }: { eventId: number; approve: boolean }) => {
      try {
        return await request(`/admin/events/${eventId}/approve?approve=${approve}`, {
          method: 'POST'
        })
      } catch {
        const ev = mockEvents.find(e => e.id === eventId)
        if (ev) {
          ev.status = approve ? 'APPROVED' : 'REJECTED'
          
          // Notify coordinator
          mockNotifications.push({
            id: mockNotifications.length + 1,
            userId: ev.coordinatorId || 2,
            title: approve ? 'Event Approved!' : 'Event Rejected',
            message: `Your event "${ev.title}" has been ${approve ? 'approved by admin.' : 'rejected by admin.'}`,
            type: 'EVENT_APPROVAL',
            isRead: false,
            createdAt: new Date().toISOString()
          })
        }
        return { message: 'Event status updated' }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-events'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

export function usePendingClubs() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['pending-clubs'],
    queryFn: async () => {
      try {
        return await request('/admin/clubs/pending')
      } catch {
        return mockClubs.filter(c => c.status === 'PENDING')
      }
    },
    enabled: user?.role === 'ADMIN'
  })
}

export function useApproveClub() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ clubId, approve }: { clubId: number; approve: boolean }) => {
      try {
        return await request(`/admin/clubs/${clubId}/approve?approve=${approve}`, {
          method: 'POST'
        })
      } catch {
        if (approve) {
          const cl = mockClubs.find(c => c.id === clubId)
          if (cl) cl.status = 'ACTIVE'
        } else {
          mockClubs = mockClubs.filter(c => c.id !== clubId)
        }
        return { message: 'Club approval finished' }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-clubs'] })
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
    }
  })
}

export function useUsersList() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        return await request('/admin/users')
      } catch {
        return MOCK_USERS
      }
    },
    enabled: user?.role === 'ADMIN'
  })
}

// ATTENDANCE API
export function useEventAttendees(eventId: number) {
  return useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: async () => {
      try {
        return await request(`/attendance/event/${eventId}`)
      } catch {
        const attendeesReg = mockRegistrations.filter(r => r.eventId === eventId && r.status === 'REGISTERED')
        return attendeesReg.map(r => {
          const st = MOCK_USERS.find(u => u.id === r.studentId) || { name: 'Student', email: 'stud@unisphere.edu', department: 'CS' }
          const checkedIn = mockAttendance.find(a => a.eventId === eventId && a.studentId === r.studentId)
          return {
            studentId: r.studentId,
            name: st.name,
            email: st.email,
            department: st.department,
            checkedIn: !!checkedIn,
            checkedInAt: checkedIn?.checkedInAt || null,
            passCode: r.passCode
          }
        })
      }
    }
  })
}

export function useCheckInAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ eventId, passCode }: { eventId: number; passCode: string }) => {
      try {
        return await request('/attendance/check-in', {
          method: 'POST',
          body: JSON.stringify({ eventId, passCode })
        })
      } catch (err) {
        // Fallback checks
        const reg = mockRegistrations.find(r => r.passCode === passCode && r.eventId === eventId)
        if (!reg) throw new Error('Invalid digital pass QR code for this event!', { cause: err })
        const alreadyChecked = mockAttendance.find(a => a.eventId === eventId && a.studentId === reg.studentId)
        if (alreadyChecked) throw new Error('Student already checked in!', { cause: err })

        mockAttendance.push({
          id: mockAttendance.length + 1,
          eventId,
          studentId: reg.studentId,
          checkedInAt: new Date().toISOString(),
          checkedById: 2
        })

        // Notify Student
        mockNotifications.push({
          id: mockNotifications.length + 1,
          userId: reg.studentId,
          title: 'Attendance Checked In',
          message: `Your attendance has been scanned for event ${mockEvents.find(e => e.id === eventId)?.title}`,
          type: 'REGISTRATION',
          isRead: false,
          createdAt: new Date().toISOString()
        })

        return { success: true, studentId: reg.studentId }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-attendees', variables.eventId] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

// NOTIFICATIONS API
export function useNotifications() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      try {
        return await request('/notifications')
      } catch {
        return mockNotifications.filter(n => n.userId === user?.id)
      }
    },
    enabled: !!user
  })
}

export function useReadNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (notificationId: number) => {
      try {
        return await request(`/notifications/${notificationId}/read`, { method: 'POST' })
      } catch {
        const notif = mockNotifications.find(n => n.id === notificationId)
        if (notif) notif.isRead = true
        return { message: 'Read' }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

// AI ENGINE API
export function useAIRecommendations() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['ai-recommendations', user?.id],
    queryFn: async () => {
      try {
        return await request('/ai/recommendations')
      } catch {
        // AI heuristics simulation in frontend:
        const department = user?.department || 'Computer Science'
        return mockEvents
          .filter(e => e.status === 'APPROVED')
          .map(e => {
            let score = 0.4
            let reason = 'Recommended based on overall popular interest.'
            if (e.category === 'TECH' && department.includes('Computer')) {
              score = 0.95
              reason = 'Matches your Computer Science academic track.'
            } else if (e.category === 'ACADEMIC' && department.includes('Data')) {
              score = 0.92
              reason = 'Aligns with your statistics and ML course curriculum.'
            } else if (e.category === 'SPORTS') {
              score = 0.72
              reason = 'Popular outdoor wellness activity near your dorm.'
            }
            return {
              id: e.id,
              event: e,
              score,
              recommendationReason: reason
            }
          })
          .sort((a, b) => b.score - a.score)
      }
    },
    enabled: !!user
  })
}

export function useAIPredictAttendance(category: string, capacity: number, day: string) {
  return useQuery({
    queryKey: ['ai-predict-attendance', category, capacity, day],
    queryFn: async () => {
      try {
        return await request(`/ai/predict-attendance?category=${category}&capacity=${capacity}&dayOfWeek=${day}`)
      } catch {
        // Attendance regression algorithm
        let baseRate = 0.65 // general
        if (category === 'TECH') baseRate = 0.85
        if (category === 'ACADEMIC') baseRate = 0.55
        if (category === 'SPORTS') baseRate = 0.75

        let dayMultiplier = 1.0
        if (day === 'Saturday' || day === 'Sunday') dayMultiplier = 1.15
        if (day === 'Friday') dayMultiplier = 0.95 // weekend travel

        let capMultiplier = 1.0
        if (capacity > 100) capMultiplier = 0.85

        const predictedRate = Math.min(1.0, baseRate * dayMultiplier * capMultiplier)
        return {
          predictedAttendanceRate: Number((predictedRate * 100).toFixed(1)),
          factors: [
            `Base attendance probability for ${category} is ${(baseRate * 100).toFixed(0)}%.`,
            dayMultiplier > 1.0 ? `Weekend scheduling increases likelihood of student attendance by 15%.` : `Weekday schedule holds default standard attendance index.`,
            capMultiplier < 1.0 ? `Large target capacity (${capacity}) historically displays minor percentage drop due to seats abundance.` : `Small-mid size event focus increases commitment index.`
          ]
        }
      }
    }
  })
}

export function useAISmartSchedule() {
  return useQuery({
    queryKey: ['ai-smart-schedule'],
    queryFn: async () => {
      try {
        return await request('/ai/smart-schedule')
      } catch {
        // Conflict optimization matrix suggestions
        return [
          { date: '2026-06-17', time: '16:00', conflictScore: 0.15, explanation: 'Best slot: No other major tech events, low coordinator workload, venue is unoccupied.' },
          { date: '2026-06-19', time: '11:00', conflictScore: 0.22, explanation: 'Optimal slot: Low conflict, but close to lunch break; library auditorium is empty.' },
          { date: '2026-06-14', time: '15:00', conflictScore: 0.45, explanation: 'Moderate conflict: Hack-a-Sphere is scheduled the next morning; student attention is low.' }
        ]
      }
    }
  })
}

export function useAIEngagementStats() {
  const user = useAuthStore(state => state.user)
  return useQuery({
    queryKey: ['ai-engagement-stats'],
    queryFn: async () => {
      try {
        return await request('/ai/engagement-stats')
      } catch {
        return {
          platformScore: 82.4,
          registrationsTrend: [
            { name: 'Mon', count: 32 },
            { name: 'Tue', count: 45 },
            { name: 'Wed', count: 78 },
            { name: 'Thu', count: 91 },
            { name: 'Fri', count: 64 },
            { name: 'Sat', count: 120 },
            { name: 'Sun', count: 145 },
          ],
          clubEngagement: mockClubs.filter(c => c.status === 'ACTIVE').map(c => ({
            name: c.name.split(' ')[0], // first word
            score: Math.floor(40 + Math.random() * 55),
            members: c.membersCount
          })),
          eventCategoryHeatmap: [
            { category: 'TECH', value: 45 },
            { category: 'ACADEMIC', value: 25 },
            { category: 'SPORTS', value: 30 },
            { category: 'CULTURAL', value: 10 }
          ]
        }
      }
    },
    enabled: user?.role === 'ADMIN' || user?.role === 'FACULTY'
  })
}
