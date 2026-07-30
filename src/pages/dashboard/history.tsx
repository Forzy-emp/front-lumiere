
import { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const transactions = [
    { id: 'TX-1004', name: 'João Silva', email: 'joao.silva@email.com', plan: 'Premium', status: 'Concluído', amount: 'R$ 99,00', date: '24/07/2026' },
    { id: 'TX-1003', name: 'Maria Souza', email: 'maria.souza@email.com', plan: 'Pro', status: 'Pendente', amount: 'R$ 49,00', date: '23/07/2026' },
    { id: 'TX-1002', name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', plan: 'Pro', status: 'Concluído', amount: 'R$ 49,00', date: '22/07/2026' },
    { id: 'TX-1001', name: 'Lucas Santos', email: 'lucas.santos@email.com', plan: 'Premium', status: 'Cancelado', amount: 'R$ 99,00', date: '20/07/2026' },
    { id: 'TX-1000', name: 'Juliana Lima', email: 'juliana.lima@email.com', plan: 'Enterprise', status: 'Concluído', amount: 'R$ 299,00', date: '19/07/2026' },
  ];

  // Filtering logic
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && tx.status === 'Concluído') ||
      (statusFilter === 'pending' && tx.status === 'Pendente') ||
      (statusFilter === 'cancelled' && tx.status === 'Cancelado');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Title section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Histórico de Transações</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie e analise todos os pagamentos e movimentações financeiras da plataforma.</p>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por ID, nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent appearance-none transition-all duration-200"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluídos</option>
              <option value="pending">Pendentes</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all w-full sm:w-auto justify-center">
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-lumiere-primary">{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-855 dark:text-slate-100">{tx.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{tx.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-650 dark:text-slate-300">
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                        tx.status === 'Concluído' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                          : tx.status === 'Pendente' 
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
                          : 'bg-red-50 dark:bg-red-950/40 text-red-705 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'Concluído' 
                            ? 'bg-emerald-500' 
                            : tx.status === 'Pendente' 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                        }`} />
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 text-right">{tx.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Nenhuma transação encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination Simulator */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <span>Mostrando {filteredTransactions.length} de {transactions.length} registros</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs opacity-50 cursor-not-allowed">Anterior</button>
            <button disabled className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs opacity-50 cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}