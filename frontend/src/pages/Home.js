import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur Google Sign In:', error);
      setError('Erreur lors de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur authentification:', error);
      setError(isSignUp ? "Erreur lors de l'inscription" : 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          REN
        </Typography>
        
        <Paper sx={{ p: 4, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Continuer avec Google'}
          </Button>

          <Divider sx={{ my: 2 }}>OU</Divider>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              disabled={loading}
              required
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={loading}
              required
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : (isSignUp ? "S'inscrire" : "Se connecter")}
            </Button>
          </form>

          <Button
            fullWidth
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {isSignUp ? "Déjà un compte ? Connectez-vous" : "Créer un compte"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 