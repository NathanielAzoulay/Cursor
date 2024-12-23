import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportIcon from '@mui/icons-material/Support';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          REN
        </Typography>
        
        {currentUser && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button 
                color="inherit"
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate('/analytics')}
              >
                Analyses
              </Button>
              <Button 
                color="inherit"
                startIcon={<CalculateIcon />}
                onClick={() => navigate('/evaluation')}
              >
                Évaluation
              </Button>
              <Button 
                color="inherit"
                startIcon={<SupportIcon />}
                onClick={() => navigate('/support')}
              >
                Support
              </Button>
              <Button 
                color="inherit"
                startIcon={<AccountBalanceIcon />}
                onClick={() => navigate('/finance')}
              >
                Finances
              </Button>
              <Button 
                color="inherit"
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit"
                variant="outlined"
                onClick={logout}
              >
                Se déconnecter
              </Button>
            </Box>

            {/* Menu mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                color="inherit"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigation('/dashboard')}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/analytics')}>
                  Analyses
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/evaluation')}>
                  Évaluation
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/support')}>
                  Support
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/finance')}>
                  Finances
                </MenuItem>
                <MenuItem onClick={logout}>
                  Se déconnecter
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}

        {!currentUser && (
          <Button 
            color="inherit"
            variant="outlined"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 