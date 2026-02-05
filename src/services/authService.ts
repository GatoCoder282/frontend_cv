import api, { handleApiError, ApiError } from './api';
import {
  UserRegisterRequest,
  UserLoginRequest,
  UserResponse,
  TokenResponse,
} from '@/types';

// --- CONSTANTES ---
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

// --- SERVICIO DE AUTENTICACIÓN ---
class AuthService {
  /**
   * Registra un nuevo usuario
   */
  async register(userData: UserRegisterRequest): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Inicia sesión con email y password
   * Guarda el token y los datos del usuario en localStorage
   */
  async login(credentials: UserLoginRequest): Promise<UserResponse> {
    try {
      // El backend espera OAuth2PasswordRequestForm
      // Debemos enviar como form-data (application/x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append('username', credentials.email); // Swagger usa 'username' pero es el email
      formData.append('password', credentials.password);

      const response = await api.post<TokenResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, token_type } = response.data;

      // Guardar token en localStorage
      this.setToken(access_token);

      // Obtener datos del usuario con el token
      const user = await this.getCurrentUser();
      this.setUser(user);

      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene los datos del usuario autenticado actual
   */
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Cierra sesión del usuario
   * Elimina el token y datos del usuario
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Verifica si el usuario es admin (ADMIN o SUPERADMIN)
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user ? ['ADMIN', 'SUPERADMIN'].includes(user.role.toUpperCase()) : false;
  }

  /**
   * Verifica si el usuario es superadmin
   */
  isSuperAdmin(): boolean {
    const user = this.getUser();
    return user?.role.toUpperCase() === 'SUPERADMIN';
  }

  // --- HELPERS PRIVADOS ---

  /**
   * Guarda el token en localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Guarda los datos del usuario en localStorage
   */
  private setUser(user: UserResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Obtiene los datos del usuario del localStorage
   */
  getUser(): UserResponse | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}

// Exportar instancia única (Singleton)
export const authService = new AuthService();
export default authService;
