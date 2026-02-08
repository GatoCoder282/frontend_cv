// --- USER DTOs ---

// INPUT: Registro de usuario
export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

// OUTPUT: Respuesta de usuario (nunca incluye password)
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

// INPUT: Login de usuario
export interface UserLoginRequest {
  email: string;
  password: string;
}

// OUTPUT: Respuesta de token
export interface TokenResponse {
  access_token: string;
  token_type: string; // generalmente "bearer"
}

// --- PROFILE DTOs ---

// INPUT: Crear perfil
export interface ProfileCreateRequest {
  name: string;
  last_name: string;
  current_title?: string | null;
  bio_summary?: string | null;
  location?: string | null;
  phone?: string | null;
  photo_url?: string | null;
  profile?: string | null;
  cv_url?: string | null;
}

// INPUT: Actualizar perfil
export interface ProfileUpdateRequest {
  name?: string;
  last_name?: string;
  current_title?: string | null;
  bio_summary?: string | null;
  location?: string | null;
  phone?: string | null;
  photo_url?: string | null;
  profile?: string | null;
  cv_url?: string | null;
}

// OUTPUT: Respuesta de perfil
export interface ProfileResponse {
  id: number;
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  current_title: string | null;
  bio_summary: string | null;
  location: string | null;
  phone: string | null;
  photo_url: string | null;
  profile: string | null;
  cv_url: string | null;
}
