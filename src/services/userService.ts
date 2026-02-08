import api, { handleApiError } from './api';
import { UserResponse } from '@/types';

// --- SERVICIO DE USUARIOS ---
class UserService {
  /**
   * Obtiene la información pública de un usuario por su username
   * No requiere autenticación
   * @param username - Username del usuario a consultar
   */
  async getPublicUser(username: string): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>(`/public/${username}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const userService = new UserService();
export default userService;
