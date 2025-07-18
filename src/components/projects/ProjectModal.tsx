'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { X, MapPin, Calendar, Package, User } from 'lucide-react'

interface ProjectModalProps {
  projectId: number | null
  open: boolean
  onClose: () => void
}

const statusColors = {
  planning: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-green-100 text-green-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function ProjectModal({ projectId, open, onClose }: ProjectModalProps) {
  const { data: project, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId && open,
  })

  if (!open || !projectId) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : project ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>Client: {project.client}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Timeline: {project.timeline}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 md:col-span-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Route: {project.route}</span>
                </div>
              </div>

              {project.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                <p className="text-sm text-gray-600">{project.items}</p>
              </div>

              {project.progress !== null && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Progress</h4>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Project not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}