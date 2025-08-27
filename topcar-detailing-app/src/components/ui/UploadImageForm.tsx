'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface UploadImageFormProps {
  appointmentId: string
  workerId: string
  onUploadComplete?: (imageData: any) => void
}

interface UploadedImage {
  id: string
  type: 'before' | 'after'
  filename: string
  url: string
  uploadedAt: Date
}

export function UploadImageForm({ appointmentId, workerId, onUploadComplete }: UploadImageFormProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleFileUpload = async (file: File, type: 'before' | 'after') => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' })
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'File too large. Maximum size is 5MB.' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('appointmentId', appointmentId)
      formData.append('workerId', workerId)
      formData.append('type', type)

      // Mock API call to upload endpoint
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        const newImage: UploadedImage = {
          id: result.data.fileId,
          type,
          filename: result.data.filename,
          url: result.data.url,
          uploadedAt: new Date(result.data.uploadedAt)
        }

        setUploadedImages(prev => [...prev, newImage])
        setMessage({ type: 'success', text: `${type} image uploaded successfully!` })
        
        if (onUploadComplete) {
          onUploadComplete(newImage)
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload failed' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Network error during upload' })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file, type)
    }
  }

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
    setMessage({ type: 'success', text: 'Image removed' })
  }

  const beforeImages = uploadedImages.filter(img => img.type === 'before')
  const afterImages = uploadedImages.filter(img => img.type === 'after')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Photos</CardTitle>
        <CardDescription>
          Upload before and after photos for appointment {appointmentId.slice(0, 8)}...
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Status Message */}
        {message && (
          <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
            <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Before Photos Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Before Photos</h4>
            <Badge variant="outline">{beforeImages.length} uploaded</Badge>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-2">
              <div className="text-gray-600">
                📸 Upload photos showing the vehicle's condition before service
              </div>
              <Label htmlFor="before-upload" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="mt-2"
                  onClick={() => document.getElementById('before-upload')?.click()}
                >
                  {uploading ? 'Uploading...' : 'Choose Before Photos'}
                </Button>
              </Label>
              <Input
                id="before-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'before')}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP (max 5MB each)
              </p>
            </div>
          </div>

          {/* Before Images Grid */}
          {beforeImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {beforeImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={`Before photo ${image.filename}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(image.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.filename}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* After Photos Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">After Photos</h4>
            <Badge variant="outline">{afterImages.length} uploaded</Badge>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-2">
              <div className="text-gray-600">
                ✨ Upload photos showing the completed detailing work
              </div>
              <Label htmlFor="after-upload" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="mt-2"
                  onClick={() => document.getElementById('after-upload')?.click()}
                >
                  {uploading ? 'Uploading...' : 'Choose After Photos'}
                </Button>
              </Label>
              <Input
                id="after-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'after')}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP (max 5MB each)
              </p>
            </div>
          </div>

          {/* After Images Grid */}
          {afterImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {afterImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={`After photo ${image.filename}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(image.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.filename}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Upload Summary</p>
              <p className="text-sm text-gray-600">
                {beforeImages.length} before photos, {afterImages.length} after photos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total: {uploadedImages.length} images</p>
              {uploadedImages.length > 0 && (
                <p className="text-xs text-green-600">✓ Ready for review</p>
              )}
            </div>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Photo Guidelines</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Take clear, well-lit photos from multiple angles</li>
            <li>• Include close-ups of problem areas and detailed work</li>
            <li>• Ensure photos show the entire vehicle when possible</li>
            <li>• Before photos help document initial condition</li>
            <li>• After photos showcase the quality of your work</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
