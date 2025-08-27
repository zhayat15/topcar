'use client'

import { useState, useEffect } from 'react'
import { Appointment } from '@/types'
import { formatDate, formatTime, formatCurrency, handleApiCall } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AppointmentListProps {
  onAppointmentUpdate?: () => void
}

export function AppointmentList({ onAppointmentUpdate }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await handleApiCall(() => fetch('/api/appointments'))
      
      if (response.success && response.data) {
        setAppointments(Array.isArray(response.data) ? response.data : [])
        setError(null)
      } else {
        setError(response.error || 'Failed to fetch appointments')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdatingId(appointmentId)
      const response = await handleApiCall(() =>
        fetch(`/api/appointments?id=${appointmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })
      )

      if (response.success) {
        await fetchAppointments()
        if (onAppointmentUpdate) {
          onAppointmentUpdate()
        }
      } else {
        setError(response.error || 'Failed to update appointment')
      }
    } catch (err) {
      setError('Failed to update appointment')
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'assigned':
        return 'bg-purple-100 text-purple-800'
      case 'in-progress':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAppointments = statusFilter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === statusFilter)

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              Manage and track all customer appointments
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAppointments} variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-500 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {statusFilter === 'all' ? 'No appointments found' : `No ${statusFilter} appointments found`}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{appointment.customerName}</h4>
                    <p className="text-gray-600">{appointment.customerEmail}</p>
                    <p className="text-gray-600">{appointment.customerPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
                      {appointment.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Service</p>
                    <p className="text-sm text-gray-600">{appointment.servicePackageName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Vehicle</p>
                    <p className="text-sm text-gray-600">
                      {appointment.vehicleType === 'large' ? 'Large SUV/4WD' : 'Hatch/Sedan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-sm text-gray-600">{formatCurrency(appointment.totalPrice)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{appointment.address}</p>
                </div>

                {appointment.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900">Notes</p>
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                {appointment.assignedWorkerName && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900">Assigned Worker</p>
                    <p className="text-sm text-gray-600">{appointment.assignedWorkerName}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        disabled={updatingId === appointment.id}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        disabled={updatingId === appointment.id}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.id, 'assigned')}
                      disabled={updatingId === appointment.id}
                    >
                      Assign Worker
                    </Button>
                  )}
                  
                  {appointment.status === 'assigned' && (
                    <Button
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                      disabled={updatingId === appointment.id}
                    >
                      Start Job
                    </Button>
                  )}
                  
                  {appointment.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      disabled={updatingId === appointment.id}
                    >
                      Complete
                    </Button>
                  )}

                  {updatingId === appointment.id && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Updating...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
