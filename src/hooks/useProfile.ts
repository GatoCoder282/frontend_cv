"use client";

import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { ProfileResponse } from '@/types/user';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getMyProfile();
        setProfile(data);
        setError(null);
      } catch (err: any) {
        // Si no hay perfil (404), simplemente no mostramos error en público
        if (err.statusCode === 404) {
          setProfile(null);
        } else {
          setError(err.message || 'Error al cargar el perfil');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
