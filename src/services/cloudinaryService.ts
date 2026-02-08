import api, { handleApiError } from './api';

export interface ImageUploadResponse {
  url: string;
}

// --- SERVICIO DE IMÁGENES (Cloudinary) ---
class CloudinaryService {
  /**
   * Sube una imagen a Cloudinary
   * Requiere permisos de ADMIN
   */
  async uploadImage(file: File, folder?: string): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ImageUploadResponse>('/images/upload', formData, {
        params: folder ? { folder } : undefined,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Sube un PDF a Cloudinary
   * Requiere permisos de ADMIN
   */
  async uploadPDF(file: File, folder?: string): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ImageUploadResponse>('/images/upload-pdf', formData, {
        params: folder ? { folder } : undefined,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Exportar instancia única (Singleton)
export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
