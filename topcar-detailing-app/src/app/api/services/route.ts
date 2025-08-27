import { NextRequest, NextResponse } from 'next/server'
import { ServicePackage, SERVICE_PACKAGES } from '@/types'
import { createSuccessResponse, createErrorResponse, generateId, getFromStorage, saveToStorage } from '@/lib/utils-extended'

// Mock data storage key
const SERVICES_KEY = 'service_packages'

// GET /api/services - Fetch all service packages
export async function GET() {
  try {
    // Get services from localStorage, fallback to default packages
    let services: ServicePackage[] = getFromStorage(SERVICES_KEY, SERVICE_PACKAGES)
    
    return NextResponse.json(createSuccessResponse(services))
    
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      createErrorResponse('Failed to fetch services'),
      { status: 500 }
    )
  }
}

// POST /api/services - Create new service package
export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json()
    
    // Validate required fields
    if (!serviceData.name || !serviceData.description || !serviceData.basePrice) {
      return NextResponse.json(
        createErrorResponse('Missing required fields'),
        { status: 400 }
      )
    }
    
    // Create new service package
    const newService: ServicePackage = {
      id: generateId(),
      name: serviceData.name,
      description: serviceData.description,
      inclusions: serviceData.inclusions || [],
      basePrice: parseFloat(serviceData.basePrice),
      premiumPrice: parseFloat(serviceData.premiumPrice || serviceData.basePrice * 1.3),
      duration: parseInt(serviceData.duration || 120),
      category: serviceData.category || 'basic'
    }
    
    // Save to localStorage
    const services: ServicePackage[] = getFromStorage(SERVICES_KEY, SERVICE_PACKAGES)
    services.push(newService)
    saveToStorage(SERVICES_KEY, services)
    
    console.log(`✅ New service created: ${newService.name} - $${newService.basePrice}`)
    
    return NextResponse.json(
      createSuccessResponse(newService, 'Service package created successfully'),
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      createErrorResponse('Failed to create service'),
      { status: 500 }
    )
  }
}

// PUT /api/services - Update service package
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('id')
    
    if (!serviceId) {
      return NextResponse.json(
        createErrorResponse('Service ID is required'),
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    
    // Get services from localStorage
    const services: ServicePackage[] = getFromStorage(SERVICES_KEY, SERVICE_PACKAGES)
    const serviceIndex = services.findIndex(service => service.id === serviceId)
    
    if (serviceIndex === -1) {
      return NextResponse.json(
        createErrorResponse('Service not found'),
        { status: 404 }
      )
    }
    
    // Update service
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...updateData,
      basePrice: parseFloat(updateData.basePrice || services[serviceIndex].basePrice),
      premiumPrice: parseFloat(updateData.premiumPrice || services[serviceIndex].premiumPrice),
      duration: parseInt(updateData.duration || services[serviceIndex].duration)
    }
    
    saveToStorage(SERVICES_KEY, services)
    
    console.log(`✅ Service updated: ${services[serviceIndex].name} - $${services[serviceIndex].basePrice}`)
    
    return NextResponse.json(
      createSuccessResponse(services[serviceIndex], 'Service updated successfully')
    )
    
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      createErrorResponse('Failed to update service'),
      { status: 500 }
    )
  }
}

// DELETE /api/services - Delete service package
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('id')
    
    if (!serviceId) {
      return NextResponse.json(
        createErrorResponse('Service ID is required'),
        { status: 400 }
      )
    }
    
    // Get services from localStorage
    const services: ServicePackage[] = getFromStorage(SERVICES_KEY, SERVICE_PACKAGES)
    const serviceIndex = services.findIndex(service => service.id === serviceId)
    
    if (serviceIndex === -1) {
      return NextResponse.json(
        createErrorResponse('Service not found'),
        { status: 404 }
      )
    }
    
    // Remove the service
    const deletedService = services.splice(serviceIndex, 1)[0]
    saveToStorage(SERVICES_KEY, services)
    
    console.log(`🗑️ Service deleted: ${deletedService.name}`)
    
    return NextResponse.json(
      createSuccessResponse(null, 'Service deleted successfully')
    )
    
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      createErrorResponse('Failed to delete service'),
      { status: 500 }
    )
  }
}
