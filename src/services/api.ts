import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 70000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR DE REQUEST: Añade el token JWT automáticamente ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPONSE: Manejo centralizado de errores ---
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores comunes
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          // Redirigir al login (opcional, puedes manejarlo en componentes)
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          console.error('Acceso prohibido: No tienes permisos');
          break;
          
        case 404:
          console.error('Recurso no encontrado');
          break;
          
        case 500:
          console.error('Error interno del servidor');
          break;
      }
    } else if (error.request) {
      // Request fue hecho pero no hubo respuesta
      console.error('Error de red: No se pudo conectar con el servidor');
    }
    
    return Promise.reject(error);
  }
);

// --- HELPER: Manejo de errores tipado ---
export interface ApiError {
  message: string;
  detail?: string;
  status?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail: string }>;
    
    return {
      message: axiosError.response?.data?.detail || axiosError.message,
      detail: axiosError.response?.data?.detail,
      status: axiosError.response?.status,
    };
  }
  
  return {
    message: 'Error desconocido',
    detail: String(error),
  };
};

export default api;
