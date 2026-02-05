import api, { handleApiError } from './api';
import {
  SocialCreateRequest,
  SocialUpdateRequest,
  SocialResponse,
} from '@/types';

// --- SERVICIO DE SOCIAL LINKS ---
class SocialService {
  /**
   * Crea un social link
   * Requiere permisos de ADMIN
   */
  async createSocial(socialData: SocialCreateRequest): Promise<SocialResponse> {
    try {
      const response = await api.post<SocialResponse>('/social', socialData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todos los social links del usuario autenticado
   */
  async getMySocials(): Promise<SocialResponse[]> {
    try {
      const response = await api.get<SocialResponse[]>('/social/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene un social link por ID
   */
  async getSocialById(socialId: number): Promise<SocialResponse> {
    try {
      const response = await api.get<SocialResponse>(`/social/${socialId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza un social link
   * Requiere permisos de ADMIN
   */
  async updateSocial(
    socialId: number,
    socialData: SocialUpdateRequest
  ): Promise<SocialResponse> {
    try {
      const response = await api.put<SocialResponse>(
        `/social/${socialId}`,
        socialData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Elimina un social link (soft delete)
   * Requiere permisos de ADMIN
   */
  async deleteSocial(socialId: number): Promise<void> {
    try {
      await api.delete(`/social/${socialId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const socialService = new SocialService();
export default socialService;
