'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { MapPin, Calendar, Package } from 'lucide-react'
import type { Project } from '../../shared/schema'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

const statusColors = {
  planning: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-green-100 text-green-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">
            {project.title}
          </CardTitle>
          <Badge className={statusColors[project.status as keyof typeof statusColors]}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="w-4 h-4 mr-2" />
          <span>{project.client}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{project.route}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{project.timeline}</span>
        </div>
        
        {project.progress !== null && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs text-gray-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description || 'No description provided'}
        </p>
      </CardContent>
    </Card>
  )
}