import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, generateId } from '@/lib/utils-extended'

// POST /api/uploads - Handle file uploads (mock)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const appointmentId = formData.get('appointmentId') as string
    const workerId = formData.get('workerId') as string
    const imageType = formData.get('type') as 'before' | 'after'
    
    if (!file) {
      return NextResponse.json(
        createErrorResponse('No file provided'),
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        createErrorResponse('Invalid file type. Only JPEG, PNG, and WebP are allowed'),
        { status: 400 }
      )
    }
    
    // Mock file processing
    const fileId = generateId()
    const filename = `${imageType}_${appointmentId}_${fileId}.${file.name.split('.').pop()}`
    const mockUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/85e2e9ab-8559-40d9-a556-101696a01e7b.png}+image+for+appointment+${appointmentId}`
    
    const uploadRecord = {
      fileId,
      filename,
      url: mockUrl,
      size: file.size,
      type: file.type,
      uploadedAt: new Date()
    }
    
    console.log(`📸 Image uploaded: ${filename}`)
    console.log(`📸 Type: ${imageType} | Size: ${(file.size / 1024).toFixed(2)}KB`)
    
    return NextResponse.json(
      createSuccessResponse(uploadRecord, 'File uploaded successfully'),
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      createErrorResponse('File upload failed'),
      { status: 500 }
    )
  }
}

// GET /api/uploads - Get uploaded files
export async function GET() {
  try {
    const mockUploads = [
      {
        fileId: generateId(),
        filename: 'before_job1.jpg',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cffb2e86-dac5-47ef-bee2-65feaac8abbd.png',
        size: 245760,
        type: 'image/jpeg',
        uploadedAt: new Date()
      }
    ]
    
    return NextResponse.json(
      createSuccessResponse(mockUploads, 'Uploads retrieved successfully')
    )
    
  } catch (error) {
    console.error('Error fetching uploads:', error)
    return NextResponse.json(
      createErrorResponse('Failed to fetch uploads'),
      { status: 500 }
    )
  }
}
