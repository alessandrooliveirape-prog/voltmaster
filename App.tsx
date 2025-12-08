
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './views/Dashboard';
import { Calculators } from './views/Calculators';
import { VoltageDropCalc } from './views/VoltageDropCalc';
import { OhmsLawCalc } from './views/OhmsLawCalc';
import { ConduitFillCalc } from './views/ConduitFillCalc';
import { PowerFactorCalc } from './views/PowerFactorCalc';
import { BreakerSizingCalc } from './views/BreakerSizingCalc';
import { SafetyChecklist } from './views/SafetyChecklist';
import { AIConsultant } from './views/AIConsultant';
import { Projects } from './views/Projects';
import { ViewState } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      
      case ViewState.CALCULATORS:
        return <Calculators onNavigate={setCurrentView} />;
      
      case ViewState.CALC_VOLTAGE_DROP:
        return <VoltageDropCalc onBack={() => setCurrentView(ViewState.CALCULATORS)} />;

      case ViewState.CALC_OHMS_LAW:
        return <OhmsLawCalc onBack={() => setCurrentView(ViewState.CALCULATORS)} />;
      
      case ViewState.CALC_CONDUIT_FILL:
        return <ConduitFillCalc onBack={() => setCurrentView(ViewState.CALCULATORS)} />;
      
      case ViewState.CALC_POWER_FACTOR:
        return <PowerFactorCalc onBack={() => setCurrentView(ViewState.CALCULATORS)} />;

      case ViewState.CALC_BREAKER:
        return <BreakerSizingCalc onBack={() => setCurrentView(ViewState.CALCULATORS)} />;
      
      case ViewState.SAFETY_CHECKLIST:
        return <SafetyChecklist onBack={() => setCurrentView(ViewState.CALCULATORS)} />;

      case ViewState.AI_CONSULTANT:
        return <AIConsultant />;
      
      case ViewState.PROJECTS:
        return <Projects />;
        
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-amber-500/30 transition-colors duration-300">
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-slate-900 shadow-2xl relative transition-colors duration-300">
        <main className="min-h-screen">
          {renderView()}
        </main>
        
        <Navbar currentView={currentView} onNavigate={setCurrentView} />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
