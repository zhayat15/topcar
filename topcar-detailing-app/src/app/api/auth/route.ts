import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, generateId } from '@/lib/utils-extended'

// POST /api/auth - Handle login and signup
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const data = await request.json()
    
    if (action === 'login') {
      // Mock login - accept any email/password combination
      if (!data.email || !data.password) {
        return NextResponse.json(
          createErrorResponse('Email and password are required'),
          { status: 400 }
        )
      }
      
      const mockUser = {
        id: generateId(),
        name: 'Mock User',
        email: data.email,
        role: data.email.includes('admin') ? 'admin' : data.email.includes('worker') ? 'worker' : 'customer'
      }
      
      console.log(`🔐 Mock Login: ${data.email} (${mockUser.role})`)
      
      return NextResponse.json(
        createSuccessResponse({
          user: mockUser,
          token: generateId()
        }, 'Login successful')
      )
    }
    
    if (action === 'signup') {
      // Mock signup
      if (!data.name || !data.email || !data.password) {
        return NextResponse.json(
          createErrorResponse('All fields are required'),
          { status: 400 }
        )
      }
      
      const newUser = {
        id: generateId(),
        name: data.name,
        email: data.email,
        role: 'customer'
      }
      
      console.log(`👤 New user registered: ${data.email}`)
      
      return NextResponse.json(
        createSuccessResponse({
          user: newUser,
          token: generateId()
        }, 'Account created successfully'),
        { status: 201 }
      )
    }
    
    return NextResponse.json(
      createErrorResponse('Invalid action'),
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error in auth API:', error)
    return NextResponse.json(
      createErrorResponse('Authentication failed'),
      { status: 500 }
    )
  }
}
