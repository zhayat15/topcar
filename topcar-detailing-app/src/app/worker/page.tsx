'use client'

import { useState, useEffect } from 'react'
import { Appointment } from '@/types'
import { JobDetails } from '@/components/ui/JobDetails'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function WorkerDashboard() {
  const [jobs, setJobs] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Appointment | null>(null)
  const [workerStats, setWorkerStats] = useState({
    assignedJobs: 0,
    completedToday: 0,
    totalEarnings: 0,
    efficiency: 0
  })

  // Mock worker data
  const mockWorker = {
    id: 'worker1',
    name: 'John Smith',
    email: 'john@topcardetailing.com',
    phone: '0412 345 001'
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock job data
      const mockJobs: Appointment[] = [
        {
          id: 'job1',
          customerId: 'cust1',
          customerName: 'Alice Johnson',
          customerEmail: 'alice@example.com',
          customerPhone: '0412 555 001',
          servicePackageId: 'full-detail',
          servicePackageName: 'Full Detail',
          vehicleType: 'standard',
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: '10:00',
          address: '123 Main Street, Sydney NSW 2000',
          totalPrice: 199,
          paymentMethod: 'online',
          paymentStatus: 'paid',
          status: 'assigned',
          assignedWorkerId: mockWorker.id,
          assignedWorkerName: mockWorker.name,
          notes: 'Please call before arrival. Dog on property.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'job2',
          customerId: 'cust2',
          customerName: 'Bob Wilson',
          customerEmail: 'bob@example.com',
          customerPhone: '0412 555 002',
          servicePackageId: 'basic-detail',
          servicePackageName: 'Basic Detail',
          vehicleType: 'large',
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: '14:00',
          address: '456 Oak Avenue, Parramatta NSW 2150',
          totalPrice: 100,
          paymentMethod: 'in-person',
          paymentStatus: 'pending',
          status: 'in-progress',
          assignedWorkerId: mockWorker.id,
          assignedWorkerName: mockWorker.name,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'job3',
          customerId: 'cust3',
          customerName: 'Carol Davis',
          customerEmail: 'carol@example.com',
          customerPhone: '0412 555 003',
          servicePackageId: 'interior-detail',
          servicePackageName: 'Interior Detail',
          vehicleType: 'standard',
          appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          appointmentTime: '09:00',
          address: '789 Pine Road, Bondi NSW 2026',
          totalPrice: 129,
          paymentMethod: 'online',
          paymentStatus: 'paid',
          status: 'confirmed',
          assignedWorkerId: mockWorker.id,
          assignedWorkerName: mockWorker.name,
          notes: 'Heavy pet hair - additional charge may apply.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      setJobs(mockJobs)
      
      // Calculate stats
      const assigned = mockJobs.filter(job => job.status === 'assigned' || job.status === 'confirmed').length
      const completed = mockJobs.filter(job => job.status === 'completed').length
      const totalEarnings = mockJobs
        .filter(job => job.status === 'completed')
        .reduce((sum, job) => sum + job.totalPrice, 0)
      
      setWorkerStats({
        assignedJobs: assigned,
        completedToday: completed,
        totalEarnings,
        efficiency: completed > 0 ? Math.round((completed / (completed + assigned)) * 100) : 0
      })
      
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobAction = async (jobId: string, action: 'accept' | 'reject' | 'complete') => {
    try {
      // Update job status locally
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          let newStatus = job.status
          switch (action) {
            case 'accept':
              newStatus = 'in-progress'
              break
            case 'reject':
              newStatus = 'pending'
              break
            case 'complete':
              newStatus = 'completed'
              break
          }
          return { ...job, status: newStatus, updatedAt: new Date() }
        }
        return job
      }))
      
      // Refresh stats
      setTimeout(() => {
        fetchJobs()
      }, 1000)
      
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-purple-100 text-purple-800'
      case 'in-progress':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const todayJobs = jobs.filter(job => job.appointmentDate === new Date().toISOString().split('T')[0])
  const upcomingJobs = jobs.filter(job => job.appointmentDate > new Date().toISOString().split('T')[0])
  const activeJobs = jobs.filter(job => job.status === 'in-progress')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mockWorker.name}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline">Admin Portal</Button>
            </Link>
            <Link href="/customer">
              <Button variant="outline">Customer Portal</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Assigned Jobs</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{workerStats.assignedJobs}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Today</CardDescription>
              <CardTitle className="text-2xl text-green-600">{workerStats.completedToday}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's Earnings</CardDescription>
              <CardTitle className="text-2xl text-purple-600">${workerStats.totalEarnings}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Efficiency Rate</CardDescription>
              <CardTitle className="text-2xl text-orange-600">{workerStats.efficiency}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Job Management */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today's Jobs ({todayJobs.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingJobs.length})</TabsTrigger>
            <TabsTrigger value="active">Active Jobs ({activeJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayJobs.length > 0 ? (
              todayJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.servicePackageName}</h3>
                      <p className="text-gray-600">{job.customerName} • {job.appointmentTime}</p>
                      <p className="text-gray-600">{job.address}</p>
                    </div>
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                      variant="outline"
                    >
                      View Details
                    </Button>
                    
                    {job.status === 'assigned' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept Job
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job.id, 'reject')}
                          variant="outline"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {job.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleJobAction(job.id, 'complete')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No jobs scheduled for today</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingJobs.length > 0 ? (
              upcomingJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.servicePackageName}</h3>
                      <p className="text-gray-600">{job.customerName} • {job.appointmentDate} at {job.appointmentTime}</p>
                      <p className="text-gray-600">{job.address}</p>
                    </div>
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No upcoming jobs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <JobDetails
                  key={job.id}
                  job={job}
                  onComplete={(jobId) => handleJobAction(jobId, 'complete')}
                />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No active jobs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Job Details</h2>
                <Button
                  onClick={() => setSelectedJob(null)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
              <div className="p-4">
                <JobDetails
                  job={selectedJob}
                  onAccept={(jobId) => {
                    handleJobAction(jobId, 'accept')
                    setSelectedJob(null)
                  }}
                  onReject={(jobId) => {
                    handleJobAction(jobId, 'reject')
                    setSelectedJob(null)
                  }}
                  onComplete={(jobId) => {
                    handleJobAction(jobId, 'complete')
                    setSelectedJob(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
