import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, generateId } from '@/lib/utils-extended'

interface PaymentRequest {
  appointmentId: string
  amount: number
  paymentMethod: 'online' | 'in-person'
  customerEmail: string
}

interface PaymentResponse {
  paymentId: string
  status: 'success' | 'failed' | 'pending'
  transactionId: string
  amount: number
  message: string
}

// POST /api/payments - Process payment (mock)
export async function POST(request: NextRequest) {
  try {
    const paymentData: PaymentRequest = await request.json()
    
    // Validate required fields
    if (!paymentData.appointmentId || !paymentData.amount || !paymentData.paymentMethod) {
      return NextResponse.json(
        createErrorResponse('Missing required payment fields'),
        { status: 400 }
      )
    }
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock payment processing logic
    const isSuccessful = Math.random() > 0.1 // 90% success rate
    
    const paymentResponse: PaymentResponse = {
      paymentId: generateId(),
      status: isSuccessful ? 'success' : 'failed',
      transactionId: `TXN_${generateId().toUpperCase()}`,
      amount: paymentData.amount,
      message: isSuccessful 
        ? 'Payment processed successfully' 
        : 'Payment failed - please try again'
    }
    
    // Mock payment gateway response
    if (paymentData.paymentMethod === 'online') {
      console.log(`💳 Mock Payment Gateway: Processing $${paymentData.amount} for appointment ${paymentData.appointmentId}`)
      console.log(`💳 Transaction ID: ${paymentResponse.transactionId}`)
      console.log(`💳 Status: ${paymentResponse.status}`)
    } else {
      console.log(`💰 In-person payment recorded: $${paymentData.amount} for appointment ${paymentData.appointmentId}`)
    }
    
    // Mock email notification
    console.log(`📧 Mock Email sent to ${paymentData.customerEmail}: Payment ${paymentResponse.status} - ${paymentResponse.message}`)
    
    if (isSuccessful) {
      return NextResponse.json(
        createSuccessResponse(paymentResponse, 'Payment processed successfully')
      )
    } else {
      return NextResponse.json(
        createErrorResponse('Payment failed', paymentResponse.message),
        { status: 402 }
      )
    }
    
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      createErrorResponse('Payment processing failed'),
      { status: 500 }
    )
  }
}

// GET /api/payments - Get payment history (mock)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointmentId')
    const customerId = searchParams.get('customerId')
    
    // Mock payment history data
    const mockPayments = [
      {
        paymentId: generateId(),
        appointmentId: appointmentId || generateId(),
        customerId: customerId || generateId(),
        amount: 129,
        status: 'success',
        transactionId: 'TXN_MOCK123',
        paymentMethod: 'online',
        processedAt: new Date(),
        createdAt: new Date()
      }
    ]
    
    return NextResponse.json(
      createSuccessResponse(mockPayments, 'Payment history retrieved')
    )
    
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json(
      createErrorResponse('Failed to fetch payment history'),
      { status: 500 }
    )
  }
}
