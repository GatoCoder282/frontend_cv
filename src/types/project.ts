import { ProjectCategory } from './enums';
import { TechnologyResponse } from './technology';

// --- PROJECT PREVIEW DTOs ---

// INPUT: Crear preview de proyecto
export interface ProjectPreviewCreateRequest {
  image_url: string;
  caption?: string | null;
  order: number;
}

// OUTPUT: Respuesta de preview de proyecto
export interface ProjectPreviewResponse {
  id: number;
  project_id: number;
  image_url: string;
  caption: string | null;
  order: number;
}

// --- PROJECT DTOs ---

// INPUT: Crear proyecto
export interface ProjectCreateRequest {
  title: string;
  category: ProjectCategory;
  description?: string | null;
  thumbnail_url?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  featured?: boolean;
  work_experience_id?: number | null;
  technology_ids?: number[];
  previews?: ProjectPreviewCreateRequest[];
}

// INPUT: Actualizar proyecto
export interface ProjectUpdateRequest {
  title?: string;
  category?: ProjectCategory;
  description?: string | null;
  thumbnail_url?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  featured?: boolean;
  work_experience_id?: number | null;
  technology_ids?: number[];
  previews?: ProjectPreviewCreateRequest[];
}

// OUTPUT: Respuesta de proyecto
export interface ProjectResponse {
  id: number;
  profile_id: number;
  title: string;
  category: ProjectCategory;
  description: string | null;
  thumbnail_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  work_experience_id: number | null;
  technologies: TechnologyResponse[];
  previews: ProjectPreviewResponse[];
}
