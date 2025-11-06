
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MessageRole } from '../types';
import type { GroundingSource } from '../types';

// Ensure this environment variable is set in your deployment environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A more sophisticated app might handle this more gracefully
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const MODEL_NAME = 'gemini-2.5-flash';

interface GeminiChatResponse {
  text: string;
  sources: GroundingSource[];
}

// Manages chat history and gets a response from Gemini with search grounding.
export const getChatResponse = async (history: ChatMessage[], appContext: string, language: string): Promise<GeminiChatResponse> => {
  try {
    const languageInstruction = `The user's current language is ${language}. Please respond in this language.`;
    
    const systemInstruction = `You are a helpful AI assistant for a sensor data dashboard application.
You can answer questions about the sensor data, the bluetooth connection status, and general queries.
${languageInstruction}
Use the following real-time application context to inform your answers. Do not mention that you were given this context unless asked.
---
CONTEXT:
${appContext}
---
`;

    const contents = history.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string, title: string } => web !== undefined && web.uri !== undefined)
      .map(web => ({ uri: web.uri, title: web.title || web.uri }));


    return { text, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      text: "Sorry, I encountered an error. Please check the console for details.",
      sources: []
    };
  }
};
