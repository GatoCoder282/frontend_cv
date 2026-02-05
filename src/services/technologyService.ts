import api, { handleApiError } from './api';
import {
  TechnologyCreateRequest,
  TechnologyUpdateRequest,
  TechnologyResponse,
} from '@/types';

// --- SERVICIO DE TECNOLOGÍAS ---
class TechnologyService {
  // ============================================
  // MÉTODOS PÚBLICOS (sin autenticación)
  // ============================================

  /**
   * Obtiene todas las tecnologías públicas de un usuario por username
   * @param username - Username del usuario
   */
  async getPublicTechnologies(username: string): Promise<TechnologyResponse[]> {
    try {
      const response = await api.get<TechnologyResponse[]>(`/technologies/public/${username}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ============================================
  // MÉTODOS PRIVADOS (requieren autenticación)
  // ============================================

  /**
   * Crea una tecnología
   * Requiere permisos de ADMIN
   */
  async createTechnology(
    techData: TechnologyCreateRequest
  ): Promise<TechnologyResponse> {
    try {
      const response = await api.post<TechnologyResponse>(
        '/technologies',
        techData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todas las tecnologías del usuario autenticado
   */
  async getMyTechnologies(): Promise<TechnologyResponse[]> {
    try {
      const response = await api.get<TechnologyResponse[]>('/technologies/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene una tecnología por ID
   */
  async getTechnologyById(techId: number): Promise<TechnologyResponse> {
    try {
      const response = await api.get<TechnologyResponse>(
        `/technologies/${techId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza una tecnología
   * Requiere permisos de ADMIN
   */
  async updateTechnology(
    techId: number,
    techData: TechnologyUpdateRequest
  ): Promise<TechnologyResponse> {
    try {
      const response = await api.put<TechnologyResponse>(
        `/technologies/${techId}`,
        techData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Elimina una tecnología (soft delete)
   * Requiere permisos de ADMIN
   */
  async deleteTechnology(techId: number): Promise<void> {
    try {
      await api.delete(`/technologies/${techId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const technologyService = new TechnologyService();
export default technologyService;
