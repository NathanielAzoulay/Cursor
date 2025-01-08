import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import SupportPage from './pages/SupportPage';
import AnalyticsPage from './pages/AnalyticsPage';
import EvaluationPage from './pages/EvaluationPage';
import FinancePage from './pages/FinancePage';
import AddProperty from './pages/AddProperty';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#9c27b0',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/support" element={
          <PrivateRoute>
            <SupportPage />
          </PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute>
            <AnalyticsPage />
          </PrivateRoute>
        } />
        <Route path="/evaluation" element={
          <PrivateRoute>
            <EvaluationPage />
          </PrivateRoute>
        } />
        <Route path="/finance" element={
          <PrivateRoute>
            <FinancePage />
          </PrivateRoute>
        } />
        <Route path="/add-property" element={
          <PrivateRoute>
            <AddProperty />
          </PrivateRoute>
        } />
      </Routes>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 