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
               <img
                 src={image.url}
                 alt={`Before photo ${image.filename}`}
                 className="w-full h-32 object-cover rounded-lg border"
+                onError={(e) => {
+                  const target = e.target as HTMLImageElement;
+                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA0OEw5MyA1NEw5OSA0OEwxMDUgNTRMMTExIDQ4TDExNyA1NEwxMjMgNDhMMTI5IDU0TDEzNSA0OEwxNDEgNTRMMTQ3IDQ4TDE1MyA1NEwxNTkgNDhMMTY1IDU0TDE3MSA0OEwxNzcgNTRMMTgzIDQ4TDE4OSA1NEwxOTUgNDhWODBIMTg5TDE4MyA3NEwxNzcgODBMMTcxIDc0TDE2NSA4MEwxNTkgNzRMMTUzIDgwTDE0NyA3NEwxNDEgODBMMTM1IDc0TDEyOSA4MEwxMjMgNzRMMTE3IDgwTDExMSA3NEwxMDUgODBMOTkgNzRMOTMgODBMODcgNzRWNDhaIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjY0IiByPSIyMCIgZmlsbD0iI0Q1RDlERCIvPgo8cGF0aCBkPSJNOTAgNzRMMTAwIDY0TDExMCA3NEgxMDBIOTBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
+                }}
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

@@ .. @@
               <img
                 src={image.url}
                 alt={`After photo ${image.filename}`}
                 className="w-full h-32 object-cover rounded-lg border"
+                onError={(e) => {
+                  const target = e.target as HTMLImageElement;
+                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA0OEw5MyA1NEw5OSA0OEwxMDUgNTRMMTExIDQ4TDExNyA1NEwxMjMgNDhMMTI5IDU0TDEzNSA0OEwxNDEgNTRMMTQ3IDQ4TDE1MyA1NEwxNTkgNDhMMTY1IDU0TDE3MSA0OEwxNzcgNTRMMTgzIDQ4TDE4OSA1NEwxOTUgNDhWODBIMTg5TDE4MyA3NEwxNzcgODBMMTcxIDc0TDE2NSA4MEwxNTkgNzRMMTUzIDgwTDE0NyA3NEwxNDEgODBMMTM1IDc0TDEyOSA4MEwxMjMgNzRMMTE3IDgwTDExMSA3NEwxMDUgODBMOTkgNzRMOTMgODBMODcgNzRWNDhaIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjY0IiByPSIyMCIgZmlsbD0iI0Q1RDlERCIvPgo8cGF0aCBkPSJNOTAgNzRMMTAwIDY0TDExMCA3NEgxMDBIOTBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
+                }}
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