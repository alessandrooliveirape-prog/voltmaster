import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Loader2, BookOpen, ShieldAlert, Cpu, 
  Settings, Key, Check, Copy, Sparkles, ExternalLink, X 
} from 'lucide-react';
import { 
  generateTechnicalAdvice, 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredModel, 
  setStoredModel, 
  AVAILABLE_MODELS 
} from '../services/geminiService';
import { Message } from '../types';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

export const AIConsultant: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: t('ai.welcome')
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextMode, setContextMode] = useState<'general' | 'norm' | 'safety'>('general');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(getStoredModel());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKeyInput(getStoredApiKey());
    setSelectedModel(getStoredModel());
  }, []);

  // Update initial message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{
        id: '1',
        role: 'model',
        text: t('ai.welcome')
      }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || inputText).trim();
    if (!promptText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: promptText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await generateTechnicalAdvice(userMsg.text, contextMode, language);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: error?.message || t('ai.error'),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveSettings = () => {
    setStoredApiKey(apiKeyInput);
    setStoredModel(selectedModel);
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowSettings(false);
    }, 1200);
  };

  const quickPrompts = [
    { label: 'NBR 5410 Queda de Tensão', prompt: 'Qual o limite de queda de tensão segundo a NBR 5410 para circuitos terminais e alimentadores?' },
    { label: 'Dimensionamento Solar Fotovoltaico', prompt: 'Como calcular a potência em kWp e quantidade de painéis solares para consumo de 600 kWh/mês com HSP de 5.2?' },
    { label: 'Partida de Motores Elétricos', prompt: 'Quando devo usar partida direta, estrela-triângulo ou soft-starter para um motor trifásico de 15 CV?' },
    { label: 'Segurança NR-10 & LOTO', prompt: 'Quais os 6 passos obrigatórios para desenergização e liberação segura de painel elétrico segundo a NR-10?' },
    { label: 'Disjuntores e Coordenação', prompt: 'Como escolher a curva do disjuntor (B, C ou D) para circuitos de iluminação, tomadas e motores?' },
  ];

  const getPlaceholder = () => {
    switch (contextMode) {
      case 'norm': return t('ai.placeholder.norm');
      case 'safety': return t('ai.placeholder.safety');
      default: return t('ai.placeholder.general');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 pb-safe transition-colors duration-300">
      {/* Header / Mode Selector */}
      <div className="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Bot className="mr-2 text-amber-500" /> {t('ai.title')}
          </h2>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Configurações de IA (Chave API & Modelo)"
            aria-label="Configurações de IA"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            onClick={() => setContextMode('general')}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              contextMode === 'general' 
                ? 'bg-amber-100 dark:bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Cpu size={14} className="mr-1" /> {t('ai.mode.general')}
          </button>
          <button 
            onClick={() => setContextMode('norm')}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              contextMode === 'norm' 
                ? 'bg-blue-100 dark:bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen size={14} className="mr-1" /> {t('ai.mode.norm')}
          </button>
          <button 
            onClick={() => setContextMode('safety')}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              contextMode === 'safety' 
                ? 'bg-red-100 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldAlert size={14} className="mr-1" /> {t('ai.mode.safety')}
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/60 overflow-x-auto flex gap-2 scrollbar-hide">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap transition-colors shadow-xs"
          >
            <Sparkles size={11} className="text-amber-500" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-4 shadow-sm relative group ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-sm'
                  : msg.isError 
                    ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-tl-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`flex items-center text-[10px] uppercase tracking-wider font-bold ${
                    msg.role === 'user' ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {msg.role === 'user' ? <User size={11} className="mr-1" /> : <Bot size={11} className="mr-1 text-amber-500" />}
                  {msg.role === 'user' ? 'Engenheiro' : 'VoltMaster AI'}
                </div>
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="text-slate-400 hover:text-amber-500 p-1 rounded transition-colors"
                    title="Copiar resposta"
                  >
                    {copiedId === msg.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  </button>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed prose dark:prose-invert max-w-none text-inherit">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 rounded-tl-sm border border-slate-200 dark:border-slate-700 flex items-center shadow-sm">
              <Loader2 className="animate-spin text-amber-500 mr-2" size={16} />
              <span className="text-slate-500 dark:text-slate-400 text-sm">{t('ai.analyzing')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={getPlaceholder()}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm"
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={isLoading || !inputText.trim()}
            className="rounded-xl !px-4 !py-3 bg-amber-500 hover:bg-amber-600 text-white shadow-md"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center px-4">
          {t('ai.disclaimer')}
        </p>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="text-amber-500" size={20} />
                Configurações da IA (Gemini)
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key size={13} className="text-amber-500" />
                  Chave de API Gemini (Google AI Studio)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  A chave é salva de forma segura no seu navegador (localStorage).
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline inline-flex items-center ml-1"
                  >
                    Obter chave gratuita <ExternalLink size={10} className="ml-0.5" />
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Cpu size={13} className="text-amber-500" />
                  Modelo de IA
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {keySavedMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <Check size={16} /> Configurações salvas com sucesso!
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
