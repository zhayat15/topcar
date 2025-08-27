@@ .. @@
 'use client'

 import { useState, useEffect } from 'react'
 import { Appointment } from '@/types'
 import { JobDetails } from '@/components/ui/JobDetails'
+import { ExpenseForm } from '@/components/ui/ExpenseForm'
+import { UploadImageForm } from '@/components/ui/UploadImageForm'
+import { LiveLocation } from '@/components/ui/LiveLocation'
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 import { Button } from '@/components/ui/button'
 import { Badge } from '@/components/ui/badge'
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
 import { Alert, AlertDescription } from '@/components/ui/alert'
 import Link from 'next/link'

@@ .. @@
         {/* Job Management */}
         <Tabs defaultValue="today" className="space-y-4">
           <TabsList>
             <TabsTrigger value="today">Today's Jobs ({todayJobs.length})</TabsTrigger>
             <TabsTrigger value="upcoming">Upcoming ({upcomingJobs.length})</TabsTrigger>
             <TabsTrigger value="active">Active Jobs ({activeJobs.length})</TabsTrigger>
+            <TabsTrigger value="expenses">Expenses</TabsTrigger>
+            <TabsTrigger value="location">Location</TabsTrigger>
           </TabsList>

@@ .. @@
               </Card>
             )}
           </TabsContent>
+
+          <TabsContent value="expenses">
+            <ExpenseForm 
+              workerId={mockWorker.id}
+              workerName={mockWorker.name}
+            />
+          </TabsContent>
+
+          <TabsContent value="location">
+            <LiveLocation 
+              workerId={mockWorker.id}
+              workerName={mockWorker.name}
+            />
+          </TabsContent>
         </Tabs>

         {/* Job Details Modal */}
         {selectedJob && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-4 border-b flex justify-between items-center">
                 <h2 className="text-xl font-semibold">Job Details</h2>
                 <Button
                   onClick={() => setSelectedJob(null)}
                   variant="outline"
                   size="sm"
                 >
                   Close
                 </Button>
               </div>
               <div className="p-4">
-                <JobDetails
-                  job={selectedJob}
-                  onAccept={(jobId) => {
-                    handleJobAction(jobId, 'accept')
-                    setSelectedJob(null)
-                  }}
-                  onReject={(jobId) => {
-                    handleJobAction(jobId, 'reject')
-                    setSelectedJob(null)
-                  }}
-                  onComplete={(jobId) => {
-                    handleJobAction(jobId, 'complete')
-                    setSelectedJob(null)
-                  }}
-                />
+                <Tabs defaultValue="details" className="space-y-4">
+                  <TabsList>
+                    <TabsTrigger value="details">Job Details</TabsTrigger>
+                    <TabsTrigger value="photos">Photos</TabsTrigger>
+                  </TabsList>
+                  
+                  <TabsContent value="details">
+                    <JobDetails
+                      job={selectedJob}
+                      onAccept={(jobId) => {
+                        handleJobAction(jobId, 'accept')
+                        setSelectedJob(null)
+                      }}
+                      onReject={(jobId) => {
+                        handleJobAction(jobId, 'reject')
+                        setSelectedJob(null)
+                      }}
+                      onComplete={(jobId) => {
+                        handleJobAction(jobId, 'complete')
+                        setSelectedJob(null)
+                      }}
+                    />
+                  </TabsContent>
+                  
+                  <TabsContent value="photos">
+                    <UploadImageForm
+                      appointmentId={selectedJob.id}
+                      workerId={mockWorker.id}
+                    />
+                  </TabsContent>
+                </Tabs>
               </div>
             </div>
           </div>