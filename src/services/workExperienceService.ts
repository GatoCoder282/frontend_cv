import api, { handleApiError } from './api';
import {
  WorkExperienceCreateRequest,
  WorkExperienceUpdateRequest,
  WorkExperienceResponse,
} from '@/types';

// --- SERVICIO DE EXPERIENCIA LABORAL ---
class WorkExperienceService {
  /**
   * Crea una experiencia laboral
   * Requiere permisos de ADMIN
   */
  async createWorkExperience(
    workExpData: WorkExperienceCreateRequest
  ): Promise<WorkExperienceResponse> {
    try {
      const response = await api.post<WorkExperienceResponse>(
        '/work-experience',
        workExpData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todas las experiencias laborales del usuario autenticado
   */
  async getMyWorkExperiences(): Promise<WorkExperienceResponse[]> {
    try {
      const response = await api.get<WorkExperienceResponse[]>(
        '/work-experience/me'
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene una experiencia laboral por ID
   */
  async getWorkExperienceById(
    workExperienceId: number
  ): Promise<WorkExperienceResponse> {
    try {
      const response = await api.get<WorkExperienceResponse>(
        `/work-experience/${workExperienceId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza una experiencia laboral
   * Requiere permisos de ADMIN
   */
  async updateWorkExperience(
    workExperienceId: number,
    workExpData: WorkExperienceUpdateRequest
  ): Promise<WorkExperienceResponse> {
    try {
      const response = await api.put<WorkExperienceResponse>(
        `/work-experience/${workExperienceId}`,
        workExpData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Elimina una experiencia laboral (soft delete)
   * Requiere permisos de ADMIN
   */
  async deleteWorkExperience(workExperienceId: number): Promise<void> {
    try {
      await api.delete(`/work-experience/${workExperienceId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const workExperienceService = new WorkExperienceService();
export default workExperienceService;
