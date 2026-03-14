import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const groqClient = apiKey
  ? new Groq({ apiKey, dangerouslyAllowBrowser: true })
  : undefined;

export const isGroqConfigured = Boolean(apiKey);
