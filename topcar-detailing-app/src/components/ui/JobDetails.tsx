'use client'

import { useState } from 'react'
import { Appointment } from '@/types'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface JobDetailsProps {
  job: Appointment
  onAccept?: (jobId: string) => void
  onReject?: (jobId: string) => void
  onComplete?: (jobId: string) => void
}

export function JobDetails({ job, onAccept, onReject, onComplete }: JobDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAction = async (action: 'accept' | 'reject' | 'complete') => {
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      switch (action) {
        case 'accept':
          if (onAccept) onAccept(job.id)
          break
        case 'reject':
          if (onReject) onReject(job.id)
          break
        case 'complete':
          if (onComplete) onComplete(job.id)
          break
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'assigned': return 'bg-purple-100 text-purple-800'
      case 'in-progress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.servicePackageName}</CardTitle>
            <CardDescription>Job ID: {job.id.slice(0, 8)}...</CardDescription>
          </div>
          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Customer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Name</p>
              <p className="text-gray-600">{job.customerName}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Email</p>
              <p className="text-gray-600">{job.customerEmail}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Phone</p>
              <p className="text-gray-600">{job.customerPhone}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Vehicle Type</p>
              <p className="text-gray-600">
                {job.vehicleType === 'large' ? 'Large SUV/4WD/7 Seater' : 'Hatch/Sedan'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Job Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Date</p>
              <p className="text-gray-600">{formatDate(job.appointmentDate)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Time</p>
              <p className="text-gray-600">{formatTime(job.appointmentTime)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Service Value</p>
              <p className="text-gray-600 font-semibold">{formatCurrency(job.totalPrice)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Payment Method</p>
              <p className="text-gray-600 capitalize">{job.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Service Location</h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{job.address}</p>
          </div>
        </div>

        {job.notes && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Special Instructions</h4>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800">{job.notes}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          {job.status === 'assigned' && (
            <>
              <Button
                onClick={() => handleAction('accept')}
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? 'Processing...' : 'Accept Job'}
              </Button>
              <Button
                onClick={() => handleAction('reject')}
                disabled={isUpdating}
                variant="outline"
                className="flex-1"
              >
                {isUpdating ? 'Processing...' : 'Reject Job'}
              </Button>
            </>
          )}
          
          {job.status === 'in-progress' && (
            <Button
              onClick={() => handleAction('complete')}
              disabled={isUpdating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Processing...' : 'Mark Complete'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
