'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthProvider";
import { Sidebar } from "../layout/SideBar";
import { TopBar } from "../layout/TopBar";
import { MobileNav } from "../layout/MobilNav";
import { StatsCards } from "../dashboard/StatsCards";
import { ProjectCard } from "../projects/ProjectCard";
import { ProjectModal } from "../projects/ProjectModal";
import { CreateProjectModal } from "../projects/CreateProjectModal";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Plus, Grid3X3, List } from "lucide-react";
import type { Project } from "../../shared/schema";

export default function Dashboard() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();

  const userRole = user?.["https://logiflow.app/role"] || "customer";

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <TopBar 
          title="Projects Dashboard" 
          subtitle="Manage your logistics projects"
        />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-4">
          {/* Stats Cards */}
          <StatsCards />

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {userRole === "manager" ? "All Projects" : "My Projects"}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Latest logistics projects and their status
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 rounded-md p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3 py-1"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3 py-1"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  {userRole === "manager" && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-32 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }>
                  {projects.map((project: Project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    {userRole === "manager" 
                      ? "No projects created yet." 
                      : "No projects assigned to you yet."
                    }
                  </div>
                  {userRole === "manager" && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNav />

      {/* Modals */}
      <ProjectModal
        projectId={selectedProjectId}
        open={!!selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />

      {userRole === "manager" && (
        <CreateProjectModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}