'use client'

import { ServicePackage } from '@/types'
import { formatCurrency } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ServiceCardProps {
  service: ServicePackage
  vehicleType: 'standard' | 'large'
  onSelect: (serviceId: string) => void
  isSelected?: boolean
}

export function ServiceCard({ service, vehicleType, onSelect, isSelected = false }: ServiceCardProps) {
  const price = vehicleType === 'large' ? service.premiumPrice : service.basePrice
  const originalPrice = vehicleType === 'large' ? service.premiumPrice : service.basePrice
  const isDiscounted = service.basePrice < service.premiumPrice && vehicleType === 'standard'

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-800'
      case 'interior':
        return 'bg-green-100 text-green-800'
      case 'full':
        return 'bg-purple-100 text-purple-800'
      case 'premium':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {service.name}
            </CardTitle>
            <CardDescription className="mt-1 text-gray-600">
              {service.description}
            </CardDescription>
          </div>
          <Badge className={getCategoryColor(service.category)}>
            {service.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(price)}
            </span>
            {isDiscounted && (
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            Duration: {Math.floor(service.duration / 60)}h {service.duration % 60}m
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Includes:</h4>
            <ul className="space-y-1">
              {service.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          onClick={() => onSelect(service.id)}
          className={`w-full ${
            isSelected
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Service'}
        </Button>
      </CardFooter>

      {service.id === 'paint-protection' && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Free Quote
          </Badge>
        </div>
      )}
    </Card>
  )
}
