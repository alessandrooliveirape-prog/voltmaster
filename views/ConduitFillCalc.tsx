
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Battery, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ConduitFillCalcProps {
  onBack: () => void;
}

export const ConduitFillCalc: React.FC<ConduitFillCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const [conduitSize, setConduitSize] = useState<string>('3/4');
  const [wireSize, setWireSize] = useState<number>(2.5);
  const [numWires, setNumWires] = useState<number>(3);
  const [fillPercent, setFillPercent] = useState<number>(0);

  // Approximate Internal Area (mm²) for Schedule 40 / Heavy Duty PVC
  const conduitAreas: Record<string, number> = {
    '1/2': 170, // ~16mm
    '3/4': 360, // ~20mm
    '1': 580,   // ~25mm
    '1 1/4': 990, // ~32mm
    '1 1/2': 1350, // ~40mm
    '2': 2200,    // ~50mm
  };

  // Approximate Total Cross-Section Area (Conductor + Insulation) in mm²
  // Based on standard building wire (IEC 60227 / THHN)
  const wireAreas: Record<number, number> = {
    1.5: 8.5,
    2.5: 11.9,
    4.0: 15.2,
    6.0: 18.8,
    10.0: 29.2,
    16.0: 45.4,
    25.0: 70.6,
    35.0: 95.0,
    50.0: 132.7
  };

  useEffect(() => {
    const totalWireArea = numWires * (wireAreas[wireSize] || 0);
    const conduitArea = conduitAreas[conduitSize] || 1;
    const fill = (totalWireArea / conduitArea) * 100;
    setFillPercent(parseFloat(fill.toFixed(1)));
  }, [conduitSize, wireSize, numWires]);

  const maxFill = 40; // Standard NEC/NBR rule for >2 wires
  const isOverloaded = fillPercent > maxFill;

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">{t('cf.title')}</h2>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 space-y-6">
        
        {/* Conduit Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">{t('cf.conduit_size')}</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(conduitAreas).map((size) => (
              <button
                key={size}
                onClick={() => setConduitSize(size)}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${
                  conduitSize === size ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {size}"
              </button>
            ))}
          </div>
        </div>

        {/* Wire Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">{t('cf.wire_size')}</label>
          <select
            value={wireSize}
            onChange={(e) => setWireSize(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {Object.keys(wireAreas).map((size) => (
              <option key={size} value={size}>{size} mm²</option>
            ))}
          </select>
        </div>

        {/* Number of Wires */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">{t('cf.num_wires')}</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNumWires(Math.max(1, numWires - 1))}
              className="bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-slate-600 active:bg-slate-500"
            >
              -
            </button>
            <div className="flex-1 bg-slate-900 h-12 rounded-lg flex items-center justify-center text-xl font-mono text-white border border-slate-700">
              {numWires}
            </div>
            <button 
              onClick={() => setNumWires(numWires + 1)}
              className="bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-slate-600 active:bg-slate-500"
            >
              +
            </button>
          </div>
        </div>

        {/* Visualizer */}
        <div className="pt-4 border-t border-slate-700">
           <div className="flex justify-between items-end mb-2">
             <div>
               <span className="text-sm text-slate-400">{t('cf.actual_fill')}</span>
               <div className={`text-3xl font-bold ${isOverloaded ? 'text-red-500' : 'text-green-500'}`}>
                 {fillPercent}%
               </div>
             </div>
             <div className="text-right">
               <span className="text-xs text-slate-500">{t('cf.max_fill')}</span>
             </div>
           </div>

           {/* Progress Bar */}
           <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
              <div 
                className={`h-full transition-all duration-500 ${isOverloaded ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
              {/* 40% Marker */}
              <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-white opacity-50 border-r border-dashed border-slate-900"></div>
           </div>

           <div className={`mt-4 p-3 rounded-lg flex items-center ${
             isOverloaded ? 'bg-red-900/20 text-red-300' : 'bg-green-900/20 text-green-300'
           }`}>
              <Info size={20} className="mr-2" />
              <span className="font-medium">
                {isOverloaded ? t('cf.status_over') : t('cf.status_ok')}
              </span>
           </div>
        </div>

      </div>
    </div>
  );
};
