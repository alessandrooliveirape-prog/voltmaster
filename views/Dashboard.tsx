
import React from 'react';
import { ViewState, Language } from '../types';
import { Button } from '../components/Button';
import { Activity, MessageSquare, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-xl font-medium text-slate-400">{t('dash.welcome')}</h1>
          <h2 className="text-3xl font-bold text-white tracking-tight">{t('dash.engineer')}</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/20">
            E
          </div>
          {/* Language Selector */}
          <div className="flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {(['pt', 'en', 'es'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase ${
                  language === lang 
                    ? 'bg-amber-500 text-slate-900' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => onNavigate(ViewState.CALC_VOLTAGE_DROP)}
          className="h-24 flex flex-col items-center justify-center space-y-2 bg-slate-800 border border-slate-700 hover:bg-slate-750"
        >
          <Activity className="text-amber-500" size={24} />
          <span className="text-sm text-center">{t('dash.calc_voltage')}</span>
        </Button>
        <Button 
          onClick={() => onNavigate(ViewState.AI_CONSULTANT)}
          className="h-24 flex flex-col items-center justify-center space-y-2 bg-slate-800 border border-slate-700 hover:bg-slate-750"
        >
          <MessageSquare className="text-blue-500" size={24} />
          <span className="text-sm text-center">{t('dash.ask_ai')}</span>
        </Button>
      </div>

      {/* Recent Activity / Stats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">{t('dash.daily_summary')}</h3>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{t('dash.today')}</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <span className="text-slate-400 text-sm">{t('dash.calcs_performed')}</span>
            <span className="font-mono text-white">12</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <span className="text-slate-400 text-sm">{t('dash.pending_projects')}</span>
            <span className="font-mono text-amber-500">3</span>
          </div>
          <div className="pt-2">
            <Button 
              variant="ghost" 
              fullWidth 
              className="text-xs !py-2 border border-dashed border-slate-600"
              onClick={() => onNavigate(ViewState.PROJECTS)}
            >
              <Plus size={14} className="mr-1" /> {t('dash.add_note')}
            </Button>
          </div>
        </div>
      </div>

      {/* Tip of the day */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 border-l-4 border-l-amber-500">
        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{t('dash.tip_title')}</h4>
        <p className="text-sm text-slate-300 italic">
          {t('dash.tip_text')}
        </p>
      </div>
    </div>
  );
};
