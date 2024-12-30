import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  List,
  ListItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { database } from '../firebase';
import { ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    try {
      const messagesRef = ref(database, 'messages');
      const messagesQuery = query(
        messagesRef,
        orderByChild('timestamp'),
        limitToLast(50)
      );

      const unsubscribe = onValue(messagesQuery, (snapshot) => {
        setLoading(false);
        const data = snapshot.val();
        if (data) {
          const messagesList = Object.entries(data)
            .map(([key, value]) => ({
              id: key,
              ...value
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setMessages(messagesList);
        }
      }, (error) => {
        console.error('Erreur de lecture:', error);
        setError('Erreur de connexion à la base de données');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erreur d\'initialisation:', error);
      setError('Erreur de connexion au chat');
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        text: message,
        userId: currentUser.uid,
        userName: currentUser.email,
        timestamp: Date.now()
      });
      setMessage('');
      setError(null);
    } catch (error) {
      console.error('Erreur d\'envoi:', error);
      setError('Erreur d\'envoi du message');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ flex: 1, mb: 2, p: 2, maxHeight: '400px', overflow: 'auto' }}>
        {messages.length === 0 ? (
          <Typography color="textSecondary" align="center">
            Aucun message. Soyez le premier à écrire !
          </Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <ListItem 
                key={msg.id}
                sx={{
                  justifyContent: msg.userId === currentUser.uid ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Paper 
                  elevation={2}
                  sx={{
                    p: 1,
                    maxWidth: '80%',
                    backgroundColor: msg.userId === currentUser.uid ? '#e3f2fd' : '#f5f5f5'
                  }}
                >
                  <Typography variant="caption" display="block" color="textSecondary">
                    {msg.userName}
                  </Typography>
                  <Typography>{msg.text}</Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tapez votre message..."
          variant="outlined"
          size="small"
          disabled={!!error}
        />
        <Button 
          type="submit" 
          variant="contained"
          disabled={!message.trim() || !!error}
        >
          Envoyer
        </Button>
      </Box>
    </Box>
  );
};

export default Chat; 