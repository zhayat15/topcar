import { NextRequest, NextResponse } from 'next/server'
import { Expense, ExpenseFormData } from '@/types'
import { createSuccessResponse, createErrorResponse, generateId, getFromStorage, saveToStorage } from '@/lib/utils-extended'

const EXPENSES_KEY = 'expenses'

// GET /api/expenses - Fetch expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workerId = searchParams.get('workerId')
    const appointmentId = searchParams.get('appointmentId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Get expenses from localStorage (mock database)
    let expenses: Expense[] = getFromStorage(EXPENSES_KEY, [])
    
    // Generate mock data if none exists
    if (expenses.length === 0) {
      expenses = generateMockExpenses()
      saveToStorage(EXPENSES_KEY, expenses)
    }
    
    // Filter expenses based on query parameters
    if (workerId) {
      expenses = expenses.filter(expense => expense.workerId === workerId)
    }
    
    if (appointmentId) {
      expenses = expenses.filter(expense => expense.appointmentId === appointmentId)
    }
    
    if (type) {
      expenses = expenses.filter(expense => expense.type === type)
    }
    
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      expenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= start && expenseDate <= end
      })
    }
    
    return NextResponse.json(createSuccessResponse(expenses))
    
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      createErrorResponse('Failed to fetch expenses'),
      { status: 500 }
    )
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const expenseData: ExpenseFormData & { workerId: string; workerName: string } = await request.json()
    
    // Validate required fields
    if (!expenseData.type || !expenseData.amount || !expenseData.description || !expenseData.workerId) {
      return NextResponse.json(
        createErrorResponse('Missing required fields'),
        { status: 400 }
      )
    }
    
    // Validate amount
    if (expenseData.amount <= 0) {
      return NextResponse.json(
        createErrorResponse('Amount must be greater than 0'),
        { status: 400 }
      )
    }
    
    // Create new expense
    const newExpense: Expense = {
      id: generateId(),
      workerId: expenseData.workerId,
      workerName: expenseData.workerName || 'Unknown Worker',
      appointmentId: expenseData.appointmentId,
      type: expenseData.type,
      amount: expenseData.amount,
      description: expenseData.description,
      receiptImage: expenseData.receiptImage ? `receipt_${generateId()}.jpg` : undefined,
      date: new Date(),
      createdAt: new Date()
    }
    
    // Save to localStorage
    const expenses: Expense[] = getFromStorage(EXPENSES_KEY, [])
    expenses.push(newExpense)
    saveToStorage(EXPENSES_KEY, expenses)
    
    // Mock logging
    console.log(`💰 New expense recorded: ${expenseData.type} - $${expenseData.amount}`)
    console.log(`💰 Worker: ${expenseData.workerName} | Description: ${expenseData.description}`)
    
    return NextResponse.json(
      createSuccessResponse(newExpense, 'Expense recorded successfully'),
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      createErrorResponse('Failed to record expense'),
      { status: 500 }
    )
  }
}

// PUT /api/expenses - Update expense
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const expenseId = searchParams.get('id')
    
    if (!expenseId) {
      return NextResponse.json(
        createErrorResponse('Expense ID is required'),
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    
    // Get expenses from localStorage
    const expenses: Expense[] = getFromStorage(EXPENSES_KEY, [])
    const expenseIndex = expenses.findIndex(expense => expense.id === expenseId)
    
    if (expenseIndex === -1) {
      return NextResponse.json(
        createErrorResponse('Expense not found'),
        { status: 404 }
      )
    }
    
    // Update expense
    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      ...updateData,
      updatedAt: new Date()
    }
    
    saveToStorage(EXPENSES_KEY, expenses)
    
    return NextResponse.json(
      createSuccessResponse(expenses[expenseIndex], 'Expense updated successfully')
    )
    
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      createErrorResponse('Failed to update expense'),
      { status: 500 }
    )
  }
}

// DELETE /api/expenses - Delete expense
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const expenseId = searchParams.get('id')
    
    if (!expenseId) {
      return NextResponse.json(
        createErrorResponse('Expense ID is required'),
        { status: 400 }
      )
    }
    
    // Get expenses from localStorage
    const expenses: Expense[] = getFromStorage(EXPENSES_KEY, [])
    const expenseIndex = expenses.findIndex(expense => expense.id === expenseId)
    
    if (expenseIndex === -1) {
      return NextResponse.json(
        createErrorResponse('Expense not found'),
        { status: 404 }
      )
    }
    
    // Remove expense
    const deletedExpense = expenses.splice(expenseIndex, 1)[0]
    saveToStorage(EXPENSES_KEY, expenses)
    
    console.log(`🗑️ Expense deleted: ${deletedExpense.type} - $${deletedExpense.amount}`)
    
    return NextResponse.json(
      createSuccessResponse(null, 'Expense deleted successfully')
    )
    
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      createErrorResponse('Failed to delete expense'),
      { status: 500 }
    )
  }
}

// Helper function to generate mock expenses
function generateMockExpenses(): Expense[] {
  const expenses: Expense[] = []
  const types: ('fuel' | 'receipt' | 'payment' | 'other')[] = ['fuel', 'receipt', 'payment', 'other']
  const workers = [
    { id: 'worker1', name: 'John Smith' },
    { id: 'worker2', name: 'Sarah Johnson' },
    { id: 'worker3', name: 'Mike Wilson' }
  ]
  
  for (let i = 0; i < 15; i++) {
    const worker = workers[Math.floor(Math.random() * workers.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    expenses.push({
      id: generateId(),
      workerId: worker.id,
      workerName: worker.name,
      appointmentId: Math.random() > 0.3 ? generateId() : undefined,
      type,
      amount: Math.floor(Math.random() * 100) + 10,
      description: getExpenseDescription(type),
      receiptImage: Math.random() > 0.5 ? `receipt_${generateId()}.jpg` : undefined,
      date,
      createdAt: date
    })
  }
  
  return expenses
}

function getExpenseDescription(type: string): string {
  const descriptions = {
    fuel: 'Fuel for service vehicle',
    receipt: 'Equipment and supplies',
    payment: 'Customer payment processing',
    other: 'Miscellaneous expense'
  }
  return descriptions[type as keyof typeof descriptions] || 'General expense'
}
