import api, { handleApiError } from './api';
import {
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectResponse,
} from '@/types';

// --- SERVICIO DE PROYECTOS ---
class ProjectService {
  /**
   * Crea un nuevo proyecto
   * Requiere permisos de ADMIN
   */
  async createProject(projectData: ProjectCreateRequest): Promise<ProjectResponse> {
    try {
      const response = await api.post<ProjectResponse>('/projects', projectData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todos los proyectos del usuario autenticado
   */
  async getMyProjects(): Promise<ProjectResponse[]> {
    try {
      const response = await api.get<ProjectResponse[]>('/projects/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene los proyectos destacados (featured) del usuario autenticado
   */
  async getMyFeaturedProjects(): Promise<ProjectResponse[]> {
    try {
      const response = await api.get<ProjectResponse[]>('/projects/featured');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene un proyecto específico por ID
   */
  async getProjectById(projectId: number): Promise<ProjectResponse> {
    try {
      const response = await api.get<ProjectResponse>(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza un proyecto existente
   * Requiere permisos de ADMIN
   */
  async updateProject(
    projectId: number,
    projectData: ProjectUpdateRequest
  ): Promise<ProjectResponse> {
    try {
      const response = await api.put<ProjectResponse>(
        `/projects/${projectId}`,
        projectData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Elimina un proyecto (soft delete)
   * Requiere permisos de ADMIN
   */
  async deleteProject(projectId: number): Promise<void> {
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // --- HELPERS ADICIONALES ---

  /**
   * Filtra proyectos por categoría
   */
  filterByCategory(
    projects: ProjectResponse[],
    category: string
  ): ProjectResponse[] {
    return projects.filter((project) => project.category === category);
  }

  /**
   * Filtra proyectos destacados
   */
  filterFeatured(projects: ProjectResponse[]): ProjectResponse[] {
    return projects.filter((project) => project.featured);
  }

  /**
   * Ordena proyectos por fecha (más recientes primero)
   * Asumiendo que el ID es incremental
   */
  sortByNewest(projects: ProjectResponse[]): ProjectResponse[] {
    return [...projects].sort((a, b) => b.id - a.id);
  }

  /**
   * Busca proyectos por término en título o descripción
   */
  searchProjects(
    projects: ProjectResponse[],
    searchTerm: string
  ): ProjectResponse[] {
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term)
    );
  }
}

// Exportar instancia única (Singleton)
export const projectService = new ProjectService();
export default projectService;
