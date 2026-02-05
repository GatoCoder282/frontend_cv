"use client";

import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { ProjectResponse } from '@/types/project';

/**
 * Hook para obtener los proyectos públicos de un usuario
 * @param username - Username del usuario
 */
export function usePublicProjects(username: string) {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getPublicProjects(username);
        setProjects(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los proyectos');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProjects();
    }
  }, [username]);

  return { projects, loading, error };
}

/**
 * Hook para obtener los proyectos destacados públicos de un usuario
 * @param username - Username del usuario
 */
export function usePublicFeaturedProjects(username: string) {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getPublicFeaturedProjects(username);
        setProjects(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los proyectos destacados');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProjects();
    }
  }, [username]);

  return { projects, loading, error };
}

/**
 * Hook para obtener un proyecto público específico
 * @param username - Username del usuario
 * @param projectId - ID del proyecto
 */
export function usePublicProject(username: string, projectId: number | null) {
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (projectId) {
          const data = await projectService.getPublicProjectById(username, projectId);
          setProject(data);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el proyecto');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (username && projectId) {
      fetchProject();
    }
  }, [username, projectId]);

  return { project, loading, error };
}
