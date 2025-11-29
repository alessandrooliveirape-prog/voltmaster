
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { generateTechnicalAdvice } from '../services/geminiService';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
        setMessages([{
            id: '1',
            role: 'model',
            text: t('ai.welcome')
        }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Pass language to the service
      const responseText = await generateTechnicalAdvice(userMsg.text, contextMode, language);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: t('ai.error'),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (contextMode) {
      case 'norm': return t('ai.placeholder.norm');
      case 'safety': return t('ai.placeholder.safety');
      default: return t('ai.placeholder.general');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900 pb-safe">
      {/* Header / Mode Selector */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center">
          <Bot className="mr-2 text-amber-500" /> {t('ai.title')}
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setContextMode('general')}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              contextMode === 'general' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Cpu size={14} className="mr-1" /> {t('ai.mode.general')}
          </button>
          <button 
            onClick={() => setContextMode('norm')}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              contextMode === 'norm' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <BookOpen size={14} className="mr-1" /> {t('ai.mode.norm')}
          </button>
          <button 
            onClick={() => setContextMode('safety')}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              contextMode === 'safety' ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <ShieldAlert size={14} className="mr-1" /> {t('ai.mode.safety')}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-sm'
                  : msg.isError 
                    ? 'bg-red-900/50 border border-red-800 text-red-200 rounded-tl-sm'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
              }`}
            >
              <div className="flex items-center mb-1 opacity-50 text-[10px] uppercase tracking-wider font-bold">
                {msg.role === 'user' ? <User size={10} className="mr-1" /> : <Bot size={10} className="mr-1" />}
                {msg.role === 'user' ? 'You' : 'VoltMaster AI'}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-sm border border-slate-700 flex items-center">
              <Loader2 className="animate-spin text-amber-500 mr-2" size={16} />
              <span className="text-slate-400 text-sm">{t('ai.analyzing')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={getPlaceholder()}
            className="flex-1 bg-slate-800 text-white placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !inputText.trim()}
            className="rounded-xl !px-4 !py-3"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
