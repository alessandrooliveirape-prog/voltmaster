
import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/Button';

interface SafetyChecklistProps {
  onBack: () => void;
}

interface ChecklistItem {
  id: string;
  category: 'ppe' | 'proc' | 'tools';
  checked: boolean;
}

export const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 'safe.item_head', category: 'ppe', checked: false },
    { id: 'safe.item_eyes', category: 'ppe', checked: false },
    { id: 'safe.item_hands', category: 'ppe', checked: false },
    { id: 'safe.item_boots', category: 'ppe', checked: false },
    { id: 'safe.item_loto', category: 'proc', checked: false },
    { id: 'safe.item_test', category: 'proc', checked: false },
    { id: 'safe.item_tools', category: 'tools', checked: false },
    { id: 'safe.item_dry', category: 'tools', checked: false },
  ]);

  const [validationState, setValidationState] = useState<'idle' | 'error' | 'success'>('idle');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
    // Reset state if user changes something after an error
    if (validationState === 'error') setValidationState('idle');
  };

  const validate = () => {
    const allChecked = items.every(i => i.checked);
    if (allChecked) {
      setValidationState('success');
    } else {
      setValidationState('error');
    }
  };

  const reset = () => {
    setItems(prev => prev.map(i => ({ ...i, checked: false })));
    setValidationState('idle');
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'ppe': return t('safe.cat_ppe');
      case 'proc': return t('safe.cat_proc');
      case 'tools': return t('safe.cat_tools');
      default: return cat;
    }
  };

  const renderCategory = (category: 'ppe' | 'proc' | 'tools') => {
    const catItems = items.filter(i => i.category === category);
    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 pl-2 border-l-4 border-amber-500">
          {getCategoryLabel(category)}
        </h3>
        <div className="space-y-2">
          {catItems.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full text-left p-4 rounded-xl border flex items-center transition-all duration-200 ${
                item.checked 
                  ? 'bg-green-900/20 border-green-500/50 text-green-100' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                item.checked 
                  ? 'bg-green-500 border-green-500 text-slate-900' 
                  : 'border-slate-500 bg-transparent'
              }`}>
                {item.checked && <Check size={14} strokeWidth={4} />}
              </div>
              <span className="text-sm font-medium">{t(item.id)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  if (validationState === 'success') {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/50">
           <ShieldCheck size={48} className="text-slate-900" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t('safe.success_title')}</h2>
        <p className="text-slate-400 max-w-xs mb-8">{t('safe.success_desc')}</p>
        
        <div className="w-full max-w-sm space-y-3">
          <Button fullWidth onClick={onBack} variant="secondary">
            {t('proj.back')}
          </Button>
          <Button fullWidth onClick={reset} variant="ghost">
            {t('safe.reset')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto relative">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">{t('safe.title')}</h2>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 bg-slate-900 z-10 py-2 mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold">
          <span>PROGRESS</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {renderCategory('ppe')}
        {renderCategory('proc')}
        {renderCategory('tools')}
      </div>

      <div className="mt-8">
        <Button 
          fullWidth 
          onClick={validate}
          className="h-14 text-lg shadow-lg shadow-amber-500/20"
        >
          {t('safe.btn_verify')}
        </Button>
      </div>

      {/* Error Modal */}
      {validationState === 'error' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
             <button 
               onClick={() => setValidationState('idle')}
               className="absolute top-4 right-4 text-slate-500 hover:text-white"
             >
               <AlertCircle size={24} />
             </button>
             
             <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-500">
                 <AlertTriangle size={32} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">{t('safe.alert_title')}</h3>
               <p className="text-red-200 text-sm mb-6 leading-relaxed">{t('safe.alert_desc')}</p>
               
               <div className="w-full bg-red-950/30 rounded-lg p-3 text-left mb-6 max-h-40 overflow-y-auto border border-red-900/50">
                 {items.filter(i => !i.checked).map(i => (
                   <div key={i.id} className="flex items-start mb-2 text-red-300 text-xs">
                     <span className="mr-2">•</span>
                     {t(i.id)}
                   </div>
                 ))}
               </div>

               <Button 
                 fullWidth 
                 variant="danger" 
                 onClick={() => setValidationState('idle')}
               >
                 OK, I will check them
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
