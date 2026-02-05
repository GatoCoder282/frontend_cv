'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute - Estado:', {
      isLoading,
      isAuthenticated,
      isAdmin,
      user,
    });

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('No autenticado, redirigiendo a /login');
        router.push('/login');
      } else if (!isAdmin) {
        console.log('Autenticado pero no es admin, redirigiendo a /');
        router.push('/');
      } else {
        console.log('Usuario autenticado y es admin, permitiendo acceso');
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, user, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
