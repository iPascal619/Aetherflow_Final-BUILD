// AetherFlow Backend API Configuration
// This file provides the backend API for enhanced AI responses using OpenAI

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Groq Configuration (Free AI API)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_free_api_key_placeholder',
});

// Debug: Check if API key is loaded
console.log('🔑 Groq API Key loaded:', process.env.GROQ_API_KEY ? 'Yes (length: ' + process.env.GROQ_API_KEY.length + ')' : 'No - using placeholder');
console.log('🌐 Environment:', process.env.NODE_ENV || 'development');

// Health companion system prompt
const SYSTEM_PROMPT = `You are AetherFlow Assistant, a professional medical AI companion. Your role is to:

1. Provide helpful, accurate health information
2. Encourage users to seek professional medical care when appropriate
3. Offer emotional support and guidance
4. ALWAYS prioritize user safety
5. Be empathetic, clear, and professional

IMPORTANT GUIDELINES:
- For emergencies, immediately advise calling emergency services
- For serious symptoms, recommend consulting healthcare providers
- Provide general health education, not specific medical diagnoses
- Be supportive but emphasize the importance of professional medical care
- Keep responses concise but comprehensive
- Use encouraging, caring language

NEVER:
- Provide specific medical diagnoses
- Recommend specific medications or dosages
- Replace professional medical advice
- Dismiss serious symptoms`;

// Language-specific prompts
const LANGUAGE_PROMPTS = {
    'en': 'Respond in clear, professional English.',
    'sw': 'Respond in Swahili (Kiswahili) with cultural sensitivity.',
    'fr': 'Respond in French with appropriate medical terminology.',
    'rw': 'Respond in Kinyarwanda with cultural awareness.',
    'pcm': 'Respond in Nigerian Pidgin English, keeping it friendly and accessible.'
};

// Multiple Free AI Providers
const AI_PROVIDERS = {
    groq: {
        client: groq,
        models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
        free: true,
        name: 'Groq (Llama 3.1)'
    },
    // Add more free providers here as fallbacks
};

// Function to try multiple AI providers
async function getAIResponse(message, language, systemPrompt) {
    const errors = [];
    
    // Try Groq first (completely free)
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: systemPrompt + '\n\n' + LANGUAGE_PROMPTS[language]
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 300,
            temperature: 0.7,
            top_p: 0.9
        });
        
        return {
            response: completion.choices[0].message.content.trim(),
            provider: 'groq',
            model: 'llama-3.1-70b-versatile'
        };
    } catch (error) {
        errors.push(`Groq: ${error.message}`);
        console.log('Groq failed, trying alternatives...');
    }
    
    // Try with a different Groq model
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant", // Faster, smaller model
            messages: [
                {
                    role: "system",
                    content: systemPrompt + '\n\n' + LANGUAGE_PROMPTS[language]
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 300,
            temperature: 0.7
        });
        
        return {
            response: completion.choices[0].message.content.trim(),
            provider: 'groq',
            model: 'llama-3.1-8b-instant'
        };
    } catch (error) {
        errors.push(`Groq Instant: ${error.message}`);
    }
    
    // If all free APIs fail, throw error for fallback
    throw new Error(`All AI providers failed: ${errors.join(', ')}`);
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message, context, language = 'en' } = req.body;
    
    try {
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Emergency detection
        const emergencyKeywords = [
            'emergency', 'urgent', 'chest pain', 'can\'t breathe', 
            'heart attack', 'stroke', 'unconscious', 'severe bleeding'
        ];
        
        const isEmergency = emergencyKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );

        if (isEmergency) {
            const emergencyResponse = language === 'en' 
                ? '🚨 EMERGENCY: If you are experiencing a life-threatening emergency, call emergency services immediately (911, 999, 112). Get to the nearest emergency room without delay.'
                : '🚨 DHARURA: Kama una hali ya dharura ya hatari ya maisha, piga simu za huduma za dharura mara moja (911, 999, 112). Enda hospitalini bila kuchelewa.';
            
            return res.json({ 
                response: emergencyResponse,
                isEmergency: true,
                timestamp: new Date().toISOString()
            });
        }

        // Prepare the conversation
        const conversationPrompt = `${SYSTEM_PROMPT}\n\n${LANGUAGE_PROMPTS[language]}\n\nUser: ${message}\n\nAssistant:`;

        // Call AI providers
        const aiResult = await getAIResponse(message, language, SYSTEM_PROMPT);

        res.json({
            response: aiResult.response,
            isEmergency: false,
            timestamp: new Date().toISOString(),
            model: aiResult.model,
            provider: aiResult.provider,
            language: language
        });

    } catch (error) {
        console.error('AI Provider Error:', error);
        
        // Fallback response
        const fallbackResponse = language === 'en'
            ? 'I apologize, but I\'m currently unable to provide a detailed response. For health concerns, please consult with a healthcare provider.'
            : 'Samahani, lakini kwa sasa siwezi kutoa jibu la kina. Kwa maswali ya afya, tafadhali shauriana na mtoa huduma za afya.';

        res.json({
            response: fallbackResponse,
            isEmergency: false,
            timestamp: new Date().toISOString(),
            error: 'AI service temporarily unavailable',
            fallback: true,
            provider: 'offline'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'AetherFlow AI API',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🩺 AetherFlow AI API running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
