// --- CLIENT DTOs ---

// INPUT: Crear cliente
export interface ClientCreateRequest {
  name: string;
  company?: string | null;
  feedback?: string | null;
  client_photo_url?: string | null;
  project_link?: string | null;
}

// INPUT: Actualizar cliente
export interface ClientUpdateRequest {
  name?: string;
  company?: string | null;
  feedback?: string | null;
  client_photo_url?: string | null;
  project_link?: string | null;
}

// OUTPUT: Respuesta de cliente
export interface ClientResponse {
  id: number;
  profile_id: number;
  name: string;
  company: string | null;
  feedback: string | null;
  client_photo_url: string | null;
  project_link: string | null;
}
