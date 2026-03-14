import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const geminiClient = apiKey ? new GoogleGenerativeAI(apiKey) : undefined;

export const isGeminiConfigured = Boolean(apiKey);
