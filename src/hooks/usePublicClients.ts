"use client";

import { useState, useEffect } from 'react';
import { clientService } from '@/services/clientService';
import { ClientResponse } from '@/types/client';

/**
 * Hook para obtener los clientes públicos de un usuario
 * @param username - Username del usuario
 */
export function usePublicClients(username: string) {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await clientService.getPublicClients(username);
        setClients(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los clientes');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchClients();
    }
  }, [username]);

  return { clients, loading, error };
}
