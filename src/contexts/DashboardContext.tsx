"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/lib/hooks/useTasks";
import { useProjects } from "@/lib/hooks/useProjects";
import { useTeamMembers } from "@/lib/hooks/useTeamMembers";
import type { Task, Profile, Project, TaskLink } from "@/lib/types";

interface DashboardState {
  // Data
  tasks: Task[];
  tasksLoading: boolean;
  projects: Project[];
  projectsLoading: boolean;
  teamMembers: Profile[];
  membersLoading: boolean;

  // Task mutations
  createTask: (data: {
    title: string;
    description: string;
    responsible_id: string;
    secondary_responsible_id: string | null;
    project_id: string | null;
    status: string;
    priority: number;
    deadline: string | null;
    links: TaskLink[];
  }) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  completeTask: (taskId: string) => Promise<void>;
  reopenTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refetchTasks: () => Promise<void>;

  // Projects
  getProjectsForMember: (memberId: string) => Project[];
  hasMemberAccess: (memberId: string, projectId: string) => boolean;

  // Task modal state
  taskModalOpen: boolean;
  editingTask: Task | null;
  openTaskModal: (task?: Task | null) => void;
  closeTaskModal: () => void;

  // Preview modal state
  previewTask: Task | null;
  openPreview: (task: Task) => void;
  closePreview: () => void;
}

const DashboardContext = createContext<DashboardState>(null!);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, role } = useAuth();
  const userId = user?.id ?? null;

  const {
    tasks,
    loading: tasksLoading,
    createTask,
    updateTask,
    completeTask,
    reopenTask,
    deleteTask,
    refetch: refetchTasks,
  } = useTasks({ userId, role });

  const {
    projects,
    loading: projectsLoading,
    getProjectsForMember,
    hasMemberAccess,
  } = useProjects({ userId, role });

  const { members: teamMembers, loading: membersLoading } =
    useTeamMembers(userId);

  // Task modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openTaskModal = useCallback((task?: Task | null) => {
    setEditingTask(task ?? null);
    setTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  // Preview modal state
  const [previewTask, setPreviewTask] = useState<Task | null>(null);

  const openPreview = useCallback((task: Task) => {
    setPreviewTask(task);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewTask(null);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        tasks,
        tasksLoading,
        projects,
        projectsLoading,
        teamMembers,
        membersLoading,
        createTask,
        updateTask: updateTask as DashboardState["updateTask"],
        completeTask,
        reopenTask,
        deleteTask,
        refetchTasks,
        getProjectsForMember,
        hasMemberAccess,
        taskModalOpen,
        editingTask,
        openTaskModal,
        closeTaskModal,
        previewTask,
        openPreview,
        closePreview,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
