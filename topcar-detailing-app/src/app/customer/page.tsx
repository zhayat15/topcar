'use client'

import { useState } from 'react'
import { SERVICE_PACKAGES } from '@/types'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function CustomerPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [vehicleType, setVehicleType] = useState<'standard' | 'large'>('standard')

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Top Car Detailing</h1>
              <p className="text-gray-600 mt-1">Professional car detailing services</p>
            </div>
            <div className="flex gap-4">
              <Link href="/customer/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/customer/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Car Detailing Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your vehicle with our professional detailing services. 
            From basic cleaning to premium paint protection, we deliver exceptional results.
          </p>
        </div>

        {/* Vehicle Type Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Your Vehicle Type</CardTitle>
            <CardDescription>
              Pricing varies based on vehicle size. Select your vehicle type to see accurate pricing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Label htmlFor="vehicleType">Vehicle Type:</Label>
              <Select
                value={vehicleType}
                onValueChange={(value: 'standard' | 'large') => setVehicleType(value)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Hatch/Sedan</SelectItem>
                  <SelectItem value="large">Large SUV/4WD/7 Seater</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Service Packages */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Service Packages
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_PACKAGES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                vehicleType={vehicleType}
                onSelect={handleServiceSelect}
                isSelected={selectedServiceId === service.id}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {selectedServiceId ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg inline-block">
                <p className="text-blue-800 font-medium">
                  Selected: {SERVICE_PACKAGES.find(s => s.id === selectedServiceId)?.name}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link href={`/customer/booking?service=${selectedServiceId}&vehicle=${vehicleType}`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Book This Service
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setSelectedServiceId('')}
                >
                  Choose Different Service
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Select a service package above to get started</p>
              <Link href="/customer/booking">
                <Button size="lg" variant="outline">
                  Book Without Selecting
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
