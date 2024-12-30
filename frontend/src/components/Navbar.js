import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <Typography variant="h6" component={RouterLink} to="/" sx={{ 
          flexGrow: 1,
          textDecoration: 'none',
          color: 'inherit'
        }}>
          REN
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentUser ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenu}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={RouterLink} to="/dashboard" onClick={handleClose}>
                  Dashboard
                </MenuItem>
                <MenuItem component={RouterLink} to="/analytics" onClick={handleClose}>
                  Analyses
                </MenuItem>
                <MenuItem component={RouterLink} to="/evaluation" onClick={handleClose}>
                  Évaluation
                </MenuItem>
                <MenuItem component={RouterLink} to="/finance" onClick={handleClose}>
                  Finance
                </MenuItem>
                <MenuItem component={RouterLink} to="/support" onClick={handleClose}>
                  Support
                </MenuItem>
              </Menu>
              <Button 
                color="inherit"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
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