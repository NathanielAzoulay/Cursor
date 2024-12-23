const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Tu es un assistant immobilier expert en Israël. Réponds de manière concise et précise."
      }, {
        role: "user",
        content: req.body.message
      }],
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Erreur ChatGPT:', error);
    res.status(500).json({ error: 'Erreur lors de la génération de la réponse' });
  }
});

module.exports = router; 