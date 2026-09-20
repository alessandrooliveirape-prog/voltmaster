import React, { useState } from 'react';
import { ArrowLeft, Cpu, Zap, ShieldAlert, Copy, Check, Printer, Info, Settings2, Sliders } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface MotorCalcProps {
  onBack: () => void;
}

export const MotorCalc: React.FC<MotorCalcProps> = ({ onBack }) => {
  const { t } = useLanguage();

  // Inputs
  const [powerCv, setPowerCv] = useState<number>(10); // CV
  const [voltage, setVoltage] = useState<number>(380); // V
  const [phases, setPhases] = useState<'three' | 'single'>('three');
  const [powerFactor, setPowerFactor] = useState<number>(0.84); // cos phi
  const [efficiency, setEfficiency] = useState<number>(0.88); // rendimento eta
  const [ipInRatio, setIpInRatio] = useState<number>(7.2); // Ip/In
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  // 1 CV = 735.5 Watts
  const powerWatts = powerCv * 735.5;
  const powerKw = powerWatts / 1000;

  // Nominal Current (In)
  let inAmps = 0;
  if (phases === 'three') {
    // In = P / (sqrt(3) * V * cosPhi * eta)
    inAmps = powerWatts / (Math.sqrt(3) * voltage * powerFactor * efficiency);
  } else {
    // In = P / (V * cosPhi * eta)
    inAmps = powerWatts / (voltage * powerFactor * efficiency);
  }

  // Starting Current (Ip)
  const ipAmps = inAmps * ipInRatio;

  // Recommended Starting Method
  let recommendedStarter = '';
  let starterDescription = '';
  if (powerCv <= 5) {
    recommendedStarter = 'Partida Direta (DOL)';
    starterDescription = 'Aceita pela maioria das concessionárias de energia para motores até 5 CV. Corrente de pico total de partida.';
  } else if (powerCv <= 15 && phases === 'three') {
    recommendedStarter = 'Partida Estrela-Triângulo (Y-Δ) ou Soft-Starter';
    starterDescription = 'Reduz a corrente de partida para cerca de 33% (1/3 de Ip). O motor deve ter 6 bornes e tensão de fechamento compatível.';
  } else {
    recommendedStarter = 'Soft-Starter ou Inversor de Frequência (VFD)';
    starterDescription = 'Obrigatório para motores acima de 15 CV ou partidas com carga pesada. Evita perturbação na rede e choques mecânicos.';
  }

  // Cable Sizing (Estimativa NBR 5410 condutores de cobre B1/B2)
  let cableSizeMm2 = 2.5;
  if (inAmps <= 17.5) cableSizeMm2 = 2.5;
  else if (inAmps <= 24) cableSizeMm2 = 4.0;
  else if (inAmps <= 32) cableSizeMm2 = 6.0;
  else if (inAmps <= 41) cableSizeMm2 = 10.0;
  else if (inAmps <= 57) cableSizeMm2 = 16.0;
  else if (inAmps <= 76) cableSizeMm2 = 25.0;
  else if (inAmps <= 96) cableSizeMm2 = 35.0;
  else if (inAmps <= 119) cableSizeMm2 = 50.0;
  else if (inAmps <= 144) cableSizeMm2 = 70.0;
  else cableSizeMm2 = 95.0;

  // Thermal Relay Setting (faixa 1.0 a 1.15 * In)
  const relayMin = Number((inAmps * 0.95).toFixed(1));
  const relayMax = Number((inAmps * 1.15).toFixed(1));

  // Contactor AC-3 rating (deve suportar pelo menos 1.15 * In para partida direta)
  const contactorRatingAmps = Math.ceil(inAmps * 1.2);

  const copyMemorial = () => {
    const text = `=== MEMORIAL DE DIMENSIONAMENTO DE MOTOR ELÉTRICO ===
Data: ${new Date().toLocaleDateString()}
Norma Base: NBR 5410 / NBR 17094 / NR-10
Ferramenta: VoltMaster Pro

1. ESPECIFICAÇÕES DO MOTOR:
- Potência: ${powerCv} CV (${powerKw.toFixed(2)} kW)
- Alimentação: ${phases === 'three' ? 'Trifásica' : 'Monofásica'} ${voltage}V
- Fator de Potência (cos φ): ${powerFactor}
- Rendimento (η): ${(efficiency * 100).toFixed(1)}%
- Relação Ip/In: ${ipInRatio}

2. RESULTADOS DO DIMENSIONAMENTO:
- Corrente Nominal de Operação (In): ${inAmps.toFixed(1)} A
- Corrente de Partida Direta (Ip): ${ipAmps.toFixed(1)} A
- Método de Partida Recomendado: ${recommendedStarter}
- Seção Mínima do Condutor de Cobre: ${cableSizeMm2} mm²
- Ajuste do Relé de Sobrecarga: ${relayMin} A a ${relayMax} A (regular em ${inAmps.toFixed(1)} A)
- Contator Mínimo Recomendado: Categoria AC-3 ≥ ${contactorRatingAmps} A

3. OBSERVAÇÕES TÉCNICAS:
${starterDescription}
=====================================================`;

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
          <Cpu className="text-amber-500" size={22} />
          Motores & Partida
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
          <Settings2 size={16} className="text-amber-500" />
          Dados de Placa do Motor
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Potência Mecânica (CV / HP)
            </label>
            <input
              type="number"
              step="0.5"
              value={powerCv}
              onChange={(e) => setPowerCv(Math.max(0.25, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Equivalente a {powerKw.toFixed(2)} kW</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tensão de Operação (V)
            </label>
            <select
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value={220}>220 V</option>
              <option value={380}>380 V (Padrão Industrial)</option>
              <option value={440}>440 V</option>
              <option value={127}>127 V (Monofásico)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Alimentação
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPhases('three')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  phases === 'three'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Trifásico (3Ø)
              </button>
              <button
                type="button"
                onClick={() => setPhases('single')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  phases === 'single'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Monofásico (1Ø)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Relação Ip/In (Partida)
            </label>
            <input
              type="number"
              step="0.1"
              value={ipInRatio}
              onChange={(e) => setIpInRatio(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div className="bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/20 dark:via-slate-800 dark:to-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Zap size={16} />
            Resultado do Dimensionamento
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
            In = {inAmps.toFixed(1)} A
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Corrente Nominal (In)</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {inAmps.toFixed(1)} <span className="text-xs font-normal text-slate-500">A</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Em regime contínuo</div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Pico Partida (Ip)</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {ipAmps.toFixed(1)} <span className="text-xs font-normal text-slate-500">A</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Partida direta sem rampa</div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Cabo de Cobre Mínimo</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {cableSizeMm2} <span className="text-xs font-normal text-slate-500">mm²</span>
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">NBR 5410 Tabela 36</div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Faixa do Relé Térmico</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {relayMin} - {relayMax} <span className="text-xs font-normal text-slate-500">A</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ajustar exatamente em {inAmps.toFixed(1)} A</div>
          </div>
        </div>

        {/* Starter Recommendation Callout */}
        <div className="p-3.5 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Sliders size={15} />
            Partida Recomendada: {recommendedStarter}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {starterDescription}
          </p>
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
