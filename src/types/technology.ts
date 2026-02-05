import { TechnologyCategory } from './enums';

// --- TECHNOLOGY DTOs ---

// INPUT: Crear tecnología
export interface TechnologyCreateRequest {
  name: string;
  category: TechnologyCategory;
  icon_url?: string | null;
}

// INPUT: Actualizar tecnología
export interface TechnologyUpdateRequest {
  name?: string;
  category?: TechnologyCategory;
  icon_url?: string | null;
}

// OUTPUT: Respuesta de tecnología
export interface TechnologyResponse {
  id: number;
  profile_id: number;
  name: string;
  category: TechnologyCategory;
  icon_url: string | null;
}
