'use client'

import { useState } from 'react'
import { ExpenseFormData } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils-extended'

interface ExpenseFormProps {
  workerId: string
  workerName: string
  appointmentId?: string
  onExpenseAdded?: (expense: any) => void
}

interface SavedExpense {
  id: string
  type: 'fuel' | 'receipt' | 'payment' | 'other'
  amount: number
  description: string
  appointmentId?: string
  receiptImage?: string
  date: Date
  createdAt: Date
}

export function ExpenseForm({ workerId, workerName, appointmentId, onExpenseAdded }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    type: 'fuel',
    amount: 0,
    description: '',
    appointmentId: appointmentId || '',
    receiptImage: undefined
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [recentExpenses, setRecentExpenses] = useState<SavedExpense[]>([])

  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setMessage(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/pdf']
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Invalid file type. Please upload JPEG, PNG, or PDF files.' })
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: 'File too large. Maximum size is 5MB.' })
        return
      }

      setFormData(prev => ({
        ...prev,
        receiptImage: file
      }))
      setMessage({ type: 'success', text: 'Receipt image attached successfully' })
    }
  }

  const validateForm = (): boolean => {
    if (!formData.type) {
      setMessage({ type: 'error', text: 'Please select an expense type' })
      return false
    }

    if (formData.amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return false
    }

    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: 'Please provide a description' })
      return false
    }

    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    setMessage(null)

    try {
      // Create FormData for API submission
      const submitData = new FormData()
      submitData.append('workerId', workerId)
      submitData.append('workerName', workerName)
      submitData.append('type', formData.type)
      submitData.append('amount', formData.amount.toString())
      submitData.append('description', formData.description)
      
      if (formData.appointmentId) {
        submitData.append('appointmentId', formData.appointmentId)
      }
      
      if (formData.receiptImage) {
        submitData.append('receiptImage', formData.receiptImage)
      }

      // Submit to API
      const response = await fetch('/api/expenses', {
        method: 'POST',
        body: submitData
      })

      const result = await response.json()

      if (result.success) {
        const newExpense: SavedExpense = {
          id: result.data.id,
          type: formData.type,
          amount: formData.amount,
          description: formData.description,
          appointmentId: formData.appointmentId || undefined,
          receiptImage: formData.receiptImage ? 'uploaded' : undefined,
          date: new Date(),
          createdAt: new Date()
        }

        setRecentExpenses(prev => [newExpense, ...prev.slice(0, 4)]) // Keep last 5 expenses
        setMessage({ type: 'success', text: 'Expense recorded successfully!' })
        
        // Reset form
        setFormData({
          type: 'fuel',
          amount: 0,
          description: '',
          appointmentId: appointmentId || '',
          receiptImage: undefined
        })

        // Clear file input
        const fileInput = document.getElementById('receipt-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''

        if (onExpenseAdded) {
          onExpenseAdded(newExpense)
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to record expense' })
      }
    } catch (error) {
      console.error('Expense submission error:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const getExpenseTypeLabel = (type: string) => {
    switch (type) {
      case 'fuel': return '⛽ Fuel'
      case 'receipt': return '🧾 Receipt'
      case 'payment': return '💳 Payment'
      case 'other': return '📝 Other'
      default: return type
    }
  }

  const getExpenseTypeColor = (type: string) => {
    switch (type) {
      case 'fuel': return 'bg-blue-100 text-blue-800'
      case 'receipt': return 'bg-green-100 text-green-800'
      case 'payment': return 'bg-purple-100 text-purple-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record Expense</CardTitle>
          <CardDescription>
            Track your work-related expenses for reimbursement
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status Message */}
            {message && (
              <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Expense Type */}
            <div className="space-y-2">
              <Label htmlFor="expense-type">Expense Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expense type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fuel">⛽ Fuel</SelectItem>
                  <SelectItem value="receipt">🧾 Receipt/Materials</SelectItem>
                  <SelectItem value="payment">💳 Payment/Fee</SelectItem>
                  <SelectItem value="other">📝 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the expense (e.g., 'Fuel for job travel', 'Car wash supplies')"
                rows={3}
                required
              />
            </div>

            {/* Appointment ID (optional) */}
            <div className="space-y-2">
              <Label htmlFor="appointment-id">Related Job ID (Optional)</Label>
              <Input
                id="appointment-id"
                value={formData.appointmentId || ''}
                onChange={(e) => handleInputChange('appointmentId', e.target.value)}
                placeholder="Enter job ID if expense is job-related"
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt-upload">Receipt Image (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Input
                    id="receipt-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                  >
                    📎 Attach Receipt
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload receipt image or PDF (max 5MB)
                  </p>
                  {formData.receiptImage && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.receiptImage.name} attached
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Recording Expense...' : 'Record Expense'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your recently recorded expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getExpenseTypeColor(expense.type)}>
                        {getExpenseTypeLabel(expense.type)}
                      </Badge>
                      <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{expense.description}</p>
                    {expense.appointmentId && (
                      <p className="text-xs text-gray-500">Job: {expense.appointmentId.slice(0, 8)}...</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {expense.date.toLocaleDateString()}
                    </p>
                    {expense.receiptImage && (
                      <p className="text-xs text-green-600">📎 Receipt</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900">Reimbursable Expenses:</h4>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Fuel costs for job-related travel</li>
                <li>Car wash supplies and materials</li>
                <li>Parking fees at job locations</li>
                <li>Equipment maintenance and repairs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Keep all receipts for expenses over $10</li>
                <li>Provide clear descriptions for all expenses</li>
                <li>Submit expenses within 30 days</li>
                <li>Link expenses to specific jobs when applicable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
