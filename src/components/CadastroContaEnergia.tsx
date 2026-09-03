import React, { useState } from 'react';
import {
  X,
  Save,
  FileText,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Flag,
  Receipt,
  Coins,
  AlertCircle
} from 'lucide-react';

export interface ItemEnergiaAtiva {
  quantidade: number | null;
  precoUnitario: number | null;
  valor: number | null;
}

export interface BlocoEnergiaAtiva {
  tusd: ItemEnergiaAtiva;
  te: ItemEnergiaAtiva;
}

export interface ItemBandeira {
  quantidade: number | null;
  valor: number | null;
}

export interface BandeiraTarifaria {
  tipo: string;
  energiaFornecida: ItemBandeira;
  energiaInjetada: ItemBandeira;
}

export interface Encargos {
  multa: number | null;
  juros: number | null;
  contribuicaoMunicipal: number | null;
  outros: number | null;
}

export interface CreditosEnergia {
  energiaInjetadaInformada: number | null;
  creditosRecebidos: number | null;
  participacaoSaldo: number | null;
  saldoTotal: number | null;
  saldoAtualizado: number | null;
}

export interface ContaEnergia {
  idUsina: number;
  competencia: string;
  vencimento: string;
  saldoPagar: number;
  energiaAtivaFornecida: BlocoEnergiaAtiva;
  energiaAtivaInjetada: BlocoEnergiaAtiva;
  bandeira?: BandeiraTarifaria;
  encargos?: Encargos;
  creditosEnergia?: CreditosEnergia;
}

export interface CadastroContaEnergiaProps {
  idUsina: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSave: (dados: ContaEnergia) => void;
}

export function CadastroContaEnergia({
  idUsina,
  isOpen = true,
  onClose,
  onSave,
}: CadastroContaEnergiaProps) {
  // --- Seção 1: Identificação da Fatura (Obrigatórios) ---
  const [competencia, setCompetencia] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [saldoPagar, setSaldoPagar] = useState<string | number>('');

  // --- Seção 2: Energia Ativa Fornecida ---
  const [fornecidaTusdQtd, setFornecidaTusdQtd] = useState<string | number>('');
  const [fornecidaTusdPreco, setFornecidaTusdPreco] = useState<string | number>('');
  const [fornecidaTusdValor, setFornecidaTusdValor] = useState<string | number>('');

  const [fornecidaTeQtd, setFornecidaTeQtd] = useState<string | number>('');
  const [fornecidaTePreco, setFornecidaTePreco] = useState<string | number>('');
  const [fornecidaTeValor, setFornecidaTeValor] = useState<string | number>('');

  // --- Seção 3: Energia Ativa Injetada ---
  const [injetadaTusdQtd, setInjetadaTusdQtd] = useState<string | number>('');
  const [injetadaTusdPreco, setInjetadaTusdPreco] = useState<string | number>('');
  const [injetadaTusdValor, setInjetadaTusdValor] = useState<string | number>('');

  const [injetadaTeQtd, setInjetadaTeQtd] = useState<string | number>('');
  const [injetadaTePreco, setInjetadaTePreco] = useState<string | number>('');
  const [injetadaTeValor, setInjetadaTeValor] = useState<string | number>('');

  // --- Seção 4: Bandeira Tarifária (Opcional) ---
  const [bandeiraTipo, setBandeiraTipo] = useState('');
  const [bandeiraFornecidaQtd, setBandeiraFornecidaQtd] = useState<string | number>('');
  const [bandeiraFornecidaValor, setBandeiraFornecidaValor] = useState<string | number>('');
  const [bandeiraInjetadaQtd, setBandeiraInjetadaQtd] = useState<string | number>('');
  const [bandeiraInjetadaValor, setBandeiraInjetadaValor] = useState<string | number>('');

  // --- Seção 5: Encargos (Opcional) ---
  const [multa, setMulta] = useState<string | number>('');
  const [juros, setJuros] = useState<string | number>('');
  const [contribuicaoMunicipal, setContribuicaoMunicipal] = useState<string | number>('');
  const [outros, setOutros] = useState<string | number>('');

  // --- Seção 6: Créditos de Energia (Opcional) ---
  const [energiaInjetadaInformada, setEnergiaInjetadaInformada] = useState<string | number>('');
  const [creditosRecebidos, setCreditosRecebidos] = useState<string | number>('');
  const [participacaoSaldo, setParticipacaoSaldo] = useState<string | number>('');
  const [saldoTotal, setSaldoTotal] = useState<string | number>('');
  const [saldoAtualizado, setSaldoAtualizado] = useState<string | number>('');

  // Mensagens de erro / validação
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper para conversão de valores numéricos independentes
  const parseNumOrNull = (val: string | number): number | null => {
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  // Formatação da competência para MM/AAAA
  const handleCompetenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 6) val = val.slice(0, 6);
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCompetencia(val);
  };

  // Limpeza de formulário
  const resetForm = () => {
    setCompetencia('');
    setVencimento('');
    setSaldoPagar('');
    setFornecidaTusdQtd('');
    setFornecidaTusdPreco('');
    setFornecidaTusdValor('');
    setFornecidaTeQtd('');
    setFornecidaTePreco('');
    setFornecidaTeValor('');
    setInjetadaTusdQtd('');
    setInjetadaTusdPreco('');
    setInjetadaTusdValor('');
    setInjetadaTeQtd('');
    setInjetadaTePreco('');
    setInjetadaTeValor('');
    setBandeiraTipo('');
    setBandeiraFornecidaQtd('');
    setBandeiraFornecidaValor('');
    setBandeiraInjetadaQtd('');
    setBandeiraInjetadaValor('');
    setMulta('');
    setJuros('');
    setContribuicaoMunicipal('');
    setOutros('');
    setEnergiaInjetadaInformada('');
    setCreditosRecebidos('');
    setParticipacaoSaldo('');
    setSaldoTotal('');
    setSaldoAtualizado('');
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação de campos obrigatórios
    if (!competencia.trim()) {
      setError('Por favor, informe a competência da fatura (Mês/Ano).');
      return;
    }

    if (!vencimento.trim()) {
      setError('Por favor, informe a data de vencimento da fatura.');
      return;
    }

    if (saldoPagar === '' || saldoPagar === null || isNaN(Number(saldoPagar))) {
      setError('Por favor, informe o saldo a pagar da fatura.');
      return;
    }

    // Montagem do objeto JSON estritamente tipado
    const contaEnergiaData: ContaEnergia = {
      idUsina: Number(idUsina),
      competencia: competencia.trim(),
      vencimento: vencimento.trim(),
      saldoPagar: Number(saldoPagar),

      energiaAtivaFornecida: {
        tusd: {
          quantidade: parseNumOrNull(fornecidaTusdQtd),
          precoUnitario: parseNumOrNull(fornecidaTusdPreco),
          valor: parseNumOrNull(fornecidaTusdValor),
        },
        te: {
          quantidade: parseNumOrNull(fornecidaTeQtd),
          precoUnitario: parseNumOrNull(fornecidaTePreco),
          valor: parseNumOrNull(fornecidaTeValor),
        },
      },

      energiaAtivaInjetada: {
        tusd: {
          quantidade: parseNumOrNull(injetadaTusdQtd),
          precoUnitario: parseNumOrNull(injetadaTusdPreco),
          valor: parseNumOrNull(injetadaTusdValor),
        },
        te: {
          quantidade: parseNumOrNull(injetadaTeQtd),
          precoUnitario: parseNumOrNull(injetadaTePreco),
          valor: parseNumOrNull(injetadaTeValor),
        },
      },

      bandeira: {
        tipo: bandeiraTipo || '',
        energiaFornecida: {
          quantidade: parseNumOrNull(bandeiraFornecidaQtd),
          valor: parseNumOrNull(bandeiraFornecidaValor),
        },
        energiaInjetada: {
          quantidade: parseNumOrNull(bandeiraInjetadaQtd),
          valor: parseNumOrNull(bandeiraInjetadaValor),
        },
      },

      encargos: {
        multa: parseNumOrNull(multa),
        juros: parseNumOrNull(juros),
        contribuicaoMunicipal: parseNumOrNull(contribuicaoMunicipal),
        outros: parseNumOrNull(outros),
      },

      creditosEnergia: {
        energiaInjetadaInformada: parseNumOrNull(energiaInjetadaInformada),
        creditosRecebidos: parseNumOrNull(creditosRecebidos),
        participacaoSaldo: parseNumOrNull(participacaoSaldo),
        saldoTotal: parseNumOrNull(saldoTotal),
        saldoAtualizado: parseNumOrNull(saldoAtualizado),
      },
    };

    onSave(contaEnergiaData);
    resetForm();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                Cadastro de Conta de Energia
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informe os dados da fatura de energia elétrica da usina.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com Scroll Interno */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
            
            {/* Mensagem de Erro */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SEÇÃO 1: Identificação da Fatura */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750/60 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-750/50 pb-2.5">
                <FileText className="w-4 h-4 text-[#2E5CFF]" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Seção 1 - Identificação da Fatura <span className="text-red-500 font-bold">*</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Competência (Mês/Ano) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 08/2026"
                    maxLength={7}
                    value={competencia}
                    onChange={handleCompetenciaChange}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Formato: MM/AAAA</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Vencimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Saldo a Pagar (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 250.00"
                    value={saldoPagar}
                    onChange={(e) => setSaldoPagar(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Valor total monetário da fatura</span>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: Energia Ativa Fornecida */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750/60 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-750/50 pb-2.5">
                <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Seção 2 - Energia Ativa Fornecida
                </h4>
              </div>

              <div className="space-y-4">
                {/* Bloco TUSD */}
                <div className="bg-white dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
                  <span className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2.5">
                    TUSD
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Quantidade (kWh)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={fornecidaTusdQtd}
                        onChange={(e) => setFornecidaTusdQtd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={fornecidaTusdPreco}
                        onChange={(e) => setFornecidaTusdPreco(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={fornecidaTusdValor}
                        onChange={(e) => setFornecidaTusdValor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloco TE */}
                <div className="bg-white dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
                  <span className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2.5">
                    TE
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Quantidade (kWh)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={fornecidaTeQtd}
                        onChange={(e) => setFornecidaTeQtd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={fornecidaTePreco}
                        onChange={(e) => setFornecidaTePreco(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={fornecidaTeValor}
                        onChange={(e) => setFornecidaTeValor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: Energia Ativa Injetada */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750/60 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-750/50 pb-2.5">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Seção 3 - Energia Ativa Injetada
                </h4>
              </div>

              <div className="space-y-4">
                {/* Bloco TUSD */}
                <div className="bg-white dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
                  <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5">
                    TUSD
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Quantidade (kWh)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={injetadaTusdQtd}
                        onChange={(e) => setInjetadaTusdQtd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={injetadaTusdPreco}
                        onChange={(e) => setInjetadaTusdPreco(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={injetadaTusdValor}
                        onChange={(e) => setInjetadaTusdValor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloco TE */}
                <div className="bg-white dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
                  <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5">
                    TE
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Quantidade (kWh)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={injetadaTeQtd}
                        onChange={(e) => setInjetadaTeQtd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={injetadaTePreco}
                        onChange={(e) => setInjetadaTePreco(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={injetadaTeValor}
                        onChange={(e) => setInjetadaTeValor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: Bandeira Tarifária (Opcional) */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750/60 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-750/50 pb-2.5">
                <Flag className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Seção 4 - Bandeira Tarifária
                  <span className="text-[11px] font-normal text-slate-400 lowercase ml-1.5">(opcional)</span>
                </h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Bandeira
                </label>
                <select
                  value={bandeiraTipo}
                  onChange={(e) => setBandeiraTipo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">Selecione ou deixe em branco</option>
                  <option value="Verde">Verde</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Vermelha Patamar 1">Vermelha Patamar 1</option>
                  <option value="Vermelha Patamar 2">Vermelha Patamar 2</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Consumo adicional da bandeira - Energia fornecida */}
                <div className="bg-white dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                    Consumo adicional da bandeira - Energia fornecida
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Quantidade (kWh)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={bandeiraFornecidaQtd}
                        onChange={(e) => setBandeiraFornecidaQtd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={bandeiraFornecidaValor}
                        onChange={(e) => setBandeiraFornecidaValor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Energia injetada adicional da bandeira */}
                <div className="bg-white dark:bg-slate-850/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3.5">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                    Energia injetada adicional da bandeira
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Quantidade (kWh)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={bandeiraInjetadaQtd}
                        onChange={(e) => setBandeiraInjetadaQtd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-350 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0,00"
                        value={bandeiraInjetadaValor}
                        onChange={(e) => setBandeiraInjetadaValor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 5: Encargos (Opcional) */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750/60 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-750/50 pb-2.5">
                <Receipt className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Seção 5 - Encargos
                  <span className="text-[11px] font-normal text-slate-400 lowercase ml-1.5">(opcional)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Multa (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={multa}
                    onChange={(e) => setMulta(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Juros (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={juros}
                    onChange={(e) => setJuros(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Contrib. Municipal (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={contribuicaoMunicipal}
                    onChange={(e) => setContribuicaoMunicipal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Outros (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={outros}
                    onChange={(e) => setOutros(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 6: Créditos de Energia (Opcional) */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750/60 rounded-xl p-4.5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-750/50 pb-2.5">
                <Coins className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Seção 6 - Créditos de Energia
                  <span className="text-[11px] font-normal text-slate-400 lowercase ml-1.5">(opcional)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Energia Injetada Informada (kWh)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={energiaInjetadaInformada}
                    onChange={(e) => setEnergiaInjetadaInformada(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Créditos Recebidos (kWh)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={creditosRecebidos}
                    onChange={(e) => setCreditosRecebidos(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Participação no Saldo (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ex: 100"
                    value={participacaoSaldo}
                    onChange={(e) => setParticipacaoSaldo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Saldo Total (kWh)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={saldoTotal}
                    onChange={(e) => setSaldoTotal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                    Saldo Atualizado (kWh)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={saldoAtualizado}
                    onChange={(e) => setSaldoAtualizado(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Rodapé / Botões de Ação */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white rounded-xl text-xs md:text-sm font-bold shadow-md hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Conta
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CadastroContaEnergia;
