'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Folder,
  Person,
  Work,
  Code,
  People,
  Share,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Proyectos', icon: <Folder />, path: '/admin/projects' },
  { text: 'Perfil', icon: <Person />, path: '/admin/profile' },
  { text: 'Experiencia', icon: <Work />, path: '/admin/experience' },
  { text: 'Tecnologías', icon: <Code />, path: '/admin/technologies' },
  { text: 'Clientes', icon: <People />, path: '/admin/clients' },
  { text: 'Redes Sociales', icon: <Share />, path: '/admin/social' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo/Brand */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CMS Admin
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Sistema de Gestión
        </Typography>
      </Box>

      {/* User Info */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            color: '#000',
            width: 48,
            height: 48,
            fontWeight: 'bold',
          }}
        >
          {user?.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight="600" noWrap>
            {user?.username}
          </Typography>
          <Chip
            label={user?.role.toUpperCase()}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: 'rgba(0, 229, 255, 0.2)',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => router.push(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 229, 255, 0.1)',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout */}
      <ListItem disablePadding sx={{ p: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'rgba(255, 0, 0, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Panel de Administración
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  );
}