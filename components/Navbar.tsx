
import React from 'react';
import { Calculator, MessageSquare, Home, FolderKanban } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { view: ViewState.DASHBOARD, icon: <Home size={24} />, label: t('nav.home') },
    { view: ViewState.CALCULATORS, icon: <Calculator size={24} />, label: t('nav.tools') },
    { view: ViewState.PROJECTS, icon: <FolderKanban size={24} />, label: t('nav.projects') },
    { view: ViewState.AI_CONSULTANT, icon: <MessageSquare size={24} />, label: t('nav.ai') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          // Check if current view is a calculator sub-view
          const isCalcSubView = [
            ViewState.CALC_VOLTAGE_DROP,
            ViewState.CALC_OHMS_LAW,
            ViewState.CALC_CONDUIT_FILL,
            ViewState.CALC_POWER_FACTOR,
            ViewState.CALC_BREAKER,
            ViewState.SAFETY_CHECKLIST
          ].includes(currentView);

          const isActive = currentView === item.view || (item.view === ViewState.CALCULATORS && isCalcSubView);

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
