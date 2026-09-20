import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Rápido & Inteligente - Recomendado)' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Raciocínio Avançado & Normas)' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Baixa Latência)' },
];

export const getStoredApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('voltmaster_gemini_api_key');
    if (local && local.trim()) return local.trim();
  }
  if (typeof process !== 'undefined') {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    if (process.env.API_KEY) return process.env.API_KEY;
  }
  return '';
};

export const setStoredApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('voltmaster_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('voltmaster_gemini_api_key');
    }
  }
};

export const getStoredModel = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('voltmaster_gemini_model');
    if (local && local.trim()) return local.trim();
  }
  return 'gemini-2.5-flash';
};

export const setStoredModel = (model: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('voltmaster_gemini_model', model);
  }
};

const getAiClient = (): GoogleGenAI | null => {
  const apiKey = getStoredApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateTechnicalAdvice = async (
  prompt: string,
  context: 'norm' | 'general' | 'safety',
  language: Language
): Promise<string> => {
  let systemInstruction = "You are VoltMaster AI, a Senior Electrical Engineer Consultant with 20+ years of industrial, commercial, and residential field experience. You provide high-level, authoritative, structured, and precise technical advice.";
  
  const langInstruction = language === 'pt' ? "Respond ONLY in Portuguese (PT-BR). Format with clear markdown bullet points, bold key figures, formulas, and actionable steps." 
    : language === 'es' ? "Respond ONLY in Spanish. Format with clear markdown bullet points, bold key figures, formulas, and actionable steps." 
    : "Respond in English. Format with clear markdown bullet points, bold key figures, formulas, and actionable steps.";

  systemInstruction += ` ${langInstruction}`;
  
  if (context === 'norm') {
    systemInstruction += " Focus strictly on technical regulations (NBR 5410, NBR 5419, IEC 60364, NEC NFPA 70). Always cite specific sections, tables, and standard clauses. Provide exact mathematical criteria.";
  } else if (context === 'safety') {
    systemInstruction += " Prioritize human safety and asset protection above all. Cite NR-10, OSHA, NFPA 70E standards. Provide step-by-step de-energization (LOTO - Lockout/Tagout), PPE categorization, and risk mitigation protocols.";
  } else {
    systemInstruction += " Provide practical, field-proven engineering advice. Include cable sizing rules of thumb, voltage drop limits, breaker coordination, and efficiency optimization.";
  }

  const ai = getAiClient();
  
  // Se não houver chave API configurada, retornar resposta simulada rica e orientar configuração
  if (!ai) {
    if (language === 'pt') {
      return `### ⚡ Consultor VoltMaster (Modo Local / Demonstração)

Você perguntou: *"${prompt}"*

**Recomendações Técnicas de Engenharia:**
- **Norma Aplicável:** NBR 5410:2004 (Instalações elétricas de baixa tensão) e NR-10 (Segurança em Instalações e Serviços em Eletricidade).
- **Critérios de Dimensionamento:**
  1. *Capacidade de Condução de Corrente:* Corrigir $I_z$ com fatores de agrupamento ($FCT$) e temperatura ($FCA$).
  2. *Queda de Tensão Máxima:* 4% para circuitos terminais e 2% para alimentadores (total máximo 5% a partir da medição).
  3. *Proteção:* Disjuntores termomagnéticos com corrente nominal $I_n$ tal que $I_b \\le I_n \\le I_z$.

> 💡 **Dica:** Para habilitar consultas em tempo real personalizadas pelo **Google Gemini 2.5**, clique no ícone de engrenagem ⚙️ acima e configure sua chave de API gratuita do Google AI Studio.`;
    } else if (language === 'es') {
      return `### ⚡ Consultor VoltMaster (Modo Local / Demostración)

Consulta: *"${prompt}"*

**Recomendaciones Técnicas:**
- **Normativa:** IEC 60364 / Reglamento Electrotécnico de Baja Tensión.
- **Criterios Clave:**
  1. Capacidad de corriente admisible considerando temperatura ambiente y agrupamiento.
  2. Caída de tensión máxima recomendada (3% a 5%).
  3. Coordinación de interruptores automáticos magneto-térmicos y diferenciales.

> 💡 **Nota:** Para activar la IA en vivo con Google Gemini 2.5, configure su clave de API gratuita en el botón de ajustes ⚙️.`;
    } else {
      return `### ⚡ VoltMaster Consultant (Local Demo Mode)

Query: *"${prompt}"*

**Engineering Guidelines:**
- **Standard Reference:** NEC (NFPA 70) / IEC 60364.
- **Design Parameters:**
  1. Conductor ampacity adjusted for ambient temp & conduit raceway fill.
  2. Maximum voltage drop limit: 3% on branch circuit, 5% overall.
  3. Overcurrent protection sizing: $I_b \\le I_n \\le I_z$.

> 💡 **Tip:** Configure your free Google AI Studio API key in the settings ⚙️ to enable full real-time Gemini 2.5 technical reasoning.`;
    }
  }

  const preferredModel = getStoredModel();
  const modelsToTry = [preferredModel, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Tentativa com ${modelName} falhou:`, err?.message || err);
      lastError = err;
    }
  }

  console.error("Gemini API Error após tentativas:", lastError);
  throw new Error("Não foi possível consultar a IA. Verifique sua chave de API nas configurações ou tente novamente.");
};