
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/Button';

interface OhmsLawCalcProps {
  onBack: () => void;
}

export const OhmsLawCalc: React.FC<OhmsLawCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  // Stores values as strings to allow empty inputs. '' means empty.
  const [values, setValues] = useState({
    v: '',
    i: '',
    r: '',
    p: ''
  });

  const [lastCalculated, setLastCalculated] = useState<string[]>([]);

  const handleChange = (field: keyof typeof values, value: string) => {
    // Only allow numbers
    if (value && isNaN(parseFloat(value))) return;
    
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculate = () => {
    // Parse values, treating empty string as NaN
    const v = parseFloat(values.v);
    const i = parseFloat(values.i);
    const r = parseFloat(values.r);
    const p = parseFloat(values.p);

    const inputs = [];
    if (!isNaN(v)) inputs.push('v');
    if (!isNaN(i)) inputs.push('i');
    if (!isNaN(r)) inputs.push('r');
    if (!isNaN(p)) inputs.push('p');

    if (inputs.length !== 2) return; // Need exactly 2 inputs

    let newV = v, newI = i, newR = r, newP = p;

    // Logic for all combinations
    if (!isNaN(v) && !isNaN(i)) {
      newR = v / i;
      newP = v * i;
    } else if (!isNaN(v) && !isNaN(r)) {
      newI = v / r;
      newP = (v * v) / r;
    } else if (!isNaN(v) && !isNaN(p)) {
      newI = p / v;
      newR = (v * v) / p;
    } else if (!isNaN(i) && !isNaN(r)) {
      newV = i * r;
      newP = (i * i) * r;
    } else if (!isNaN(i) && !isNaN(p)) {
      newV = p / i;
      newR = p / (i * i);
    } else if (!isNaN(r) && !isNaN(p)) {
      newV = Math.sqrt(p * r);
      newI = Math.sqrt(p / r);
    }

    setValues({
      v: isNaN(newV) ? '' : newV.toFixed(2),
      i: isNaN(newI) ? '' : newI.toFixed(2),
      r: isNaN(newR) ? '' : newR.toFixed(2),
      p: isNaN(newP) ? '' : newP.toFixed(2)
    });
    
    // Determine which fields were calculated
    const calculated = ['v', 'i', 'r', 'p'].filter(k => !inputs.includes(k));
    setLastCalculated(calculated);
  };

  const clear = () => {
    setValues({ v: '', i: '', r: '', p: '' });
    setLastCalculated([]);
  };

  // Auto calculate when exactly 2 fields are filled by user
  useEffect(() => {
    const filledCount = Object.values(values).filter(val => val !== '').length;
    if (filledCount === 2 && lastCalculated.length === 0) {
      calculate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const getInputClass = (field: string) => {
    const isCalculated = lastCalculated.includes(field);
    const base = "w-full rounded-lg p-4 text-xl font-mono focus:outline-none focus:ring-2 transition-all ";
    
    if (isCalculated) {
      return base + "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/50 text-amber-600 dark:text-amber-400";
    }
    return base + "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-amber-500";
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2 text-slate-900 dark:text-white">{t('ohm.title')}</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl">
        <div className="flex items-center justify-between mb-6">
           <p className="text-sm text-slate-500 dark:text-slate-400">{t('ohm.subtitle')}</p>
           <button onClick={clear} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center transition-colors">
             <RefreshCw size={12} className="mr-1" /> {t('ohm.clear')}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('ohm.v')}</label>
            <input 
              type="number" 
              value={values.v}
              onChange={(e) => handleChange('v', e.target.value)}
              className={getInputClass('v')}
              placeholder="0.0"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('ohm.i')}</label>
            <input 
              type="number" 
              value={values.i}
              onChange={(e) => handleChange('i', e.target.value)}
              className={getInputClass('i')}
              placeholder="0.0"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('ohm.r')}</label>
            <input 
              type="number" 
              value={values.r}
              onChange={(e) => handleChange('r', e.target.value)}
              className={getInputClass('r')}
              placeholder="0.0"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('ohm.p')}</label>
            <input 
              type="number" 
              value={values.p}
              onChange={(e) => handleChange('p', e.target.value)}
              className={getInputClass('p')}
              placeholder="0.0"
            />
          </div>
        </div>

        {lastCalculated.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-4 py-2 rounded-full text-sm font-medium flex items-center border border-amber-200 dark:border-transparent">
              <Zap size={16} className="mr-2" />
              Calculated
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
