import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Tabs,
  Tab,
  useTheme as useMuiTheme
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const muiTheme = useMuiTheme();

  const routes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/analytics', label: 'Analyses' },
    { path: '/evaluation', label: 'Évaluation' },
    { path: '/finance', label: 'Finance' },
    { path: '/support', label: 'Support' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert('Erreur lors de la déconnexion');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            textDecoration: 'none',
            color: 'inherit',
            flexShrink: 0,
            mr: 3
          }}
        >
          REN
        </Typography>

        {currentUser && (
          <Tabs 
            value={location.pathname}
            sx={{ 
              flexGrow: 1,
              '& .MuiTab-root': { color: 'inherit' }
            }}
          >
            {routes.map((route) => (
              <Tab
                key={route.path}
                label={route.label}
                value={route.path}
                component={RouterLink}
                to={route.path}
              />
            ))}
          </Tabs>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={toggleDarkMode} 
            color="inherit"
            sx={{ mr: 1 }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {currentUser ? (
            <Button 
              color="inherit"
              onClick={handleLogout}
              variant="outlined"
            >
              Déconnexion
            </Button>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
              variant="outlined"
            >
              Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 