
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BreakerSizingCalcProps {
  onBack: () => void;
}

export const BreakerSizingCalc: React.FC<BreakerSizingCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  const [mode, setMode] = useState<'power' | 'current'>('power');
  const [power, setPower] = useState<number>(0); // Watts
  const [current, setCurrent] = useState<number>(0); // Amps
  const [voltage, setVoltage] = useState<number>(220);
  const [phases, setPhases] = useState<number>(1);
  const [pf, setPf] = useState<number>(0.9);

  const [resultIb, setResultIb] = useState<number>(0);
  const [recommendedBreaker, setRecommendedBreaker] = useState<number>(0);

  // Standard IEC/DIN Breaker sizes
  const STANDARD_BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200];

  // Simplified cable suggestion based on breaker size (Generic PVC, 30C ambient)
  // Warning: This is a rough estimation for quick reference only!
  const getMinCableSize = (breaker: number): string => {
    if (breaker <= 10) return "1.5 mm²";
    if (breaker <= 16) return "2.5 mm²";
    if (breaker <= 20) return "2.5 mm²";
    if (breaker <= 25) return "4.0 mm²";
    if (breaker <= 32) return "6.0 mm²";
    if (breaker <= 40) return "10.0 mm²";
    if (breaker <= 50) return "10.0 mm²";
    if (breaker <= 63) return "16.0 mm²";
    return "> 25.0 mm²";
  };

  useEffect(() => {
    let ib = 0;
    
    if (mode === 'current') {
      ib = current;
    } else {
      // Calculate I based on P
      // 1 Phase: I = P / (V * PF)
      // 2 Phase: I = P / (V * PF) (assuming V is line-to-line)
      // 3 Phase: I = P / (V * 1.732 * PF)
      
      const safeV = voltage || 1;
      const safePF = pf || 1;

      if (phases === 3) {
        ib = power / (safeV * Math.sqrt(3) * safePF);
      } else {
        ib = power / (safeV * safePF);
      }
    }

    setResultIb(parseFloat(ib.toFixed(1)));

    // Find next standard breaker size > Ib
    // Usually In >= Ib.
    // Some standards suggest margin like In >= 1.25 * Ib for continuous loads.
    // Here we implement In >= Ib (Basic sizing).
    const breaker = STANDARD_BREAKERS.find(b => b >= ib) || 0;
    setRecommendedBreaker(breaker);

  }, [mode, power, current, voltage, phases, pf]);

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">{t('cb.title')}</h2>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 space-y-6">
        
        {/* Mode Selector */}
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">{t('cb.mode')}</label>
           <div className="flex bg-slate-900 p-1 rounded-lg">
             <button
               onClick={() => setMode('power')}
               className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                 mode === 'power' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'
               }`}
             >
               {t('cb.mode_p')}
             </button>
             <button
               onClick={() => setMode('current')}
               className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                 mode === 'current' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'
               }`}
             >
               {t('cb.mode_i')}
             </button>
           </div>
        </div>

        {/* Dynamic Inputs */}
        <div className="space-y-4">
          {mode === 'power' ? (
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t('cb.power')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={power || ''}
                    onChange={(e) => setPower(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="e.g. 5000"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 text-sm">W</span>
                </div>
             </div>
          ) : (
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Current (Amps)</label>
                <input
                    type="number"
                    value={current || ''}
                    onChange={(e) => setCurrent(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="e.g. 25"
                />
             </div>
          )}

          {mode === 'power' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t('cb.voltage')}</label>
                <select
                  value={voltage}
                  onChange={(e) => setVoltage(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <optgroup label="110V - 127V Range">
                    <option value={110}>110V / 115V / 127V (Padrão)</option>
                    <option value={110}>110V</option>
                    <option value={115}>115V</option>
                    <option value={127}>127V</option>
                  </optgroup>
                  <optgroup label="220V - 240V Range">
                    <option value={220}>220V / 230V / 240V (Padrão)</option>
                    <option value={220}>220V</option>
                    <option value={230}>230V</option>
                    <option value={240}>240V</option>
                  </optgroup>
                  <optgroup label="380V - 415V Range">
                    <option value={380}>380V / 400V / 415V (Padrão)</option>
                    <option value={380}>380V</option>
                    <option value={400}>400V</option>
                    <option value={415}>415V</option>
                  </optgroup>
                  <optgroup label="440V - 480V Range">
                    <option value={440}>440V / 480V (Padrão)</option>
                    <option value={440}>440V</option>
                    <option value={480}>480V</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('cb.phases')}</label>
                    <div className="flex bg-slate-900 p-1 rounded-lg">
                      <button
                        onClick={() => setPhases(1)}
                        className={`flex-1 py-2 rounded text-xs font-bold ${phases === 1 ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}
                      >
                        1Ø
                      </button>
                      <button
                        onClick={() => setPhases(2)}
                        className={`flex-1 py-2 rounded text-xs font-bold ${phases === 2 ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}
                      >
                        2Ø
                      </button>
                      <button
                        onClick={() => setPhases(3)}
                        className={`flex-1 py-2 rounded text-xs font-bold ${phases === 3 ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}
                      >
                        3Ø
                      </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('cb.pf')}</label>
                    <input
                        type="number"
                        step="0.01"
                        max="1"
                        min="0.1"
                        value={pf}
                        onChange={(e) => setPf(parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                 </div>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        {(power > 0 || current > 0) && (
           <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-slate-400">{t('cb.calc_current')}</span>
                 <span className="text-xl font-mono text-white">{resultIb} A</span>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-600">
                 <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{t('cb.rec_breaker')}</span>
                        <div className="text-4xl font-bold text-white mt-1 flex items-center">
                            <ShieldCheck size={32} className="mr-2 text-green-500" />
                            {recommendedBreaker > 0 ? `${recommendedBreaker} A` : 'N/A'}
                        </div>
                    </div>
                    {recommendedBreaker > 0 && (
                        <div className="text-right">
                           <span className="text-xs text-slate-500 block mb-1">{t('cb.min_cable')}</span>
                           <span className="text-lg font-medium text-slate-300 border-b border-dashed border-slate-600">
                             {getMinCableSize(recommendedBreaker)}
                           </span>
                        </div>
                    )}
                 </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-3 italic flex items-start">
                <Zap size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                {t('cb.note')}
              </p>
           </div>
        )}

      </div>
    </div>
  );
};
