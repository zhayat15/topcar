import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApiResponse } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Response helpers
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

export function createErrorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message
  }
}

// Date and time utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount)
}

// Form validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+61|0)[2-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Error handling for API calls
export async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<ApiResponse<T>> {
  try {
    const response = await apiCall()
    const data = await response.json()
    
    if (!response.ok) {
      return createErrorResponse(
        data.error || 'API call failed',
        data.message || `HTTP ${response.status}`
      )
    }
    
    return data
  } catch (error) {
    console.error('API call error:', error)
    return createErrorResponse(
      'Network error',
      'Failed to connect to server'
    )
  }
}

// Local storage helpers for mock data persistence
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Mock data generators for development
export function generateMockAppointments(count: number = 10) {
  const appointments = []
  const services = ['basic-detail', 'interior-detail', 'full-detail', 'cut-polish']
  const statuses: ('pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed')[] = ['pending', 'confirmed', 'assigned', 'in-progress', 'completed']
  const vehicleTypes: ('standard' | 'large')[] = ['standard', 'large']
  const paymentMethods: ('online' | 'in-person')[] = ['online', 'in-person']
  const paymentStatuses: ('pending' | 'paid' | 'failed')[] = ['pending', 'paid', 'failed']
  
  for (let i = 0; i < count; i++) {
    const date = new Date()
    date.setDate(date.getDate() + Math.floor(Math.random() * 30))
    
    appointments.push({
      id: generateId(),
      customerId: generateId(),
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      customerPhone: `0412 345 ${String(i).padStart(3, '0')}`,
      servicePackageId: services[Math.floor(Math.random() * services.length)],
      servicePackageName: 'Mock Service',
      vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      appointmentDate: date.toISOString().split('T')[0],
      appointmentTime: `${9 + Math.floor(Math.random() * 8)}:00`,
      address: `${i + 1} Mock Street, Sydney NSW 2000`,
      totalPrice: 79 + Math.floor(Math.random() * 200),
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
  
  return appointments
}
