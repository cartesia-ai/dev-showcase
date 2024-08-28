import { WebSocketServer } from 'ws';

import http from 'http';
import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import humanId from 'human-id';
import Cartesia from "@cartesia/cartesia-js";
import next from 'next';
import dotenv from 'dotenv';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

   const server = http.createServer(app);
   const wss = new WebSocketServer({ server });

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  const upload = multer({ storage: multer.memoryStorage() });
  
  dotenv.config({ path: '.env.local' });
  const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const calls = new Map(); 
  const clientLanguages = new Map();

  wss.on('connection', (ws) => {
    
    const clientId = Date.now().toString();
    console.log("CLIENT ID : ", clientId)
    clientLanguages.set(clientId, 'en');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'createCall') {
          const callId = humanId.humanId({
            separator: '-',
            capitalize: false
          });
          calls.set(callId, new Set([ws]));
          ws.callId = callId;
          ws.send(JSON.stringify({ type: 'callCreated', callId }));
        } else if (data.type === 'joinCall') {
          const { callId } = data;
          if (calls.has(callId)) {
            calls.get(callId).add(ws);
            ws.callId = callId;
            ws.send(JSON.stringify({ type: 'callJoined', callId }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Call not found' }));
          }
        } else if (data.type === 'language') {
          ws.language = data.language;
          // clients.get(clientId).language = data.language;
          clientLanguages.set(clientId, data.language);
          broadcastLanguage(ws);
          console.log(`Language updated for client ${clientId} in call ${ws.callId}: ${data.language}`);
        } else if (data.type === 'voiceId') {
          ws.voiceId = data.voiceId;
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      if (ws.callId && calls.has(ws.callId)) {
        calls.get(ws.callId).delete(ws);
        if (calls.get(ws.callId).size === 0) {
          calls.delete(ws.callId);
        }
      }
      clientLanguages.delete(ws.clientId);
    });
  });

  function broadcastLanguage(sender) {
    if (sender.callId && calls.has(sender.callId)) {
      console.log(`Broadcasting language update in call ${sender.callId}`);
      calls.get(sender.callId).forEach(currentClient => {
        console.log("sender", sender.callId)
        console.log("client", currentClient.callId)
        if (currentClient !== sender && currentClient.readyState === WebSocket.OPEN) {
          currentClient.send(JSON.stringify({
            type: 'language',
            language: sender.language
          }));
        }
      });
    }
  }

  // Main function which transcribes and translates and sends data 
  app.post('/process-audio', upload.single('audio'), async (req, res) => {
    try {
      const voiceId = req.body.voiceId || "default-voice-id";
      const receiverLanguage = req.body.receiverLanguage;
      const callId = req.body.callId;
      
      const transcription = await getTranscript(req);
      console.log("TRANSCRIPTION", transcription);
      
      const translation = await translateText(transcription, receiverLanguage);
      console.log("TRANSLATION", translation);
  
      if (calls.has(callId)) {
        calls.get(callId).forEach(async (client) => {
          if (client.readyState === WebSocket.OPEN && client.language === receiverLanguage) {
            client.send(JSON.stringify({
              type: 'translation',
              translation: translation,
              voiceId: voiceId,
              language: receiverLanguage
            }));
          }
        });
      }
      
      res.status(200).json({ success: true, translation: translation });
    } catch (error) {
      console.error('Error processing audio:', error);
      res.status(500).json({ error: 'Failed to process audio' });
    }
  });  

  // Handles creating voice clone : generates embedding, localizes embedding, then creates a voices 
  app.post('/clone-voice', upload.single('voiceSample'), async (req, res) => {
    try {
      const form = new FormData();
      form.append('clip', req.file.buffer, {
        filename: 'voice_sample.wav',
        contentType: req.file.mimetype,
      });

      // Clone the voice
      const cloneResponse = await fetch('https://api.cartesia.ai/voices/clone/clip', {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2024-06-10',
          'X-API-Key': process.env.NEXT_PUBLIC_CARTESIA_API_KEY,
          ...form.getHeaders()
        },
        body: form
      });

      if (!cloneResponse.ok) {
        throw new Error(`Failed to clone voice: ${await cloneResponse.text()}`);
      }

      const clonedVoice = await cloneResponse.json();

      // Localize the voice
      const localizeResponse = await fetch('https://api.cartesia.ai/voices/localize', {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2024-06-10',
          'X-API-Key': process.env.NEXT_PUBLIC_CARTESIA_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          embedding: clonedVoice.embedding,
          language: req.body.receiverLanguage,
          original_speaker_gender: req.body.gender
        })
      });

      if (!localizeResponse.ok) {
        throw new Error(`Failed to localize voice: ${await localizeResponse.text()}`);
      }

      const localizedVoice = await localizeResponse.json();
      
      // Create a voice with the localized embedding
      const createVoiceResponse = await fetch('https://api.cartesia.ai/voices', {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2024-06-10',
          'X-API-Key': process.env.NEXT_PUBLIC_CARTESIA_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Localized Voice ${Date.now()}`,
          description: "A voice cloned and localized from an audio sample.",
          embedding: localizedVoice.embedding,
          language: req.body.receiverLanguage,
        })
      });

      if (!createVoiceResponse.ok) {
        throw new Error(`Failed to create voice: ${await createVoiceResponse.text()}`);
      }

      const createdVoice = await createVoiceResponse.json();
      res.json({ voiceId: createdVoice.id });
    } catch (error) {
      console.error('Error cloning voice:', error);
      res.status(500).json({ error: 'Failed to clone voice', details: error.message });
    }
  });

  // Helper function which transcribes audio of the sender
  async function getTranscript(rawAudio) {
    const form = new FormData();
    form.append('file', rawAudio.file.buffer, {
      filename: 'audio.webm',
      contentType: rawAudio.file.mimetype,
    });
    form.append('model', 'whisper-large-v3');
    form.append('temperature', '0');
    form.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return data.text.trim() || null;

  }

  // Helper function which translates text into the target language of the receiver 
  async function translateText(text, targetLanguage) {
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a TRANSLATOR. ONLY TRANSLATE THE INPUT TEXT INTO THE TARGET LANGUAGE. DO NOT INCLUDE ANYTHING BUT THE TRANSLATION`,
        },
        {
          role: "user",
          content: `Translate the following sentence into ${targetLanguage}; ONLY INCLUDE TRANSLATION, NOTHING ELSE: ${text}`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  }

  const PORT = 3010;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.all('*', (req, res) => nextHandler(req, res));

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server')
    server.close(() => {
      console.log('HTTP server closed')
      process.exit(0)
    })
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
      console.log('HTTP server closed')
      process.exit(0)
    })
  })

});
