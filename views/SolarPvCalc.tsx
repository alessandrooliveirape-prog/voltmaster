import React, { useState } from 'react';
import { ArrowLeft, Sun, Zap, DollarSign, Calculator, Copy, Check, Printer, Info, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface SolarPvCalcProps {
  onBack: () => void;
}

export const SolarPvCalc: React.FC<SolarPvCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();

  // Inputs
  const [monthlyKwh, setMonthlyKwh] = useState<number>(550);
  const [hsp, setHsp] = useState<number>(5.1); // Horas de sol pleno diárias médias
  const [panelWattage, setPanelWattage] = useState<number>(550); // Wp por painel
  const [perfRatio, setPerfRatio] = useState<number>(0.78); // Performance Ratio (taxa de desempenho 78%)
  const [energyTariff, setEnergyTariff] = useState<number>(0.92); // R$/kWh
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const dailyKwh = monthlyKwh / 30;
  // P_kWp = E_dia / (HSP * PR)
  const systemPowerKwp = dailyKwh / (hsp * perfRatio);
  const totalWattsNeeded = systemPowerKwp * 1000;
  const panelCount = Math.ceil(totalWattsNeeded / panelWattage);
  const actualSystemKwp = (panelCount * panelWattage) / 1000;
  const estimatedMonthlyGen = actualSystemKwp * hsp * 30 * perfRatio;
  const inverterSuggestedKw = Number((actualSystemKwp * 0.85).toFixed(1)); // Overpowering fator de 1.15 a 1.25
  const estimatedRoofArea = Number((panelCount * 2.4).toFixed(1)); // ~2.4 m² por placa de 550W
  const monthlySavings = estimatedMonthlyGen * energyTariff;
  const annualSavings = monthlySavings * 12;
  const estimatedSystemCost = actualSystemKwp * 3200; // Média estimada de mercado R$ 3.200/kWp
  const estimatedPaybackYears = Number((estimatedSystemCost / (annualSavings || 1)).toFixed(1));

  const copyMemorial = () => {
    const text = `=== MEMORIAL DE DIMENSIONAMENTO SOLAR FOTOVOLTAICO ===
Data: ${new Date().toLocaleDateString()}
Ferramenta: VoltMaster Pro (Engenharia Elétrica)

1. DADOS DE ENTRADA:
- Consumo Mensal Médio: ${monthlyKwh} kWh/mês
- Consumo Diário: ${dailyKwh.toFixed(2)} kWh/dia
- Horas de Sol Pleno (HSP): ${hsp} h/dia
- Performance Ratio (PR): ${(perfRatio * 100).toFixed(0)}%
- Potência do Painel: ${panelWattage} Wp
- Tarifa de Energia: R$ ${energyTariff.toFixed(2)}/kWh

2. RESULTADOS DO PROJETO:
- Potência Mínima Calculada: ${systemPowerKwp.toFixed(2)} kWp
- Quantidade de Painéis: ${panelCount} unidades (${panelWattage}W cada)
- Potência Instalada Real (CC): ${actualSystemKwp.toFixed(2)} kWp
- Geração Mensal Estimada: ${estimatedMonthlyGen.toFixed(0)} kWh/mês
- Potência Recomendada do Inversor (CA): ${inverterSuggestedKw} kW
- Área Estimada de Telhado: ~${estimatedRoofArea} m²

3. VIABILIDADE ECONÔMICA ESTIMADA:
- Economia Estimada: R$ ${monthlySavings.toFixed(2)}/mês (~R$ ${annualSavings.toFixed(2)}/ano)
- Investimento Estimado: ~R$ ${estimatedSystemCost.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
- Payback Estimado: ~${estimatedPaybackYears} anos
======================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="text-amber-500" size={22} />
          Solar Fotovoltaico
        </h1>
        <button
          onClick={copyMemorial}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
          title="Copiar Memorial de Cálculo"
        >
          {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
        </button>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Calculator size={16} className="text-amber-500" />
          Parâmetros do Consumidor & Local
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Consumo Mensal Médio (kWh)
            </label>
            <input
              type="number"
              value={monthlyKwh}
              onChange={(e) => setMonthlyKwh(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Irradiação Média (HSP - h/dia)</span>
              <span className="text-[10px] text-amber-500 font-normal">Ex: Brasil 4.5 a 5.8</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={hsp}
              onChange={(e) => setHsp(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Potência dos Painéis (Wp)
            </label>
            <select
              value={panelWattage}
              onChange={(e) => setPanelWattage(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value={450}>450 Wp (Padrão Comercial)</option>
              <option value={550}>550 Wp (Monocristalino Half-Cell)</option>
              <option value={600}>600 Wp (Alta Potência)</option>
              <option value={670}>670 Wp (Industrial Ultra-Power)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tarifa de Energia (R$/kWh)
            </label>
            <input
              type="number"
              step="0.05"
              value={energyTariff}
              onChange={(e) => setEnergyTariff(Math.max(0.1, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      <div className="bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/20 dark:via-slate-800 dark:to-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles size={16} />
            Dimensionamento Sugerido
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
            {actualSystemKwp.toFixed(2)} kWp
          </span>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Quantidade de Painéis</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {panelCount} <span className="text-xs font-normal text-slate-500">módulos</span>
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
              Área necessária: ~{estimatedRoofArea} m²
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Geração Média Mensal</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {estimatedMonthlyGen.toFixed(0)} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Atende {((estimatedMonthlyGen / monthlyKwh) * 100).toFixed(0)}% do consumo
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Inversor Recomendado</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {inverterSuggestedKw} <span className="text-xs font-normal text-slate-500">kW (CA)</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Sobrecarga (FDI): ~120%
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Economia Anual Estimada</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              R$ {annualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Payback estimado: ~{estimatedPaybackYears} anos
            </div>
          </div>
        </div>

        {/* Technical Insight Note */}
        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 border border-amber-500/20">
          <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <span>
            Dimensionamento baseado na NBR 16690 e NBR 5410. Considera fator de desempenho global (PR) de {(perfRatio * 100).toFixed(0)}%, prevendo perdas térmicas, sujeira, sombreamento e cabeamento CC/CA.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={copyMemorial}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          {copied ? 'Copiado!' : 'Copiar Memorial'}
        </Button>
        <Button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Printer size={18} />
          Imprimir / PDF
        </Button>
      </div>
    </div>
  );
};
