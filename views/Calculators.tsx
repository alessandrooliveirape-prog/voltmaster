
import React from 'react';
import { Zap, Activity, Battery, Triangle, ShieldCheck, ClipboardCheck, Lock, ArrowUpRight } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CalculatorsProps {
  onNavigate: (view: ViewState) => void;
}

export const Calculators: React.FC<CalculatorsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const safetyTool = {
    id: ViewState.SAFETY_CHECKLIST,
    title: t('tools.safety'),
    description: t('tools.safety_desc'),
    icon: <ClipboardCheck className="text-emerald-600 dark:text-emerald-400" size={28} />,
    gradient: "from-emerald-50 to-white dark:from-emerald-900/40 dark:to-slate-800",
    border: "border-emerald-200 dark:border-slate-700 group-hover:border-emerald-500/50",
    status: 'Available'
  };

  const calcTools = [
    {
      id: ViewState.CALC_VOLTAGE_DROP,
      title: t('tools.voltage_drop'),
      icon: <Activity className="text-amber-500" size={24} />,
      status: 'Available'
    },
    {
      id: ViewState.CALC_BREAKER,
      title: t('tools.breaker'),
      icon: <ShieldCheck className="text-red-500" size={24} />,
      status: 'Available'
    },
    {
      id: ViewState.CALC_OHMS_LAW,
      title: t('tools.ohms_law'),
      icon: <Zap className="text-blue-500" size={24} />,
      status: 'Available'
    },
    {
      id: ViewState.CALC_CONDUIT_FILL,
      title: t('tools.conduit'),
      icon: <Battery className="text-green-500" size={24} />,
      status: 'Available'
    },
    {
      id: ViewState.CALC_POWER_FACTOR,
      title: t('tools.power_factor'),
      icon: <Triangle className="text-purple-500" size={24} />,
      status: 'Available'
    }
  ];

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('tools.title')}</h2>
      </div>

      {/* Featured Safety Card */}
      <section>
        <button
          onClick={() => onNavigate(safetyTool.id)}
          className={`w-full group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-900/10 active:scale-95 bg-gradient-to-br ${safetyTool.gradient} ${safetyTool.border}`}
        >
          <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white dark:bg-slate-900/50 p-3 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50 backdrop-blur-sm group-hover:ring-emerald-500/50 transition-all shadow-sm dark:shadow-none">
                {safetyTool.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {safetyTool.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight mt-1 max-w-[200px]">
                  {safetyTool.description}
                </p>
              </div>
            </div>
            <div className="rounded-full bg-white dark:bg-slate-800/50 p-2 text-slate-400 dark:text-slate-500 backdrop-blur-sm group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-slate-900 transition-all shadow-sm dark:shadow-none border border-slate-100 dark:border-transparent">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </button>
      </section>

      {/* Calculators Grid */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">
          Calculators
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {calcTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              disabled={tool.status === 'Coming Soon'}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 active:scale-95 h-32 ${
                tool.status === 'Coming Soon'
                  ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-500/50 dark:hover:border-amber-500/30 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-amber-900/10'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/80 p-2.5 ring-1 ring-inset ring-slate-100 dark:ring-slate-700/50 transition-colors group-hover:ring-amber-500/30">
                  {tool.icon}
                </div>
                {tool.status === 'Coming Soon' && <Lock size={14} className="text-slate-400 dark:text-slate-600" />}
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white leading-tight">
                  {tool.title}
                </h3>
                {tool.status !== 'Coming Soon' && (
                   <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block group-hover:text-amber-600 dark:group-hover:text-amber-500/80 transition-colors">
                     Tap to open
                   </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Access Info */}
      <div className="mt-8 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-center">
         <p className="text-xs text-slate-400 dark:text-slate-500">
           More tools are being developed based on IEC 60364 & NBR 5410 standards.
         </p>
      </div>
    </div>
  );
};
