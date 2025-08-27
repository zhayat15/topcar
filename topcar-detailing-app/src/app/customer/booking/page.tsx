'use client'

import { useSearchParams } from 'next/navigation'
import { BookingForm } from '@/components/ui/BookingForm'
import { SERVICE_PACKAGES } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react'

function BookingContent() {
  const searchParams = useSearchParams()
  const selectedServiceId = searchParams.get('service')
  const vehicleType = searchParams.get('vehicle') as 'standard' | 'large'

  const selectedService = selectedServiceId 
    ? SERVICE_PACKAGES.find(pkg => pkg.id === selectedServiceId)
    : null

  const handleBookingSuccess = (appointmentId: string) => {
    console.log('Booking successful:', appointmentId)
    // In a real app, you might redirect to a confirmation page
    // router.push(`/customer/confirmation/${appointmentId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/customer" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                Top Car Detailing
              </Link>
              <p className="text-gray-600 mt-1">Book Your Appointment</p>
            </div>
            <div className="flex gap-4">
              <Link href="/customer/login">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Login</button>
              </Link>
              <Link href="/customer/signup">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/customer" className="hover:text-gray-700">
                Services
              </Link>
            </li>
            <li>→</li>
            <li className="text-gray-900 font-medium">Book Appointment</li>
          </ol>
        </nav>

        {/* Selected Service Info */}
        {selectedService && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Selected Service</CardTitle>
              <CardDescription className="text-blue-700">
                You have pre-selected the following service package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{selectedService.name}</h3>
                  <p className="text-blue-700 mt-1">{selectedService.description}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    Duration: {Math.floor(selectedService.duration / 60)}h {selectedService.duration % 60}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">
                    ${vehicleType === 'large' ? selectedService.premiumPrice : selectedService.basePrice}
                  </p>
                  <p className="text-sm text-blue-600">
                    {vehicleType === 'large' ? 'Large Vehicle' : 'Standard Vehicle'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Form */}
        <BookingForm 
          selectedServiceId={selectedServiceId || undefined}
          onSuccess={handleBookingSuccess}
        />

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Contact us if you have any questions about our services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-900">Phone</div>
                <div className="text-gray-600">1300 TOP CAR</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Email</div>
                <div className="text-gray-600">info@topcardetailing.com</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Hours</div>
                <div className="text-gray-600">Mon-Sat 8AM-6PM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Services */}
        <div className="mt-8 text-center">
          <Link 
            href="/customer" 
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            ← Back to Service Packages
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking form...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
