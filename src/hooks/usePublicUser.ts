"use client";

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { UserResponse } from '@/types/user';

/**
 * Hook para obtener la información pública de un usuario por username
 * @param username - Username del usuario (requerido)
 */
export function usePublicUser(username: string) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await userService.getPublicUser(username);
        setUser(data);
        setError(null);
      } catch (err: any) {
        if (err.statusCode === 404) {
          setUser(null);
        } else {
          setError(err.message || 'Error al cargar la información del usuario');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  return { user, loading, error };
}
