import api, { handleApiError } from './api';
import {
  ProfileCreateRequest,
  ProfileUpdateRequest,
  ProfileResponse,
} from '@/types';

// --- SERVICIO DE PERFIL ---
class ProfileService {
  /**
   * Crea el perfil del usuario autenticado
   * Requiere permisos de ADMIN
   */
  async createProfile(profileData: ProfileCreateRequest): Promise<ProfileResponse> {
    try {
      const response = await api.post<ProfileResponse>('/profile', profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getMyProfile(): Promise<ProfileResponse> {
    try {
      const response = await api.get<ProfileResponse>('/profile/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * Requiere permisos de ADMIN
   */
  async updateMyProfile(profileData: ProfileUpdateRequest): Promise<ProfileResponse> {
    try {
      const response = await api.put<ProfileResponse>('/profile/me', profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const profileService = new ProfileService();
export default profileService;
