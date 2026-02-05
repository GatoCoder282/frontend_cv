// --- WORK EXPERIENCE DTOs ---

// INPUT: Crear experiencia laboral
export interface WorkExperienceCreateRequest {
  job_title: string;
  company: string;
  location?: string | null;
  start_date: string; // ISO date string (YYYY-MM-DD)
  end_date?: string | null; // ISO date string (YYYY-MM-DD)
  description?: string | null;
}

// INPUT: Actualizar experiencia laboral
export interface WorkExperienceUpdateRequest {
  job_title?: string;
  company?: string;
  location?: string | null;
  start_date?: string; // ISO date string (YYYY-MM-DD)
  end_date?: string | null; // ISO date string (YYYY-MM-DD)
  description?: string | null;
}

// OUTPUT: Respuesta de experiencia laboral
export interface WorkExperienceResponse {
  id: number;
  profile_id: number;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string; // ISO date string (YYYY-MM-DD)
  end_date: string | null; // ISO date string (YYYY-MM-DD)
  description: string | null;
}
