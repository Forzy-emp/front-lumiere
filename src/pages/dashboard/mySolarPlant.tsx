import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Search,
  SlidersHorizontal,
  Users,
  Plus,
  ArrowRight,
  BatteryCharging,
  Eye,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';

import { GetMyUsinas } from "../../service/usina";


interface Beneficiary {
  id: string;
  name: string;
  email: string;
  percent: number;
}

interface MaintenanceLog {
  id: string;
  date: string;
  time: string;
  performedBy: 'self' | 'company';
  companyName?: string;
}

interface Plant {
  id: string;
  name: string;
  cep: string;
  address: string;
  panelsCount: number;
  lastMonthProduction: number;
  status: 'ativo' | 'inativo';
  beneficiariesLimit?: number;
  sunExposure?: number;
  beneficiaries: Beneficiary[];
  installationDate: string;
  lastMaintenanceDate: string;
  maintenanceHistory?: MaintenanceLog[];
}

export default function MySolarPlant() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'inativo'>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'highest' | 'lowest'>('default');

  // Utility to calculate months elapsed
  const getMonthsSince = (dateStr: string) => {
    if (!dateStr) return 0;
    const maintenanceDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - maintenanceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30.4); // Average number of days in a month
  };


  useEffect(() => {
    const loadUsinas = async () => {
      try {
        const response = await GetMyUsinas();

        console.log(response);
        console.log(Array.isArray(response));
        const plants = response.map((u: any) => ({
          id: u.id,
          name: u.name,
          cep: u.cep,
          address: `${u.logradouro}, ${u.numero} - ${u.bairro}`,
          panelsCount: u.qtd_placas,
          lastMonthProduction: u.geracao_mes_anterior,
          status: u.status ? "ativo" : "inativo",
          beneficiariesLimit: u.limite_beneficiarios,
          sunExposure: u.exposicao_solar_diaria,
          installationDate: u.data_instalacao,
          lastMaintenanceDate: u.data_ultima_manutencao,
          beneficiaries: u.associado ?? [],
        }));

        setPlants(plants);
      } catch (err) {
        console.error(err);
      }
    };

    loadUsinas();
  }, []);

  // Filter & Search Logic
  const filteredPlants = plants
    .filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || plant.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === 'highest') {
        return b.lastMonthProduction - a.lastMonthProduction;
      }
      if (sortOrder === 'lowest') {
        return a.lastMonthProduction - b.lastMonthProduction;
      }
      return 0;
    });

  // Consolidate maintenance alerts (only for active plants)
  const maintenanceAlerts = plants.filter(plant => {
    if (plant.status !== 'ativo') return false;
    const months = getMonthsSince(plant.lastMaintenanceDate);
    return months >= 5;
  });

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Minhas Usinas Solares</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie suas usinas cadastradas, consulte métricas e controle seus beneficiários.</p>
        </div>
        <Link
          to="/dashboard/usina/new"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white px-5 font-bold shadow-md hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0 gap-2"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Adicionar Nova Usina
        </Link>
      </div>

      {/* Global Maintenance Alerts Panel */}
      {maintenanceAlerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              Atenção: Manutenção Preventiva Necessária
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              As seguintes usinas ativas necessitam de manutenção preventiva (recomendada a cada 6 meses):
            </p>
            <ul className="list-disc list-inside mt-2 text-xs text-slate-650 dark:text-slate-350 space-y-1">
              {maintenanceAlerts.map(p => {
                const months = getMonthsSince(p.lastMaintenanceDate);
                return (
                  <li key={p.id} className="truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-250">{p.name}</span> -
                    {months >= 6 ? (
                      <span className="text-red-650 dark:text-red-400 font-bold"> Manutenção vencida há {months} meses!</span>
                    ) : (
                      <span className="text-amber-650 dark:text-amber-550"> Recomendado realizar manutenção preventiva (última há {months} meses).</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar usinas por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            Filtros:
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-250 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="ativo">Usinas Ativas</option>
            <option value="inativo">Usinas Inativas</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-250 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="default">Ordenação Padrão</option>
            <option value="highest">Maior Produção</option>
            <option value="lowest">Menor Produção</option>
          </select>
        </div>

      </div>

      {/* Plants Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const monthsSinceMaintenance = getMonthsSince(plant.lastMaintenanceDate);
            const needsYellowAlert = monthsSinceMaintenance >= 5 && monthsSinceMaintenance < 6;
            const needsRedAlert = monthsSinceMaintenance >= 6;

            return (
              <div
                key={plant.id}
                onClick={() => navigate(`/dashboard/usina/info/${plant.id}`, { state: plant })}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all duration-200 group flex flex-col justify-between min-h-64"
              >
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${plant.status === 'ativo'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                        <Sun className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors text-base truncate pr-1">
                        {plant.name}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${plant.status === 'ativo'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                      }`}>
                      {plant.status === 'ativo' ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  {/* Info List */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-450 dark:text-slate-400">Beneficiários:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-450" />
                        {plant.beneficiaries.length} {plant.beneficiariesLimit ? `/ ${plant.beneficiariesLimit}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-450 dark:text-slate-400">Geração Mensal:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <BatteryCharging className="w-3.5 h-3.5 text-slate-450" />
                        {plant.lastMonthProduction.toLocaleString()} kWh
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-450 dark:text-slate-400">Painéis Instalados:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {plant.panelsCount} placas
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Alert Badge inside the card */}
                  {plant.status === 'ativo' && (
                    <>
                      {needsRedAlert && (
                        <div className="mt-3 px-3 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 rounded-xl text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                          <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="truncate">Manutenção atrasada! (há {monthsSinceMaintenance} meses)</span>
                        </div>
                      )}

                      {needsYellowAlert && (
                        <div className="mt-3 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-650 dark:text-amber-500 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="truncate">Manutenção necessária (há {monthsSinceMaintenance} meses)</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Action Bottom */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-between items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Ver detalhes completos
                  </span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Nenhuma Usina Encontrada</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 mb-4 max-w-sm">
            Nenhuma usina solar atendeu aos seus filtros ou critérios de busca informados.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSortOrder('default'); }}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Limpar Filtros
          </button>
        </div>
      )}

    </div>
  );
}
