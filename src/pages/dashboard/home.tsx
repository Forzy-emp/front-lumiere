// import { 
//   Zap, 
//   Sun, 
//   DollarSign, 
//   Leaf, 
//   BatteryCharging, 
//   TrendingUp, 
//   Calendar,
//   Globe
// } from 'lucide-react';

// export default function Home() {
//   const cards = [
//     {
//       title: "Energia Produzida Hoje",
//       value: "28.4 kWh",
//       desc: "Atualizado há 10 min",
//       icon: Zap,
//       color: "bg-amber-500/10 text-amber-550 border-amber-200",
//       iconBg: "bg-amber-500 text-white"
//     },
//     {
//       title: "Produção do Mês",
//       value: "842.6 kWh",
//       desc: "Meta mensal de 900 kWh",
//       icon: Sun,
//       color: "bg-lumiere-primary/10 text-lumiere-tertiary border-lumiere-primary/20",
//       iconBg: "bg-lumiere-primary text-white"
//     },
//     {
//       title: "Economia Acumulada",
//       value: "R$ 4.850,20",
//       desc: "Retorno sobre o investimento",
//       icon: DollarSign,
//       color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
//       iconBg: "bg-emerald-500 text-white"
//     },
//     {
//       title: "CO₂ Evitado",
//       value: "358.2 kg",
//       desc: "Equivalente a 24 árvores",
//       icon: Leaf,
//       color: "bg-green-500/10 text-green-700 border-green-200",
//       iconBg: "bg-green-500 text-white"
//     },
//     {
//       title: "Eficiência do Sistema",
//       value: "96.4%",
//       desc: "Excelente estado de operação",
//       icon: BatteryCharging,
//       color: "bg-teal-500/10 text-teal-700 border-teal-200",
//       iconBg: "bg-teal-500 text-white"
//     },
//     {
//       title: "Percentual de Desempenho",
//       value: "108.5%",
//       desc: "Acima da estimativa teórica",
//       icon: TrendingUp,
//       color: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
//       iconBg: "bg-indigo-500 text-white"
//     }
//   ];

//   return (
//     <div className="space-y-8 animate-fade-in">
//       {/* Intro section */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Desempenho da Usina</h2>
//           <p className="text-sm text-slate-500">Acompanhe a produção solar e sustentabilidade em tempo real.</p>
//         </div>
//         <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-600">
//           <Calendar className="w-4 h-4 text-lumiere-primary" />
//           <span>Julho de 2026</span>
//         </div>
//       </div>

//       {/* 6 Large Metrics Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card, i) => {
//           const Icon = card.icon;
//           return (
//             <div 
//               key={i}
//               className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1`}
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <span className="text-sm font-semibold text-slate-500">{card.title}</span>
//                 <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-200`}>
//                   <Icon className="w-5 h-5" />
//                 </div>
//               </div>
//               <div>
//                 <span className="text-3xl font-bold text-slate-900 tracking-tight block mb-1">{card.value}</span>
//                 <span className="text-xs text-slate-400 font-medium">{card.desc}</span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Savings Highlight section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Saving this month */}
//         <div className="bg-linear-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-lumiere-primary/5 rounded-full blur-2xl pointer-events-none" />
//           <div className="w-14 h-14 rounded-full bg-lumiere-primary/10 flex items-center justify-center text-lumiere-tertiary shrink-0">
//             <DollarSign className="w-8 h-8" />
//           </div>
//           <div>
//             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
//               Valor Economizado Este Mês
//             </span>
//             <span className="text-3xl font-extrabold text-lumiere-tertiary block mb-1">
//               R$ 684,50
//             </span>
//             <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
//               Economia ativa
//             </span>
//           </div>
//         </div>

//         {/* Saving since installation */}
//         <div className="bg-linear-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-lumiere-secondary/5 rounded-full blur-2xl pointer-events-none" />
//           <div className="w-14 h-14 rounded-full bg-lumiere-secondary/10 flex items-center justify-center text-lumiere-secondary shrink-0">
//             <Globe className="w-8 h-8" />
//           </div>
//           <div>
//             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
//               Valor Economizado Desde a Instalação
//             </span>
//             <span className="text-3xl font-extrabold text-slate-900 block mb-1">
//               R$ 4.850,20
//             </span>
//             <span className="text-xs text-slate-500 font-medium">
//               Instalado em Outubro de 2025
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-500">{card.title}</span>
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</span>
                {card.unit && (
                  <span className="text-sm font-medium text-slate-400">{card.unit}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Highlight section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-sm font-semibold text-slate-700 block mb-3">
            Economia Este Mês
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 block mb-2">
            R$ 285
          </span>
          <span className="text-xs text-slate-500 font-medium">
            +12% comparado ao mês anterior
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-sm font-semibold text-slate-700 block mb-3">
            Economia Desde Instalação
          </span>
          <span className="text-3xl font-extrabold text-blue-600 block mb-2">
            R$ 12.450
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Em 18 meses de operação
          </span>
        </div>
      </div>
    </div>
  );
}