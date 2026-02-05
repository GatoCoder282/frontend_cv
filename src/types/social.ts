// --- SOCIAL DTOs ---

// INPUT: Crear red social
export interface SocialCreateRequest {
  platform: string;
  url: string;
  icon_name?: string | null;
  order?: number;
}

// INPUT: Actualizar red social
export interface SocialUpdateRequest {
  platform?: string;
  url?: string;
  icon_name?: string | null;
  order?: number;
}

// OUTPUT: Respuesta de red social
export interface SocialResponse {
  id: number;
  profile_id: number;
  platform: string;
  url: string;
  icon_name: string | null;
  order: number;
}
