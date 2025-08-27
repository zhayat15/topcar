'use client'

import { useState, useEffect } from 'react'
import { ServicePackage } from '@/types'
import { formatCurrency } from '@/lib/utils-extended'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function HomePage() {
  const [services, setServices] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicleType, setSelectedVehicleType] = useState<'standard' | 'large'>('standard')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const result = await response.json()
        if (result.success) {
          setServices(result.data)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

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

  const getPrice = (service: ServicePackage) => {
    return selectedVehicleType === 'large' ? service.premiumPrice : service.basePrice
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Top Car Detailing</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <Link href="/customer/login">
                <Button variant="outline" size="sm">Customer Login</Button>
              </Link>
            </nav>
            <div className="md:hidden">
              <Link href="/customer/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium Car Detailing
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Professional car detailing services that bring out the best in your vehicle. 
            From basic washes to premium paint protection, we've got you covered.
          </p>
          
          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border">
              <span className="text-sm font-medium text-gray-700">🏆 #1 Detailing Melbourne 2025</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border">
              <span className="text-sm font-medium text-gray-700">⭐ 5.0 Google Rating</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border">
              <span className="text-sm font-medium text-gray-700">🚗 500+ Happy Customers</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border">
              <span className="text-sm font-medium text-gray-700">🛡️ Fully Insured</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customer/booking">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                Book Now
              </Button>
            </Link>
            <a href="#services">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                View Services
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Top Car Detailing?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine professional expertise with premium products to deliver exceptional results every time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Service</h3>
              <p className="text-gray-600">
                Trained professionals using industry-leading techniques and premium products for outstanding results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple online booking system with flexible scheduling and instant confirmation for your convenience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">
                100% satisfaction guarantee with quality workmanship and attention to detail in every service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Choose from our comprehensive range of car detailing services, each designed to meet your specific needs and budget.
            </p>
            
            {/* Vehicle Type Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedVehicleType('standard')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    selectedVehicleType === 'standard'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hatch / Sedan
                </button>
                <button
                  onClick={() => setSelectedVehicleType('large')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    selectedVehicleType === 'large'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Large SUV / 4WD / 7 Seater
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading services...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="relative hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {service.name}
                      </CardTitle>
                      <Badge className={getCategoryColor(service.category)}>
                        {service.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price Display */}
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(getPrice(service))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {service.duration} minutes
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.inclusions.slice(0, 4).map((inclusion, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <span className="text-green-500 mr-2 mt-0.5">✓</span>
                            {inclusion}
                          </li>
                        ))}
                        {service.inclusions.length > 4 && (
                          <li className="text-sm text-gray-500 italic">
                            + {service.inclusions.length - 4} more inclusions...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Book Now Button */}
                    <div className="pt-4">
                      <Link href={`/customer/booking?service=${service.id}&vehicle=${selectedVehicleType}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Book This Service
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Special Notice */}
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-center">
              <h3 className="font-semibold text-yellow-800 mb-2">Additional Charges May Apply</h3>
              <p className="text-yellow-700 text-sm">
                Pet hair removal and heavy soiling may incur additional fees. 
                Paint Protection services start from the listed price - contact us for a free quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Top Car Detailing</h2>
              <p className="text-gray-600 mb-4">
                With years of experience in the automotive detailing industry, we pride ourselves on delivering 
                exceptional results that exceed our customers' expectations. Our team of skilled professionals 
                uses only the finest products and proven techniques to restore and protect your vehicle.
              </p>
              <p className="text-gray-600 mb-6">
                From basic maintenance washes to comprehensive paint protection services, we offer a complete 
                range of detailing solutions tailored to your vehicle's specific needs and your budget.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">TC</span>
              </div>
                State-of-the-art equipment and premium products ensure your vehicle receives the best possible care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Customer Reviews</h2>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex text-yellow-400 text-3xl">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="text-3xl font-bold text-gray-900">5.0</span>
            </div>
            <p className="text-gray-600 text-lg">Based on 127+ verified Google reviews</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Sarah Mitchell</h4>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                "Absolutely incredible service! My BMW looks brand new after their Ultimate Detail package. The team was professional, punctual, and the attention to detail was outstanding. Highly recommend!"
              </p>
              <p className="text-sm text-gray-500">2 weeks ago</p>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                "Top Car Detailing exceeded my expectations! The paint protection service was worth every penny. My car's paint looks amazing and I can see the difference in protection. Professional team!"
              </p>
              <p className="text-sm text-gray-500">1 month ago</p>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Jessica Taylor</h4>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                "Best car detailing service in Melbourne! The interior detail was phenomenal - they removed stains I thought were permanent. Booking was easy and they arrived right on time. 5 stars!"
              </p>
              <p className="text-sm text-gray-500">3 weeks ago</p>
            </div>

            {/* Review 4 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">David Wilson</h4>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                "Outstanding cut and polish service! My 10-year-old car looks like it just rolled off the showroom floor. The team is skilled, friendly, and reasonably priced. Will definitely use again!"
              </p>
              <p className="text-sm text-gray-500">1 week ago</p>
            </div>

            {/* Review 5 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  L
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Lisa Anderson</h4>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                "Fantastic full detail service! They transformed my SUV inside and out. The team was professional, efficient, and the results speak for themselves. Melbourne's best detailing service!"
              </p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>

            {/* Review 6 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Robert Kim</h4>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">
                "Impressed with their basic detail package! Great value for money and excellent results. The team was courteous and completed the job efficiently. Highly recommend for regular maintenance!"
              </p>
              <p className="text-sm text-gray-500">4 days ago</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
              📱 Read More Reviews on Google
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Book Your Service?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your car looking its best with our professional detailing services. 
            Book online now or contact us for a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customer/booking">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                Book Online Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Call (02) 1234 5678
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">TC</span>
              </div>
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Basic Detail</li>
                <li>Interior Detail</li>
                <li>Full Detail</li>
                <li>Paint Protection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Phone: (02) 1234 5678</li>
                <li>Email: info@topcardetailing.com</li>
                <li>Address: Sydney, NSW</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Mon-Fri: 8:00 AM - 6:00 PM</li>
                <li>Saturday: 8:00 AM - 4:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Top Car Detailing. All rights reserved.</p>
            {/* Hidden Admin Access */}
            <div className="mt-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-400 text-xs">
                Admin
              </Link>
              <span className="mx-2 text-gray-600">•</span>
              <Link href="/worker" className="text-gray-600 hover:text-gray-400 text-xs">
                Worker
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}