import { 
  users, 
  projects, 
  projectAssignments, 
  comments,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type ProjectAssignment,
  type InsertProjectAssignment,
  type Comment,
  type InsertComment,
  type ProjectWithDetails
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByAuth0Id(auth0Id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectWithDetails(id: number): Promise<ProjectWithDetails | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsForUser(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Project assignment operations
  assignUserToProject(assignment: InsertProjectAssignment): Promise<ProjectAssignment>;
  removeUserFromProject(projectId: number, userId: number): Promise<boolean>;
  getProjectAssignments(projectId: number): Promise<(ProjectAssignment & { user: User })[]>;
  getUserProjectAssignments(userId: number): Promise<(ProjectAssignment & { project: Project })[]>;

  // Comment operations
  getProjectComments(projectId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Stats operations
  getProjectStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    completed: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.auth0Id, auth0Id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectWithDetails(id: number): Promise<ProjectWithDetails | undefined> {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        creator: true,
        assignments: {
          with: {
            user: true
          }
        },
        comments: {
          with: {
            user: true
          },
          orderBy: desc(comments.createdAt)
        }
      }
    });
    return project as ProjectWithDetails | undefined;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectsForUser(userId: number): Promise<Project[]> {
    const assignments = await db
      .select({ project: projects })
      .from(projectAssignments)
      .innerJoin(projects, eq(projectAssignments.projectId, projects.id))
      .where(eq(projectAssignments.userId, userId))
      .orderBy(desc(projects.createdAt));
    
    return assignments.map(a => a.project);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async assignUserToProject(assignment: InsertProjectAssignment): Promise<ProjectAssignment> {
    const [result] = await db
      .insert(projectAssignments)
      .values(assignment)
      .returning();
    return result;
  }

  async removeUserFromProject(projectId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(projectAssignments)
      .where(
        and(
          eq(projectAssignments.projectId, projectId),
          eq(projectAssignments.userId, userId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }

  async getProjectAssignments(projectId: number): Promise<(ProjectAssignment & { user: User })[]> {
    const results = await db
      .select()
      .from(projectAssignments)
      .innerJoin(users, eq(projectAssignments.userId, users.id))
      .where(eq(projectAssignments.projectId, projectId));
    
    return results.map(r => ({
      ...r.project_assignments,
      user: r.users
    }));
  }

  async getUserProjectAssignments(userId: number): Promise<(ProjectAssignment & { project: Project })[]> {
    const results = await db
      .select()
      .from(projectAssignments)
      .innerJoin(projects, eq(projectAssignments.projectId, projects.id))
      .where(eq(projectAssignments.userId, userId));
    
    return results.map(r => ({
      ...r.project_assignments,
      project: r.projects
    }));
  }

  async getProjectComments(projectId: number): Promise<(Comment & { user: User })[]> {
    const results = await db
      .select()
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.projectId, projectId))
      .orderBy(desc(comments.createdAt));
    
    return results.map(r => ({
      ...r.comments,
      user: r.users
    }));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getProjectStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    completed: number;
  }> {
    const allProjects = await db.select().from(projects);
    
    return {
      total: allProjects.length,
      active: allProjects.filter(p => p.status === 'active' || p.status === 'in_transit').length,
      pending: allProjects.filter(p => p.status === 'planning').length,
      completed: allProjects.filter(p => p.status === 'completed').length,
    };
  }
}

export const storage = new DatabaseStorage();