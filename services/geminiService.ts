
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateTechnicalAdvice = async (
  prompt: string,
  context: 'norm' | 'general' | 'safety',
  language: Language
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure your environment.");
  }

  let systemInstruction = "You are an expert Senior Electrical Engineer assistant called VoltMaster AI.";
  
  // Language injection
  const langInstruction = language === 'pt' ? "Respond ONLY in Portuguese (PT-BR)." 
    : language === 'es' ? "Respond ONLY in Spanish." 
    : "Respond in English.";

  systemInstruction += ` ${langInstruction}`;
  
  if (context === 'norm') {
    systemInstruction += " Focus on technical regulations (IEC 60364, NEC, NBR 5410). Cite specific articles where possible. Be precise.";
  } else if (context === 'safety') {
    systemInstruction += " Prioritize safety above all else. Provide checklists and warning about potential arc flash or shock hazards.";
  } else {
    systemInstruction += " Provide practical, field-ready advice for electricians and engineers. Keep explanations concise and actionable.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature for more deterministic technical answers
      },
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to consult the technical database. Please try again.");
  }
};
