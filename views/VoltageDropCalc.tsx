
import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { VoltageDropResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface VoltageDropCalcProps {
  onBack: () => void;
}

export const VoltageDropCalc: React.FC<VoltageDropCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [voltage, setVoltage] = useState<number>(220);
  const [current, setCurrent] = useState<number>(10);
  const [distance, setDistance] = useState<number>(50);
  const [cableSize, setCableSize] = useState<number>(2.5);
  const [material, setMaterial] = useState<'copper' | 'aluminum'>('copper');
  const [result, setResult] = useState<VoltageDropResult | null>(null);

  // Resistivity (ohm-mm²/m) approx
  const RHO_COPPER = 0.0172;
  const RHO_ALUMINUM = 0.028;

  const calculate = () => {
    // Single phase simplified formula: Vd = 2 * L * I * rho / A
    const rho = material === 'copper' ? RHO_COPPER : RHO_ALUMINUM;
    const drop = (2 * distance * current * rho) / cableSize;
    const percent = (drop / voltage) * 100;

    setResult({
      dropVolts: parseFloat(drop.toFixed(2)),
      dropPercentage: parseFloat(percent.toFixed(2)),
      acceptable: percent <= 4 // Standard NEC/NBR recommendation often 3-5% for feeders/branches
    });
  };

  useEffect(() => {
    // Auto calculate on change if values are valid
    if (voltage > 0 && current > 0 && distance > 0 && cableSize > 0) {
      calculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voltage, current, distance, cableSize, material]);

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">{t('vd.title')}</h2>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 space-y-6">
        
        {/* Voltage */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">{t('vd.voltage')}</label>
          <div className="grid grid-cols-3 gap-2">
            {[110, 220, 380].map(v => (
              <button
                key={v}
                onClick={() => setVoltage(v)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  voltage === v ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t('vd.current')}</label>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t('vd.distance')}</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Cable Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">{t('vd.cable')}</label>
          <select
            value={cableSize}
            onChange={(e) => setCableSize(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {[1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95].map(size => (
              <option key={size} value={size}>{size} mm²</option>
            ))}
          </select>
        </div>

        {/* Material Toggle */}
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">{t('vd.material')}</label>
            <div className="flex bg-slate-900 p-1 rounded-lg">
            <button
                onClick={() => setMaterial('copper')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                material === 'copper' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'
                }`}
            >
                {t('vd.copper')}
            </button>
            <button
                onClick={() => setMaterial('aluminum')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                material === 'aluminum' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'
                }`}
            >
                {t('vd.aluminum')}
            </button>
            </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${
            result.acceptable 
              ? 'bg-green-900/20 border-green-800' 
              : 'bg-red-900/20 border-red-800'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="block text-sm text-slate-400">{t('vd.result_drop')}</span>
                <span className={`text-3xl font-bold ${
                  result.acceptable ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.dropVolts} V
                </span>
                <span className="text-slate-500 ml-2">({result.dropPercentage}%)</span>
              </div>
              <div>
                {result.acceptable ? (
                  <div className="flex items-center text-green-500 bg-green-900/30 px-3 py-1 rounded-full">
                    <CheckCircle2 size={16} className="mr-1.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('vd.ok')}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 bg-red-900/30 px-3 py-1 rounded-full">
                    <AlertTriangle size={16} className="mr-1.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('vd.high')}</span>
                  </div>
                )}
              </div>
            </div>
            {!result.acceptable && (
              <p className="mt-2 text-xs text-red-300">
                {t('vd.warning')} {
                  [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95].find(s => s > cableSize)
                } mm².
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
