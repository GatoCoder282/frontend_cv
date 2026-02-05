import api, { handleApiError } from './api';
import {
  ClientCreateRequest,
  ClientUpdateRequest,
  ClientResponse,
} from '@/types';

// --- SERVICIO DE CLIENTES ---
class ClientService {
  // ============================================
  // MÉTODOS PÚBLICOS (sin autenticación)
  // ============================================

  /**
   * Obtiene todos los clientes públicos de un usuario por username
   * @param username - Username del usuario
   */
  async getPublicClients(username: string): Promise<ClientResponse[]> {
    try {
      const response = await api.get<ClientResponse[]>(`/clients/public/${username}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ============================================
  // MÉTODOS PRIVADOS (requieren autenticación)
  // ============================================

  /**
   * Crea un cliente
   * Requiere permisos de ADMIN
   */
  async createClient(clientData: ClientCreateRequest): Promise<ClientResponse> {
    try {
      const response = await api.post<ClientResponse>('/clients', clientData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todos los clientes del usuario autenticado
   */
  async getMyClients(): Promise<ClientResponse[]> {
    try {
      const response = await api.get<ClientResponse[]>('/clients/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene un cliente por ID
   */
  async getClientById(clientId: number): Promise<ClientResponse> {
    try {
      const response = await api.get<ClientResponse>(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualiza un cliente
   * Requiere permisos de ADMIN
   */
  async updateClient(
    clientId: number,
    clientData: ClientUpdateRequest
  ): Promise<ClientResponse> {
    try {
      const response = await api.put<ClientResponse>(
        `/clients/${clientId}`,
        clientData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Elimina un cliente (soft delete)
   * Requiere permisos de ADMIN
   */
  async deleteClient(clientId: number): Promise<void> {
    try {
      await api.delete(`/clients/${clientId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const clientService = new ClientService();
export default clientService;
