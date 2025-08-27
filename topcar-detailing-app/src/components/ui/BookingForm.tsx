'use client'

import { useState } from 'react'
import { BookingFormData, SERVICE_PACKAGES } from '@/types'
import { validateEmail, validatePhone, validateRequired, handleApiCall } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BookingFormProps {
  selectedServiceId?: string
  onSuccess?: (appointmentId: string) => void
}

export function BookingForm({ selectedServiceId, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    servicePackageId: selectedServiceId || '',
    vehicleType: 'standard',
    appointmentDate: '',
    appointmentTime: '',
    address: '',
    paymentMethod: 'online',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!validateRequired(formData.customerName)) {
      newErrors.customerName = 'Name is required'
    }

    if (!validateRequired(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is required'
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }

    if (!validateRequired(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone number is required'
    } else if (!validatePhone(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid Australian phone number'
    }

    if (!formData.servicePackageId) {
      newErrors.servicePackageId = 'Please select a service package'
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select an appointment date'
    } else {
      const selectedDate = new Date(formData.appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Please select a future date'
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select an appointment time'
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await handleApiCall(() =>
        fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
      )

      if (response.success && response.data) {
        setSubmitMessage({
          type: 'success',
          text: 'Appointment booked successfully! You will receive a confirmation email shortly.'
        })
        
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          servicePackageId: selectedServiceId || '',
          vehicleType: 'standard',
          appointmentDate: '',
          appointmentTime: '',
          address: '',
          paymentMethod: 'online',
          notes: ''
        })

        if (onSuccess && response.data && typeof response.data === 'object' && 'id' in response.data) {
          onSuccess(response.data.id as string)
        }
      } else {
        setSubmitMessage({
          type: 'error',
          text: response.error || 'Failed to book appointment. Please try again.'
        })
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedService = SERVICE_PACKAGES.find(pkg => pkg.id === formData.servicePackageId)

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 17) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Book Your Appointment</CardTitle>
        <CardDescription>
          Fill in your details to schedule your car detailing service
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className={errors.customerName ? 'border-red-500' : ''}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-600">{errors.customerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className={errors.customerEmail ? 'border-red-500' : ''}
                />
                {errors.customerEmail && (
                  <p className="text-sm text-red-600">{errors.customerEmail}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="0412 345 678"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                className={errors.customerPhone ? 'border-red-500' : ''}
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-600">{errors.customerPhone}</p>
              )}
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="servicePackageId">Service Package *</Label>
              <Select
                value={formData.servicePackageId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, servicePackageId: value }))}
              >
                <SelectTrigger className={errors.servicePackageId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a service package" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_PACKAGES.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.basePrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.servicePackageId && (
                <p className="text-sm text-red-600">{errors.servicePackageId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Vehicle Type *</Label>
              <RadioGroup
                value={formData.vehicleType}
                onValueChange={(value: 'standard' | 'large') => 
                  setFormData(prev => ({ ...prev, vehicleType: value }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Hatch/Sedan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large SUV/4WD/7 Seater</Label>
                </div>
              </RadioGroup>
            </div>

            {selectedService && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {selectedService.name} - ${formData.vehicleType === 'large' ? selectedService.premiumPrice : selectedService.basePrice}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Duration: {Math.floor(selectedService.duration / 60)}h {selectedService.duration % 60}m
                </p>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appointment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Preferred Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  className={errors.appointmentDate ? 'border-red-500' : ''}
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-red-600">{errors.appointmentDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Preferred Time *</Label>
                <Select
                  value={formData.appointmentTime}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentTime: value }))}
                >
                  <SelectTrigger className={errors.appointmentTime ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.appointmentTime && (
                  <p className="text-sm text-red-600">{errors.appointmentTime}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Service Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your full address where the service will be performed"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value: 'online' | 'in-person') => 
                setFormData(prev => ({ ...prev, paymentMethod: value }))
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Pay Online (Secure Payment)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person">Pay at Service</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes for your service"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <Alert className={submitMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              <AlertDescription className={submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {submitMessage.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            * Additional charges may apply for pet hair removal and heavy soiling
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
