"use client";

import { useState, useEffect } from 'react';
import { technologyService } from '@/services/technologyService';
import { TechnologyResponse } from '@/types/technology';

/**
 * Hook para obtener las tecnologías públicas de un usuario
 * @param username - Username del usuario
 */
export function usePublicTechnologies(username: string) {
  const [technologies, setTechnologies] = useState<TechnologyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const data = await technologyService.getPublicTechnologies(username);
        setTechnologies(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar las tecnologías');
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchTechnologies();
    }
  }, [username]);

  return { technologies, loading, error };
}
