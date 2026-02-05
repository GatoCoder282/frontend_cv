"use client";

import { useState, useEffect } from 'react';
import { workExperienceService } from '@/services/workExperienceService';
import { WorkExperienceResponse } from '@/types/workExperience';

/**
 * Hook para obtener la experiencia laboral pública de un usuario
 * @param username - Username del usuario
 */
export function usePublicWorkExperience(username: string) {
  const [experiences, setExperiences] = useState<WorkExperienceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await workExperienceService.getPublicWorkExperiences(username);
        setExperiences(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la experiencia laboral');
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchExperiences();
    }
  }, [username]);

  return { experiences, loading, error };
}
