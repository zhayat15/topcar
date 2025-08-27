'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
  address?: string
}

interface LiveLocationProps {
  workerId: string
  workerName: string
  onLocationUpdate?: (location: LocationData) => void
}

export function LiveLocation({ workerId, workerName, onLocationUpdate }: LiveLocationProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Check if geolocation is supported
  const isGeolocationSupported = 'geolocation' in navigator

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Mock reverse geocoding (in real app, use Google Maps API or similar)
      const mockAddresses = [
        'Sydney CBD, NSW 2000',
        'Parramatta, NSW 2150',
        'Bondi Beach, NSW 2026',
        'Manly, NSW 2095',
        'Chatswood, NSW 2067'
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return a mock address based on coordinates
      const addressIndex = Math.floor(Math.abs(lat + lng) % mockAddresses.length)
      return mockAddresses[addressIndex]
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  const updateLocation = async (position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords
    const timestamp = new Date()

    try {
      // Get address from coordinates
      const address = await reverseGeocode(latitude, longitude)

      const locationData: LocationData = {
        latitude,
        longitude,
        accuracy,
        timestamp,
        address
      }

      setCurrentLocation(locationData)
      setLastUpdate(timestamp)

      // Mock API call to update server
      console.log(`📍 Location update for ${workerName}:`, {
        workerId,
        location: locationData
      })

      // Simulate server update
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: `Location updated: ${address}` 
        })
      }, 500)

      if (onLocationUpdate) {
        onLocationUpdate(locationData)
      }
    } catch (error) {
      console.error('Location update error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to update location on server' 
      })
    }
  }

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = 'Location access failed'
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location permissions.'
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.'
        break
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.'
        break
    }

    setMessage({ type: 'error', text: errorMessage })
    setIsSharing(false)
  }

  const startLocationSharing = () => {
    if (!isGeolocationSupported) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by this browser' })
      return
    }

    setMessage({ type: 'info', text: 'Requesting location access...' })

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position)
        setIsSharing(true)
        setMessage({ type: 'success', text: 'Location sharing started' })

        // Start watching position changes
        const id = navigator.geolocation.watchPosition(
          updateLocation,
          handleLocationError,
          options
        )
        setWatchId(id)
      },
      handleLocationError,
      options
    )
  }

  const stopLocationSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    
    setIsSharing(false)
    setMessage({ type: 'info', text: 'Location sharing stopped' })
    
    // Mock API call to stop sharing
    console.log(`📍 Location sharing stopped for ${workerName}`)
  }

  const refreshLocation = () => {
    if (!isGeolocationSupported) return

    setMessage({ type: 'info', text: 'Updating location...' })

    navigator.geolocation.getCurrentPosition(
      updateLocation,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Force fresh location
      }
    )
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 10) return 'text-green-600'
    if (accuracy <= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy <= 10) return 'High'
    if (accuracy <= 50) return 'Medium'
    return 'Low'
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ago`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Live Location</CardTitle>
            <CardDescription>
              Share your location with the admin team for job coordination
            </CardDescription>
          </div>
          <Badge variant={isSharing ? 'default' : 'secondary'}>
            {isSharing ? '📍 Sharing' : '📍 Offline'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Message */}
        {message && (
          <Alert className={
            message.type === 'success' ? 'border-green-500 bg-green-50' :
            message.type === 'error' ? 'border-red-500 bg-red-50' :
            'border-blue-500 bg-blue-50'
          }>
            <AlertDescription className={
              message.type === 'success' ? 'text-green-700' :
              message.type === 'error' ? 'text-red-700' :
              'text-blue-700'
            }>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Location Controls */}
        <div className="flex gap-3">
          {!isSharing ? (
            <Button
              onClick={startLocationSharing}
              disabled={!isGeolocationSupported}
              className="flex-1"
            >
              📍 Start Location Sharing
            </Button>
          ) : (
            <>
              <Button
                onClick={stopLocationSharing}
                variant="outline"
                className="flex-1"
              >
                ⏹️ Stop Sharing
              </Button>
              <Button
                onClick={refreshLocation}
                variant="outline"
              >
                🔄 Refresh
              </Button>
            </>
          )}
        </div>

        {/* Current Location Display */}
        {currentLocation && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Current Location</h4>
                <p className="text-gray-700">{currentLocation.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Accuracy: <span className={getAccuracyColor(currentLocation.accuracy)}>
                    {getAccuracyLabel(currentLocation.accuracy)}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  ±{Math.round(currentLocation.accuracy)}m
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Latitude</p>
                <p className="text-gray-600">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Longitude</p>
                <p className="text-gray-600">{currentLocation.longitude.toFixed(6)}</p>
              </div>
            </div>

            {lastUpdate && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Last updated: {formatTimestamp(lastUpdate)}
                </p>
              </div>
            )}

            {/* Mock Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <p className="font-medium">📍 Map View</p>
                <p className="text-sm">Location: {currentLocation.address}</p>
                <p className="text-xs">In a real app, this would show an interactive map</p>
              </div>
            </div>
          </div>
        )}

        {/* Location Sharing Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Location Sharing Benefits</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Helps admin track job progress and worker safety</li>
            <li>• Enables efficient job assignment based on proximity</li>
            <li>• Provides accurate arrival time estimates to customers</li>
            <li>• Assists with emergency response if needed</li>
            <li>• Your location is only shared during work hours</li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            🔒 <strong>Privacy:</strong> Your location is only shared with Top Car Detailing management 
            and is used solely for work coordination and safety purposes. Location sharing can be 
            stopped at any time.
          </p>
        </div>

        {/* Browser Support Warning */}
        {!isGeolocationSupported && (
          <Alert className="border-yellow-500 bg-yellow-50">
            <AlertDescription className="text-yellow-700">
              ⚠️ Your browser doesn't support location sharing. Please use a modern browser 
              like Chrome, Firefox, or Safari for this feature.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
