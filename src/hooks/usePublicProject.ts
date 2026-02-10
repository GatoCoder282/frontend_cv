import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { ProjectResponse } from '@/types';

/**
 * Hook para obtener un proyecto público individual
 */
export function usePublicProject(username: string | null, projectId: number | null) {
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !projectId) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getPublicProjectById(username, projectId);
        setProject(data);
      } catch (err) {
        setError('No se pudo cargar el proyecto');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [username, projectId]);

  return { project, loading, error };
}
