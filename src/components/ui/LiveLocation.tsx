@@ .. @@
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

@@ .. @@
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

@@ .. @@
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