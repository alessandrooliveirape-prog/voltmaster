import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTechnicalAdvice = async (
  prompt: string,
  context: 'norm' | 'general' | 'safety',
  language: Language
): Promise<string> => {
  let systemInstruction = "You are VoltMaster AI, a Premium Senior Electrical Engineer Consultant. You provide high-level, authoritative, and precise technical advice.";
  
  // Language injection
  const langInstruction = language === 'pt' ? "Respond ONLY in Portuguese (PT-BR)." 
    : language === 'es' ? "Respond ONLY in Spanish." 
    : "Respond in English.";

  systemInstruction += ` ${langInstruction}`;
  
  if (context === 'norm') {
    systemInstruction += " Focus strictly on technical regulations (IEC 60364, NEC, NBR 5410). Cite specific articles and clauses. Be academic yet practical.";
  } else if (context === 'safety') {
    systemInstruction += " Prioritize human safety above all. Cite OSHA/NR-10 standards. Provide step-by-step risk mitigation protocols.";
  } else {
    systemInstruction += " Provide practical, field-proven engineering advice. Be concise, professional, and direct. Avoid fluff.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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