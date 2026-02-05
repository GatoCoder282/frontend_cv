'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login Form
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register Form
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('AuthPage - Intentando login con:', loginData.email);
      await login(loginData.email, loginData.password);
      console.log('AuthPage - Login exitoso, redirigiendo...');
      setSuccess('¡Bienvenido! Redirigiendo...');
      setTimeout(() => {
        console.log('AuthPage - Ejecutando redirección a /admin');
        router.push('/admin');
      }, 1000);
    } catch (err: any) {
      console.error('AuthPage - Error en login:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(registerData.username, registerData.email, registerData.password);
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTab(0);
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0.5,
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.1)',
            opacity: 0.8,
          },
        },
        p: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
              color: '#000',
              py: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                animation: 'shine 3s infinite',
              },
              '@keyframes shine': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 64, mb: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
            <Typography variant="h4" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              CMS Portfolio
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Panel de Administración
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            centered
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
              },
            }}
          >
            <Tab icon={<LoginIcon />} label="Iniciar Sesión" iconPosition="start" />
            <Tab icon={<PersonAdd />} label="Registrarse" iconPosition="start" />
          </Tabs>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ m: 2, mb: 0 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ m: 2, mb: 0 }}>
              {success}
            </Alert>
          )}

          {/* Login Tab */}
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleLogin} sx={{ px: 3 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </Box>
          </TabPanel>

          {/* Register Tab */}
          <TabPanel value={tab} index={1}>
            <Box component="form" onSubmit={handleRegister} sx={{ px: 3 }}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                required
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                required
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </Box>
          </TabPanel>

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background: 'linear-gradient(180deg, transparent 0%, rgba(0, 229, 255, 0.05) 100%)',
              textAlign: 'center',
              borderTop: '1px solid rgba(0, 229, 255, 0.1)',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Sistema de Gestión de Portfolio © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
