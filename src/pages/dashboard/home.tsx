import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  DollarSign, 
  Leaf, 
  BatteryCharging, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Calendar, 
  ChevronRight
} from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  percent: number;
}

interface Plant {
  id: string;
  name: string;
  cep: string;
  address: string;
  panelsCount: number;
  lastMonthProduction: number;
  lastMonthProductionAnterior?: number;
  lastMonthFaturamento?: number;
  lastMonthFaturamentoAnterior?: number;
  saldoRede?: number;
  economiaAcumulada?: number;
  energiaEnviada?: number;
  status: 'ativo' | 'inativo';
  beneficiariesLimit?: number;
  sunExposure?: number;
  beneficiaries: Beneficiary[];
}

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('solarPlants');
    if (stored) {
      try {
        setPlants(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing solarPlants:", e);
      }
    } else {
      // Set default plants if none exist
      const defaultPlants: Plant[] = [
        {
          id: "1",
          name: "Usina Solar Lumière I",
          cep: "01311-200",
          address: "Av. Paulista, 1000 - Bela Vista - São Paulo - SP",
          panelsCount: 42,
          lastMonthProduction: 1840,
          lastMonthProductionAnterior: 1600,
          lastMonthFaturamento: 4250,
          lastMonthFaturamentoAnterior: 3800,
          saldoRede: 2120,
          energiaEnviada: 28450,
          economiaAcumulada: 18250,
          status: "ativo",
          beneficiariesLimit: 25,
          sunExposure: 6,
          beneficiaries: [
            { id: "b1", name: "Ana Souza", email: "ana@email.com", percent: 30 },
            { id: "b2", name: "Carlos Lima", email: "carlos@email.com", percent: 25 },
            { id: "b3", name: "Mariana Santos", email: "mariana@email.com", percent: 45 }
          ]
        },
        {
          id: "2",
          name: "Geradora Solar Pinheiros",
          cep: "05422-010",
          address: "Rua Pinheiros, 500 - Pinheiros - São Paulo - SP",
          panelsCount: 24,
          lastMonthProduction: 980,
          lastMonthProductionAnterior: 900,
          lastMonthFaturamento: 2260,
          lastMonthFaturamentoAnterior: 2100,
          saldoRede: 1050,
          energiaEnviada: 14200,
          economiaAcumulada: 9100,
          status: "ativo",
          beneficiariesLimit: 15,
          sunExposure: 5,
          beneficiaries: [
            { id: "b4", name: "Pedro Alves", email: "pedro@email.com", percent: 50 },
            { id: "b5", name: "Sofia Mendes", email: "sofia@email.com", percent: 50 }
          ]
        },
        {
          id: "3",
          name: "Fazenda Solar Campinas",
          cep: "13010-000",
          address: "Av. Francisco Glicério, 200 - Centro - Campinas - SP",
          panelsCount: 80,
          lastMonthProduction: 3400,
          lastMonthProductionAnterior: 3100,
          lastMonthFaturamento: 7850,
          lastMonthFaturamentoAnterior: 7200,
          saldoRede: 3800,
          energiaEnviada: 48900,
          economiaAcumulada: 31500,
          status: "inativo",
          beneficiariesLimit: 50,
          sunExposure: 7,
          beneficiaries: []
        }
      ];
      localStorage.setItem('solarPlants', JSON.stringify(defaultPlants));
      setPlants(defaultPlants);
    }
  }, []);

  const activePlants = plants.filter(p => p.status === 'ativo');

  // Aggregated calculations based on active plants
  const totalGeracao = activePlants.reduce((sum, p) => sum + p.lastMonthProduction, 0);
  const totalGeracaoAnterior = activePlants.reduce((sum, p) => sum + (p.lastMonthProductionAnterior ?? p.lastMonthProduction * 0.9), 0);
  
  const totalFaturamento = activePlants.reduce((sum, p) => sum + (p.lastMonthFaturamento ?? p.lastMonthProduction * 2.3), 0);
  const totalFaturamentoAnterior = activePlants.reduce((sum, p) => sum + (p.lastMonthFaturamentoAnterior ?? (p.lastMonthFaturamento ?? p.lastMonthProduction * 2.3) * 0.9), 0);

  const totalSaldoRede = activePlants.reduce((sum, p) => sum + (p.saldoRede ?? 0), 0);
  const totalBeneficiarios = activePlants.reduce((sum, p) => sum + p.beneficiaries.length, 0);
  const totalEconomia = activePlants.reduce((sum, p) => sum + (p.economiaAcumulada ?? 0), 0);
  const totalEnergiaEnviada = activePlants.reduce((sum, p) => sum + (p.energiaEnviada ?? 0), 0);

  // Evolutions
  const geracaoDiffPct = totalGeracaoAnterior > 0 
    ? ((totalGeracao - totalGeracaoAnterior) / totalGeracaoAnterior) * 100 
    : 0;
    
  const faturamentoDiff = totalFaturamento - totalFaturamentoAnterior;

  // CO2 avoidance factor (0.3kg of CO2 per kWh)
  const computedCo2 = (totalEnergiaEnviada * 0.0003).toFixed(1);

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <Sun className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Nenhuma Usina Encontrada</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6 max-w-sm">
          Você ainda não possui nenhuma usina de energia solar cadastrada em sua conta.
        </p>
        <Link
          to="/dashboard/usina/new"
          className="px-5 py-3 bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white rounded-xl text-sm font-bold shadow-md hover:opacity-95 transition-opacity"
        >
          Cadastrar Primeira Usina
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      
      {/* Welcome & Info Banner */}
      <div className="bg-linear-to-r from-[#2E5CFF] via-[#5C45FF] to-[#FF7A2F] rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              Dono da Conta
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {activePlants.length} Usinas Ativas
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Painel Geral Solar 👋
          </h2>

          <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 shrink-0" />
            Consolidado geral de todas as usinas ativas (Valores informados pelo usuário)
          </p>
        </div>

        <Link
          to="/dashboard/usina"
          className="bg-white text-slate-800 hover:bg-slate-100 px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
        >
          <span>Gerenciar Usinas</span>
          <ChevronRight className="w-4 h-4 text-blue-600" />
        </Link>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Geração de Energia */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Geração Total Recente</span>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{totalGeracao.toLocaleString()}</span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">kWh</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className={`font-bold px-1.5 py-0.5 rounded-md ${
              geracaoDiffPct >= 0 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
            }`}>
              {geracaoDiffPct >= 0 ? '+' : ''}{geracaoDiffPct.toFixed(1)}%
            </span>
            <span className="text-slate-500 dark:text-slate-400">gerado {geracaoDiffPct >= 0 ? 'mais' : 'menos'} que antes</span>
          </div>
        </div>

        {/* 2. Faturamento Mensal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Faturamento do Período</span>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className={`font-bold px-1.5 py-0.5 rounded-md ${
              faturamentoDiff >= 0 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
            }`}>
              {faturamentoDiff >= 0 ? '+' : ''} R$ {Math.abs(faturamentoDiff).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-slate-500 dark:text-slate-400">faturou {faturamentoDiff >= 0 ? 'mais' : 'menos'} que antes</span>
          </div>
        </div>

        {/* 3. Saldo na Rede */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Saldo Geral na Rede</span>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{totalSaldoRede.toLocaleString()}</span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">kWh</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Créditos ativos disponíveis na rede elétrica
          </div>
        </div>

      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 4. Beneficiários */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Beneficiários Ativos</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mb-1">
            {totalBeneficiarios} {totalBeneficiarios === 1 ? 'pessoa' : 'pessoas'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Atualmente vinculadas às usinas
          </span>
        </div>

        {/* 5. Economia Acumulada */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Economia Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mb-1">
            R$ {totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Economia total somada até o momento
          </span>
        </div>

        {/* 6. Energia Enviada */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Energia Enviada</span>
            <ArrowUpRight className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mb-1">
            {totalEnergiaEnviada.toLocaleString()} kWh
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total injetado na rede concessionária
          </span>
        </div>

        {/* 7. CO2 Evitado */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CO₂ Evitado</span>
            <Leaf className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block mb-1">
            {computedCo2} ton
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Equivalente a plantar ~{(parseFloat(computedCo2) * 6).toFixed(0)} árvores
          </span>
        </div>

      </div>

    </div>
  );
}