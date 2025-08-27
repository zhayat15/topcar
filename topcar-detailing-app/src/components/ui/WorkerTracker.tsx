'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface MockWorker {
  id: string
  name: string
  email: string
  phone: string
  isAvailable: boolean
  currentLocation?: {
    latitude: number
    longitude: number
    timestamp: Date
    address: string
  }
  assignedJobs: number
  completedToday: number
  status: 'active' | 'offline' | 'busy'
}

export function WorkerTracker() {
  const [workers, setWorkers] = useState<MockWorker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateMockWorkers = (): MockWorker[] => {
    return [
      {
        id: 'worker1',
        name: 'John Smith',
        email: 'john@topcardetailing.com',
        phone: '0412 345 001',
        isAvailable: true,
        currentLocation: {
          latitude: -33.8688,
          longitude: 151.2093,
          timestamp: new Date(),
          address: 'Sydney CBD, NSW'
        },
        assignedJobs: 3,
        completedToday: 2,
        status: 'active'
      },
      {
        id: 'worker2',
        name: 'Sarah Johnson',
        email: 'sarah@topcardetailing.com',
        phone: '0412 345 002',
        isAvailable: false,
        currentLocation: {
          latitude: -33.7488,
          longitude: 151.1397,
          timestamp: new Date(),
          address: 'Parramatta, NSW'
        },
        assignedJobs: 2,
        completedToday: 1,
        status: 'busy'
      },
      {
        id: 'worker3',
        name: 'Mike Wilson',
        email: 'mike@topcardetailing.com',
        phone: '0412 345 003',
        isAvailable: true,
        currentLocation: {
          latitude: -33.9173,
          longitude: 151.2313,
          timestamp: new Date(),
          address: 'Botany, NSW'
        },
        assignedJobs: 1,
        completedToday: 3,
        status: 'active'
      },
      {
        id: 'worker4',
        name: 'Emma Davis',
        email: 'emma@topcardetailing.com',
        phone: '0412 345 004',
        isAvailable: false,
        assignedJobs: 0,
        completedToday: 0,
        status: 'offline'
      }
    ]
  }

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockWorkers = generateMockWorkers()
      setWorkers(mockWorkers)
      setError(null)
    } catch (err) {
      setError('Failed to fetch worker data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkers()
    
    const interval = setInterval(() => {
      setWorkers(prev => prev.map(worker => {
        if (worker.currentLocation && worker.status === 'active') {
          return {
            ...worker,
            currentLocation: {
              ...worker.currentLocation,
              timestamp: new Date()
            }
          }
        }
        return worker
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-orange-100 text-orange-800'
      case 'offline':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLocationAge = (timestamp: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ago`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading worker data...</span>
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Worker Tracking</CardTitle>
            <CardDescription>
              Monitor worker locations and job assignments in real-time
            </CardDescription>
          </div>
          <Button onClick={fetchWorkers} variant="outline">
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{worker.name}</h4>
                  <p className="text-gray-600 text-sm">{worker.email}</p>
                  <p className="text-gray-600 text-sm">{worker.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(worker.status)}>
                    {worker.status}
                  </Badge>
                  <Badge variant={worker.isAvailable ? 'default' : 'secondary'}>
                    {worker.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Assigned Jobs</p>
                  <p className="text-lg font-semibold text-blue-600">{worker.assignedJobs}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed Today</p>
                  <p className="text-lg font-semibold text-green-600">{worker.completedToday}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Efficiency</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {worker.completedToday > 0 ? Math.round((worker.completedToday / (worker.completedToday + worker.assignedJobs)) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <p className="text-sm text-gray-600 capitalize">{worker.status}</p>
                </div>
              </div>

              {worker.currentLocation && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Current Location</p>
                      <p className="text-gray-600">{worker.currentLocation.address}</p>
                      <p className="text-xs text-gray-500">
                        Last updated: {getLocationAge(worker.currentLocation.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        📍 View on Map
                      </Button>
                      <Button size="sm" variant="outline">
                        📞 Call Worker
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!worker.currentLocation && worker.status === 'offline' && (
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className="text-gray-600">Worker is offline - location unavailable</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No workers found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
