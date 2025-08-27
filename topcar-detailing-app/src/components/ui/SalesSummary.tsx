'use client'

import { useState, useEffect } from 'react'
import { Appointment } from '@/types'
import { formatCurrency, handleApiCall } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SalesData {
  todayRevenue: number
  todayAppointments: number
  weekRevenue: number
  weekAppointments: number
  monthRevenue: number
  monthAppointments: number
  pendingPayments: number
  completedJobs: number
}

export function SalesSummary() {
  const [salesData, setSalesData] = useState<SalesData>({
    todayRevenue: 0,
    todayAppointments: 0,
    weekRevenue: 0,
    weekAppointments: 0,
    monthRevenue: 0,
    monthAppointments: 0,
    pendingPayments: 0,
    completedJobs: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateSalesData = (appointments: Appointment[]): SalesData => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    
    const monthAgo = new Date(today)
    monthAgo.setMonth(today.getMonth() - 1)

    let todayRevenue = 0
    let todayAppointments = 0
    let weekRevenue = 0
    let weekAppointments = 0
    let monthRevenue = 0
    let monthAppointments = 0
    let pendingPayments = 0
    let completedJobs = 0

    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate)
      
      // Today's data
      if (appointment.appointmentDate === todayStr) {
        todayAppointments++
        if (appointment.paymentStatus === 'paid') {
          todayRevenue += appointment.totalPrice
        }
      }
      
      // Week's data
      if (appointmentDate >= weekAgo) {
        weekAppointments++
        if (appointment.paymentStatus === 'paid') {
          weekRevenue += appointment.totalPrice
        }
      }
      
      // Month's data
      if (appointmentDate >= monthAgo) {
        monthAppointments++
        if (appointment.paymentStatus === 'paid') {
          monthRevenue += appointment.totalPrice
        }
      }
      
      // Pending payments
      if (appointment.paymentStatus === 'pending') {
        pendingPayments += appointment.totalPrice
      }
      
      // Completed jobs
      if (appointment.status === 'completed') {
        completedJobs++
      }
    })

    return {
      todayRevenue,
      todayAppointments,
      weekRevenue,
      weekAppointments,
      monthRevenue,
      monthAppointments,
      pendingPayments,
      completedJobs
    }
  }

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const response = await handleApiCall(() => fetch('/api/appointments'))
      
      if (response.success && response.data) {
        const appointments = Array.isArray(response.data) ? response.data : []
        const calculatedData = calculateSalesData(appointments)
        setSalesData(calculatedData)
        setError(null)
      } else {
        setError(response.error || 'Failed to fetch sales data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading sales data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-500 bg-red-50">
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Revenue and appointment statistics for different time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Today */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(salesData.todayRevenue)}
              </div>
              <div className="text-sm text-blue-700 font-medium">Today's Revenue</div>
              <div className="text-xs text-blue-600 mt-1">
                {salesData.todayAppointments} appointments
              </div>
            </div>

            {/* This Week */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(salesData.weekRevenue)}
              </div>
              <div className="text-sm text-green-700 font-medium">This Week</div>
              <div className="text-xs text-green-600 mt-1">
                {salesData.weekAppointments} appointments
              </div>
            </div>

            {/* This Month */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(salesData.monthRevenue)}
              </div>
              <div className="text-sm text-purple-700 font-medium">This Month</div>
              <div className="text-xs text-purple-600 mt-1">
                {salesData.monthAppointments} appointments
              </div>
            </div>

            {/* Pending Payments */}
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-900">
                {formatCurrency(salesData.pendingPayments)}
              </div>
              <div className="text-sm text-amber-700 font-medium">Pending Payments</div>
              <div className="text-xs text-amber-600 mt-1">
                {salesData.completedJobs} completed jobs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salesData.monthAppointments > 0 
                    ? formatCurrency(salesData.monthRevenue / salesData.monthAppointments)
                    : formatCurrency(0)
                  }
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salesData.monthAppointments > 0 
                    ? Math.round((salesData.completedJobs / salesData.monthAppointments) * 100)
                    : 0
                  }%
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Collection</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(salesData.monthRevenue + salesData.pendingPayments) > 0 
                    ? Math.round((salesData.monthRevenue / (salesData.monthRevenue + salesData.pendingPayments)) * 100)
                    : 0
                  }%
                </p>
              </div>
              <div className="text-3xl">💳</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
