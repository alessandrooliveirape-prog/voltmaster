
import React, { useState } from 'react';
import { ArrowLeft, Triangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/Button';

interface PowerFactorCalcProps {
  onBack: () => void;
}

export const PowerFactorCalc: React.FC<PowerFactorCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const [activePower, setActivePower] = useState<number>(0);
  const [currentPF, setCurrentPF] = useState<number>(0.75);
  const [targetPF, setTargetPF] = useState<number>(0.92);
  const [requiredKVAR, setRequiredKVAR] = useState<number | null>(null);

  const calculate = () => {
    if (activePower <= 0 || currentPF <= 0 || targetPF <= 0) return;
    
    // Formula: Qc = P * (tan(acos(PF1)) - tan(acos(PF2)))
    const angle1 = Math.acos(currentPF);
    const angle2 = Math.acos(targetPF);
    
    const tan1 = Math.tan(angle1);
    const tan2 = Math.tan(angle2);
    
    const kvar = activePower * (tan1 - tan2);
    setRequiredKVAR(parseFloat(kvar.toFixed(2)));
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">{t('pf.title')}</h2>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 space-y-6">
        
        {/* Active Power Input */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">{t('pf.active_power')}</label>
          <input
            type="number"
            value={activePower || ''}
            onChange={(e) => setActivePower(parseFloat(e.target.value))}
            placeholder="e.g. 50"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Current PF Slider */}
        <div>
          <div className="flex justify-between mb-1">
             <label className="text-sm font-medium text-slate-400">{t('pf.current_pf')}</label>
             <span className="text-amber-500 font-mono">{currentPF}</span>
          </div>
          <input 
            type="range" 
            min="0.50" 
            max="0.99" 
            step="0.01" 
            value={currentPF}
            onChange={(e) => setCurrentPF(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Target PF Slider */}
        <div>
          <div className="flex justify-between mb-1">
             <label className="text-sm font-medium text-slate-400">{t('pf.target_pf')}</label>
             <span className="text-green-500 font-mono">{targetPF}</span>
          </div>
          <input 
            type="range" 
            min="0.80" 
            max="1.00" 
            step="0.01" 
            value={targetPF}
            onChange={(e) => setTargetPF(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        <Button onClick={calculate} fullWidth>
            {t('pf.calc_btn')}
        </Button>

        {/* Result */}
        {requiredKVAR !== null && (
          <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-700 text-center animate-in fade-in zoom-in duration-300">
            <span className="block text-slate-400 text-sm mb-1">{t('pf.required_kvar')}</span>
            <div className="text-4xl font-bold text-amber-500 flex items-center justify-center">
              <Triangle className="mr-2 fill-amber-500 text-amber-500" size={24} />
              {requiredKVAR} <span className="text-base ml-2 text-slate-500">kVAR</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              To correct {activePower}kW from {currentPF} to {targetPF} PF.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
