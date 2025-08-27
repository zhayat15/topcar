'use client'

import { useState, useEffect } from 'react'
import { ServicePackage } from '@/types'
import { formatCurrency } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ServiceFormData {
  name: string
  description: string
  inclusions: string[]
  basePrice: number
  premiumPrice: number
  duration: number
  category: 'basic' | 'interior' | 'full' | 'premium'
}

export function PriceCardManager() {
  const [services, setServices] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingService, setEditingService] = useState<ServicePackage | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    inclusions: [],
    basePrice: 0,
    premiumPrice: 0,
    duration: 120,
    category: 'basic'
  })

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services')
      const result = await response.json()
      
      if (result.success) {
        setServices(result.data)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to fetch services' })
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setMessage({ type: 'error', text: 'Network error while fetching services' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setMessage(null)
  }

  const handleInclusionsChange = (value: string) => {
    const inclusions = value.split('\n').filter(item => item.trim() !== '')
    setFormData(prev => ({
      ...prev,
      inclusions
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      inclusions: [],
      basePrice: 0,
      premiumPrice: 0,
      duration: 120,
      category: 'basic'
    })
    setEditingService(null)
    setShowForm(false)
  }

  const handleEdit = (service: ServicePackage) => {
    setFormData({
      name: service.name,
      description: service.description,
      inclusions: service.inclusions,
      basePrice: service.basePrice,
      premiumPrice: service.premiumPrice,
      duration: service.duration,
      category: service.category
    })
    setEditingService(service)
    setShowForm(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.name || !formData.description || formData.basePrice <= 0) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const url = editingService 
        ? `/api/services?id=${editingService.id}`
        : '/api/services'
      
      const method = editingService ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: editingService ? 'Service updated successfully!' : 'Service created successfully!' 
        })
        resetForm()
        fetchServices()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save service' })
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setMessage({ type: 'error', text: 'Network error while saving service' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Service deleted successfully!' })
        fetchServices()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete service' })
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      setMessage({ type: 'error', text: 'Network error while deleting service' })
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'interior': return 'bg-green-100 text-green-800'
      case 'full': return 'bg-purple-100 text-purple-800'
      case 'premium': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Price Card Management</h2>
          <p className="text-gray-600">Manage service packages and pricing</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add New Service'}
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Current Services ({services.length})</TabsTrigger>
          {showForm && (
            <TabsTrigger value="form">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Standard Price:</span>
                      <span className="font-semibold">{formatCurrency(service.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Large Vehicle:</span>
                      <span className="font-semibold">{formatCurrency(service.premiumPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm">{service.duration} minutes</span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Inclusions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {service.inclusions.slice(0, 3).map((inclusion, index) => (
                        <li key={index}>• {inclusion}</li>
                      ))}
                      {service.inclusions.length > 3 && (
                        <li className="text-gray-500">+ {service.inclusions.length - 3} more...</li>
                      )}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(service.id, service.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">No services found. Create your first service package!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {showForm && (
          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingService ? 'Edit Service Package' : 'Create New Service Package'}
                </CardTitle>
                <CardDescription>
                  {editingService ? 'Update the service details below' : 'Fill in the details for the new service package'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Premium Detail"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="interior">Interior</SelectItem>
                          <SelectItem value="full">Full Service</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the service"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="basePrice">Standard Price ($) *</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.basePrice || ''}
                        onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                        placeholder="79.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="premiumPrice">Large Vehicle Price ($) *</Label>
                      <Input
                        id="premiumPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.premiumPrice || ''}
                        onChange={(e) => handleInputChange('premiumPrice', parseFloat(e.target.value) || 0)}
                        placeholder="100.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="30"
                        max="480"
                        value={formData.duration || ''}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 120)}
                        placeholder="120"
                      />
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2">
                    <Label htmlFor="inclusions">Service Inclusions</Label>
                    <Textarea
                      id="inclusions"
                      value={formData.inclusions.join('\n')}
                      onChange={(e) => handleInclusionsChange(e.target.value)}
                      placeholder="Enter each inclusion on a new line:
Exterior wash and dry
Interior vacuum
Dashboard cleaning"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500">
                      Enter each inclusion on a separate line. These will appear as bullet points on the service card.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
