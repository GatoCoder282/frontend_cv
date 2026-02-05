'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import {
  Person,
  Email,
  Security,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

// Un Dashboard simple para probar
export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          Panel de Control
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Bienvenido de vuelta, {user?.username}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* User Info Card */}
        <Box>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(0, 188, 212, 0.05) 100%)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="600">
                  Información Personal
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Nombre de Usuario
                  </Typography>
                  <Typography variant="h6">{user?.username}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Correo Electrónico
                    </Typography>
                    <Typography variant="body1">{user?.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Rol de Usuario
                    </Typography>
                    <Chip
                      label={user?.role.toUpperCase()}
                      size="small"
                      sx={{
                        mt: 0.5,
                        background: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
                        color: '#000',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Stats Card */}
        <Box>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 229, 255, 0.05) 100%)',
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Acceso Rápido
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Próximamente: Estadísticas y accesos directos a las secciones del CMS
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}