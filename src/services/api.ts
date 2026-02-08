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
    // Verificar si es una ruta pública (no necesita autenticación)
    const isPublicRoute = config.url?.includes('/public/') || config.url?.includes('/public');
    
    // Solo agregar token si NO es una ruta pública
    if (!isPublicRoute) {
      const token = localStorage.getItem('access_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as any;
    let message = axiosError.message;

    // Manejar errores de validación (422) - Pydantic validation errors
    if (axiosError.response?.status === 422 && Array.isArray(responseData)) {
      const errors = responseData.map((err: any) => {
        const field = err.loc?.[1] || err.loc?.[0] || 'campo';
        const msg = err.msg || 'Error de validación';
        return `${field}: ${msg}`;
      });
      message = errors.join('. ');
    }
    // Manejar respuestas con detalle
    else if (responseData?.detail) {
      message = typeof responseData.detail === 'string' 
        ? responseData.detail 
        : Array.isArray(responseData.detail)
          ? responseData.detail.map((err: any) => {
              const field = err.loc?.[1] || err.loc?.[0] || 'campo';
              const msg = err.msg || 'Error de validación';
              return `${field}: ${msg}`;
            }).join('. ')
          : JSON.stringify(responseData.detail);
    }
    
    return {
      message,
      detail: typeof responseData?.detail === 'string' ? responseData.detail : undefined,
      status: axiosError.response?.status,
    };
  }
  
  return {
    message: 'Error desconocido',
    detail: String(error),
  };
};

export default api;
