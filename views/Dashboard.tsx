
import React, { useRef } from 'react';
import { ViewState, Language, Theme } from '../types';
import { Button } from '../components/Button';
import { Activity, MessageSquare, Plus, Download, Upload, Moon, Sun, Monitor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const exportBackup = () => {
    const projects = localStorage.getItem('voltmaster_projects');
    if (!projects) return;
    const blob = new Blob([projects], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voltmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
           const json = JSON.parse(result);
           if (Array.isArray(json)) {
             localStorage.setItem('voltmaster_projects', JSON.stringify(json));
             alert(t('dash.backup_success'));
             // Optional: Force reload to ensure state is fresh
             window.location.reload();
           } else {
             alert(t('dash.backup_error'));
           }
        }
      } catch (err) {
        console.error(err);
        alert(t('dash.backup_error'));
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openRateUs = () => {
    window.open('https://play.google.com/store/apps', '_blank');
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-xl font-medium text-slate-500 dark:text-slate-400">{t('dash.welcome')}</h1>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('dash.engineer')}</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/20">
            E
          </div>
          {/* Language Selector */}
          <div className="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            {(['pt', 'en', 'es'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase ${
                  language === lang 
                    ? 'bg-amber-500 text-slate-900' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Theme</span>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
              theme === 'light' 
                ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Sun size={12} /> {t('theme.light')}
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 text-amber-500 shadow-sm ring-1 ring-white/10' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Moon size={12} /> {t('theme.dark')}
          </button>
          <button
            onClick={() => handleThemeChange('auto')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
              theme === 'auto' 
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Monitor size={12} /> {t('theme.auto')}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => onNavigate(ViewState.CALC_VOLTAGE_DROP)}
          className="h-24 flex flex-col items-center justify-center space-y-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-50 shadow-sm"
        >
          <Activity className="text-amber-500" size={24} />
          <span className="text-sm text-center font-medium">{t('dash.calc_voltage')}</span>
        </Button>
        <Button 
          onClick={() => onNavigate(ViewState.AI_CONSULTANT)}
          className="h-24 flex flex-col items-center justify-center space-y-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-50 shadow-sm"
        >
          <MessageSquare className="text-blue-500" size={24} />
          <span className="text-sm text-center font-medium">{t('dash.ask_ai')}</span>
        </Button>
      </div>

      {/* Recent Activity / Stats */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">{t('dash.daily_summary')}</h3>
          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{t('dash.today')}</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{t('dash.calcs_performed')}</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">12</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{t('dash.pending_projects')}</span>
            <span className="font-mono text-amber-500 font-bold">3</span>
          </div>
          <div className="pt-2">
            <Button 
              variant="ghost" 
              fullWidth 
              className="text-xs !py-2 border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => onNavigate(ViewState.PROJECTS)}
            >
              <Plus size={14} className="mr-1" /> {t('dash.add_note')}
            </Button>
          </div>
        </div>
      </div>

      {/* Data Safety / Backup */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm flex items-center">
            {t('dash.backup_title')}
        </h3>
        <div className="flex gap-3">
             <Button 
                variant="secondary" 
                fullWidth 
                className="text-xs !py-2 !bg-slate-100 !text-slate-800 hover:!bg-slate-200 border border-slate-200 dark:!bg-slate-700 dark:!text-slate-50 dark:hover:!bg-slate-600 dark:border-transparent"
                onClick={exportBackup}
             >
                <Download size={14} className="mr-1" /> {t('dash.backup_export')}
             </Button>
             <Button 
                variant="secondary" 
                fullWidth 
                className="text-xs !py-2 !bg-slate-100 !text-slate-800 hover:!bg-slate-200 border border-slate-200 dark:!bg-slate-700 dark:!text-slate-50 dark:hover:!bg-slate-600 dark:border-transparent"
                onClick={triggerImport}
             >
                <Upload size={14} className="mr-1" /> {t('dash.backup_import')}
             </Button>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleImport}
             />
        </div>
      </div>

      {/* Rate Us Card */}
      <div className="bg-gradient-to-r from-amber-50 to-white dark:from-amber-500/10 dark:to-transparent rounded-xl p-4 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between shadow-sm">
        <div className="flex-1 mr-4">
          <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500 mb-1">{t('dash.rate_title')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('dash.rate_desc')}</p>
        </div>
        <Button 
          onClick={openRateUs}
          className="text-xs px-3 py-2 bg-amber-500 text-slate-900 whitespace-nowrap shadow-md shadow-amber-500/20"
        >
          {t('dash.rate_btn')}
        </Button>
      </div>

      {/* Tip of the day */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 border-l-4 border-l-amber-500 shadow-sm">
        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1">{t('dash.tip_title')}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 italic">
          {t('dash.tip_text')}
        </p>
      </div>
    </div>
  );
};
