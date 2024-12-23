import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Après connexion réussie, rediriger vers le dashboard
      navigate('/dashboard');
      return result.user;
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      return result.user;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      return result.user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    signUp,
    signIn,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 