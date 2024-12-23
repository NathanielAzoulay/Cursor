import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, push, onValue, set } from 'firebase/database';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const SupportPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const faqItems = [
    {
      question: "Comment estimer la rentabilité d'un bien ?",
      answer: "La rentabilité se calcule en divisant les revenus locatifs annuels par le prix d'achat du bien."
    },
    {
      question: "Quels sont les documents nécessaires pour louer un bien ?",
      answer: "Les documents principaux sont : contrat de location, état des lieux, attestation d'assurance..."
    }
  ];

  useEffect(() => {
    // Se connecter au chat en temps réel
    const chatRef = ref(database, 'chats/' + currentUser.uid);
    
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setChatMessages(messageList);
        scrollToBottom();
      }
    });

    // Créer un message de bienvenue si c'est une nouvelle conversation
    if (chatMessages.length === 0) {
      push(chatRef, {
        text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        sender: 'support',
        timestamp: Date.now(),
        isRead: false
      });
    }

    return () => unsubscribe();
  }, [currentUser.uid]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const chatRef = ref(database, 'chats/' + currentUser.uid);

    try {
      // Envoyer le message de l'utilisateur
      await push(chatRef, {
        text: message,
        sender: 'user',
        timestamp: Date.now(),
        isRead: false
      });

      // Réponse automatique basée sur des mots-clés
      const autoResponse = getAutoResponse(message.toLowerCase());
      
      // Envoyer la réponse automatique immédiatement
      await push(chatRef, {
        text: autoResponse,
        sender: 'support',
        timestamp: Date.now(),
        isRead: false
      });

      setMessage('');
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  // Fonction de réponse automatique basée sur des mots-clés
  const getAutoResponse = (message) => {
    const responses = {
      'prix': "Les prix varient selon la localisation. À Tel Aviv, le prix moyen est de 65,000₪/m², à Herzliya 45,000₪/m².",
      'loyer': "Pour estimer votre loyer, comptez environ 3-4% de la valeur du bien par an.",
      'document': "Les documents nécessaires sont : contrat de location, état des lieux, attestation d'assurance.",
      'maintenance': "Nous recommandons de prévoir 1% de la valeur du bien par an pour la maintenance.",
      'impôt': "L'impôt sur les revenus locatifs est d'environ 25% en Israël.",
      'investir': "Les meilleurs quartiers pour investir actuellement sont Florentin à Tel Aviv et Ramat Gan.",
      'default': "Je peux vous aider avec :\n- Estimation de prix\n- Calcul de rentabilité\n- Conseils d'investissement\n- Documents nécessaires\nQue souhaitez-vous savoir ?"
    };

    // Chercher des mots-clés dans le message
    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    return responses.default;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Support Client
      </Typography>

      {/* FAQ Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Questions Fréquentes
        </Typography>
        {faqItems.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Chat Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chat en direct
        </Typography>

        {/* Messages Container */}
        <Box
          ref={chatContainerRef}
          sx={{
            height: '400px',
            overflowY: 'auto',
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 1
          }}
        >
          {chatMessages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              {msg.sender === 'support' && (
                <Avatar
                  sx={{ 
                    bgcolor: 'primary.main',
                    mr: 1,
                    width: 32,
                    height: 32
                  }}
                >
                  S
                </Avatar>
              )}
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: msg.sender === 'user' ? 'primary.main' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body1">
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
              {msg.sender === 'user' && (
                <Avatar
                  sx={{
                    ml: 1,
                    width: 32,
                    height: 32,
                    bgcolor: 'secondary.main'
                  }}
                >
                  {currentUser.email[0].toUpperCase()}
                </Avatar>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={loading}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading || !message.trim()}
            endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Envoyer
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SupportPage; 