"use client";

import { useState, useEffect } from 'react';
import { socialService } from '@/services/socialService';
import { SocialResponse } from '@/types/social';

/**
 * Hook para obtener los social links públicos de un usuario
 * @param username - Username del usuario
 */
export function usePublicSocials(username: string) {
  const [socials, setSocials] = useState<SocialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        setLoading(true);
        const data = await socialService.getPublicSocials(username);
        setSocials(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los social links');
        setSocials([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchSocials();
    }
  }, [username]);

  return { socials, loading, error };
}
