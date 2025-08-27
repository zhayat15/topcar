import { NextRequest, NextResponse } from 'next/server'
import { Appointment, BookingFormData, SERVICE_PACKAGES } from '@/types'
import { createSuccessResponse, createErrorResponse, generateId, getFromStorage, saveToStorage, generateMockAppointments } from '@/lib/utils-extended'

// Mock data storage key
const APPOINTMENTS_KEY = 'appointments'

// GET /api/appointments - Fetch all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const workerId = searchParams.get('workerId')
    const customerId = searchParams.get('customerId')
    
    // Get appointments from localStorage (mock database)
    let appointments: Appointment[] = getFromStorage(APPOINTMENTS_KEY, [])
    
    // If no appointments exist, generate some mock data
    if (appointments.length === 0) {
      appointments = generateMockAppointments()
      saveToStorage(APPOINTMENTS_KEY, appointments)
    }
    
    // Filter appointments based on query parameters
    if (status) {
      appointments = appointments.filter(apt => apt.status === status)
    }
    
    if (workerId) {
      appointments = appointments.filter(apt => apt.assignedWorkerId === workerId)
    }
    
    if (customerId) {
      appointments = appointments.filter(apt => apt.customerId === customerId)
    }
    
    return NextResponse.json(createSuccessResponse(appointments))
    
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      createErrorResponse('Failed to fetch appointments'),
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingFormData = await request.json()
    
    // Validate required fields
    if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.servicePackageId) {
      return NextResponse.json(
        createErrorResponse('Missing required fields'),
        { status: 400 }
      )
    }
    
    // Find the service package
    const servicePackage = SERVICE_PACKAGES.find(pkg => pkg.id === bookingData.servicePackageId)
    if (!servicePackage) {
      return NextResponse.json(
        createErrorResponse('Invalid service package'),
        { status: 400 }
      )
    }
    
    // Calculate total price based on vehicle type
    const totalPrice = bookingData.vehicleType === 'large' 
      ? servicePackage.premiumPrice 
      : servicePackage.basePrice
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: generateId(),
      customerId: generateId(), // In real app, this would come from auth
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      servicePackageId: bookingData.servicePackageId,
      servicePackageName: servicePackage.name,
      vehicleType: bookingData.vehicleType,
      appointmentDate: bookingData.appointmentDate,
      appointmentTime: bookingData.appointmentTime,
      address: bookingData.address,
      totalPrice,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentMethod === 'online' ? 'pending' : 'pending',
      status: 'pending',
      notes: bookingData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Save to localStorage
    const appointments: Appointment[] = getFromStorage(APPOINTMENTS_KEY, [])
    appointments.push(newAppointment)
    saveToStorage(APPOINTMENTS_KEY, appointments)
    
    // Mock notification (in real app, would send email/SMS)
    console.log(`📧 Mock Email sent to ${bookingData.customerEmail}: Appointment confirmed for ${bookingData.appointmentDate} at ${bookingData.appointmentTime}`)
    
    return NextResponse.json(
      createSuccessResponse(newAppointment, 'Appointment created successfully'),
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      createErrorResponse('Failed to create appointment'),
      { status: 500 }
    )
  }
}

// PUT /api/appointments - Update appointment
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')
    
    if (!appointmentId) {
      return NextResponse.json(
        createErrorResponse('Appointment ID is required'),
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    
    // Get appointments from localStorage
    const appointments: Appointment[] = getFromStorage(APPOINTMENTS_KEY, [])
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        createErrorResponse('Appointment not found'),
        { status: 404 }
      )
    }
    
    // Update appointment
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...updateData,
      updatedAt: new Date()
    }
    
    saveToStorage(APPOINTMENTS_KEY, appointments)
    
    return NextResponse.json(
      createSuccessResponse(appointments[appointmentIndex], 'Appointment updated successfully')
    )
    
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      createErrorResponse('Failed to update appointment'),
      { status: 500 }
    )
  }
}
