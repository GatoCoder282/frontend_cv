'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00bcd4',
      light: '#62efff',
      dark: '#008ba3',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(0, 229, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 229, 255, 0.1)',
    '0px 4px 8px rgba(0, 229, 255, 0.15)',
    '0px 6px 12px rgba(0, 229, 255, 0.2)',
    '0px 8px 16px rgba(0, 229, 255, 0.25)',
    '0px 10px 20px rgba(0, 229, 255, 0.3)',
    '0px 12px 24px rgba(0, 229, 255, 0.35)',
    '0px 14px 28px rgba(0, 229, 255, 0.4)',
    '0px 16px 32px rgba(0, 229, 255, 0.45)',
    '0px 18px 36px rgba(0, 229, 255, 0.5)',
    '0px 20px 40px rgba(0, 229, 255, 0.55)',
    '0px 22px 44px rgba(0, 229, 255, 0.6)',
    '0px 24px 48px rgba(0, 229, 255, 0.65)',
    '0px 26px 52px rgba(0, 229, 255, 0.7)',
    '0px 28px 56px rgba(0, 229, 255, 0.75)',
    '0px 30px 60px rgba(0, 229, 255, 0.8)',
    '0px 32px 64px rgba(0, 229, 255, 0.85)',
    '0px 34px 68px rgba(0, 229, 255, 0.9)',
    '0px 36px 72px rgba(0, 229, 255, 0.95)',
    '0px 38px 76px rgba(0, 229, 255, 1)',
    '0px 40px 80px rgba(0, 229, 255, 1)',
    '0px 42px 84px rgba(0, 229, 255, 1)',
    '0px 44px 88px rgba(0, 229, 255, 1)',
    '0px 46px 92px rgba(0, 229, 255, 1)',
    '0px 48px 96px rgba(0, 229, 255, 1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: '0 4px 12px rgba(0, 229, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 229, 255, 0.5)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)',
          border: '1px solid rgba(0, 229, 255, 0.1)',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0, 229, 255, 0.1)',
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0, 229, 255, 0.2)',
        },
        elevation3: {
          boxShadow: '0 12px 32px rgba(0, 229, 255, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0, 229, 255, 0.2)',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 229, 255, 0.35)',
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(26, 26, 26, 0.8)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRight: '1px solid rgba(0, 229, 255, 0.2)',
          boxShadow: '4px 0 20px rgba(0, 229, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e5ff',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#00e5ff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 229, 255, 0.2)',
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default theme;
