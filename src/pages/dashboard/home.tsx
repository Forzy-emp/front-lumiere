import { 
  Zap, 
  Sun, 
  DollarSign, 
  Leaf, 
  BatteryCharging, 
  TrendingUp, 
 } from 'lucide-react';

export default function Home() {
  const cards = [
    {
      title: "Energia Produzida Hoje",
      value: "45.8",
      unit: "kWh",
      icon: Zap,
      iconBg: "bg-blue-500 text-white"
    },
    {
      title: "Produção do Mês",
      value: "920",
      unit: "kWh",
      icon: Sun,
      iconBg: "bg-orange-500 text-white"
    },
    {
      title: "Economia Acumulada",
      value: "R$ 2.450",
      unit: "",
      icon: DollarSign,
      iconBg: "bg-emerald-500 text-white"
    },
    {
      title: "CO₂ Evitado",
      value: "1.2",
      unit: "ton",
      icon: Leaf,
      iconBg: "bg-green-500 text-white"
    },
    {
      title: "Eficiência do Sistema",
      value: "98.5",
      unit: "%",
      icon: BatteryCharging,
      iconBg: "bg-blue-500 text-white"
    },
    {
      title: "Desempenho",
      value: "105",
      unit: "%",
      icon: TrendingUp,
      iconBg: "bg-amber-500 text-white"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-500 to-orange-500 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Bem-vindo de volta! 👋
        </h2>
        <p className="text-sm text-white/90 mt-1">
          Seu sistema está funcionando perfeitamente. Veja o desempenho de hoje abaixo.
        </p>
      </div>

      {/* 6 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</span>
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{card.value}</span>
                {card.unit && (
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{card.unit}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Highlight section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">
            Economia Este Mês
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block mb-2">
            R$ 285
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            +12% comparado ao mês anterior
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">
            Economia Desde Instalação
          </span>
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 block mb-2">
            R$ 12.450
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Em 18 meses de operação
          </span>
        </div>
      </div>
    </div>
  );
}