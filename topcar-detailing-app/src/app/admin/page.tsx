'use client'

import { AppointmentList } from '@/components/ui/AppointmentList'
import { SalesSummary } from '@/components/ui/SalesSummary'
import { WorkerTracker } from '@/components/ui/WorkerTracker'
import { PriceCardManager } from '@/components/ui/PriceCardManager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Top Car Detailing Management</p>
            </div>
            <div className="flex gap-4">
              <Link href="/customer">
                <Button variant="outline">View Customer Site</Button>
              </Link>
              <Link href="/worker">
                <Button variant="outline">Worker Portal</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="pricing">Price Cards</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <SalesSummary />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    📅 View Today's Appointments
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    👥 Assign Workers to Jobs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    💰 Process Pending Payments
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    📊 Generate Daily Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Status</span>
                    <span className="text-green-600 text-sm">✅ Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payment Gateway</span>
                    <span className="text-green-600 text-sm">✅ Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Worker Tracking</span>
                    <span className="text-green-600 text-sm">✅ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Notifications</span>
                    <span className="text-green-600 text-sm">✅ Enabled</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <AppointmentList />
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers">
            <WorkerTracker />
          </TabsContent>

          {/* Price Cards Tab */}
          <TabsContent value="pricing">
            <PriceCardManager />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Generate and view business reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-1">📈</span>
                    <span>Sales Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-1">👥</span>
                    <span>Worker Performance</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-1">📊</span>
                    <span>Service Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-lg mb-1">💰</span>
                    <span>Financial Summary</span>
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Export Options</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Export CSV</Button>
                    <Button size="sm" variant="outline">Export PDF</Button>
                    <Button size="sm" variant="outline">Email Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
