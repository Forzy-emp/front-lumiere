import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InvoiceField } from './InvoiceField';
import { useDialog } from '../hooks/useDialog';
import { isAxiosError } from 'axios';
import { competenciaParaMes, formatarCompetencia, mesReferencia, validarCompetencia } from '../utils/competencia';
import {
  X,
  Save,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
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
  idUsina?: number;
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
  idUsina?: number;
  isOpen?: boolean;
  competenciasCadastradas?: string[];
  competenciasPermitidas?: string[];
  submitLabel?: string;
  onClose?: () => void;
  onSave: (dados: ContaEnergia) => Promise<void> | void;
}

export function CadastroContaEnergia({
  idUsina,
  isOpen = true,
  onClose,
  onSave,
  competenciasCadastradas = [],
  competenciasPermitidas,
  submitLabel = 'Salvar Conta',
}: CadastroContaEnergiaProps) {
  // --- Seção 1: Identificação da Fatura (Obrigatórios) ---
  const [competencia, setCompetencia] = useState(() => {
    const preferida = competenciasPermitidas
      ? competenciasPermitidas.find(mes => !competenciasCadastradas.some(data => data.slice(0, 7) === mes))
      : mesReferencia(new Date(), -1);
    return preferida && !competenciasCadastradas.some(data => data.slice(0, 7) === preferida)
      ? formatarCompetencia(preferida) : '';
  });
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
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

  const closeDialog = useCallback(() => {
    if (!savingRef.current) onClose?.();
  }, [onClose]);
  const dialogRef = useDialog(isOpen, closeDialog);
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

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
    if (savingRef.current) return;
    resetForm();
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current) return;
    setError(null);
    const competenciaError = validarCompetencia(competencia, competenciasCadastradas, competenciasPermitidas);
    if (competenciaError) {
      setError(competenciaError);
      return;
    }

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

    const camposEnergiaObrigatorios = [
      fornecidaTusdQtd,
      fornecidaTusdPreco,
      fornecidaTusdValor,

      fornecidaTeQtd,
      fornecidaTePreco,
      fornecidaTeValor,

      injetadaTusdQtd,
      injetadaTusdPreco,
      injetadaTusdValor,

      injetadaTeQtd,
      injetadaTePreco,
      injetadaTeValor,
    ];

    if (
      camposEnergiaObrigatorios.some(
        (campo) =>
          campo === '' ||
          campo === null ||
          isNaN(Number(campo))
      )
    ) {
      setError(
        'Preencha todos os dados de TUSD e TE fornecida e injetada.'
      );

      return;
    }

    // Montagem do objeto JSON estritamente tipado
    const contaEnergiaData: ContaEnergia = {
      idUsina,
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

    savingRef.current = true;
    setSaving(true);
    try {
      await onSave(contaEnergiaData);

      resetForm();
    } catch (error: unknown) {
      const mensagem = isAxiosError(error) ? error.response?.data?.message : error instanceof Error ? error.message : null;

      if (Array.isArray(mensagem)) {
        setError(mensagem.join(' '));
      } else {
        setError(
          mensagem ||
          'Não foi possível cadastrar a fatura.'
        );
      }
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm sm:p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="invoice-title" aria-describedby="invoice-description" tabIndex={-1}
        className="flex h-dvh w-full min-w-0 flex-col overflow-hidden bg-white dark:bg-slate-900 shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:max-w-5xl sm:rounded-2xl border border-slate-200 dark:border-slate-800">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"><FileText className="h-5 w-5" /></div>
            <div><h3 id="invoice-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">Nova fatura de energia</h3>
              <p id="invoice-description" className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tenha sua conta de luz em mãos. Os campos com * são obrigatórios.</p></div>
          </div>
          <button type="button" onClick={handleCancel} disabled={saving} aria-label="Fechar cadastro de fatura" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </header>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 dark:bg-slate-950/50 p-4 sm:p-6">
            {error && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
            <fieldset disabled={saving} className="min-w-0 space-y-5">
              <section className="invoice-section space-y-4">
                <h4 className="invoice-heading">Dados da fatura</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="invoice-month" className="ui-label">Competência * </label>
                    {competenciasPermitidas ? <select id="invoice-month" className="ui-input" required value={competencia ? competenciaParaMes(competencia) : ''} onChange={e => setCompetencia(e.target.value ? formatarCompetencia(e.target.value) : '')}>
                      <option value="">Selecione o mês</option>
                      {competenciasPermitidas.map(mes => {
                        const cadastrada = competenciasCadastradas.some(data => data.slice(0, 7) === mes);
                        return <option key={mes} value={mes} disabled={cadastrada}>{formatarCompetencia(mes)}{cadastrada ? ' — adicionada' : ''}</option>;
                      })}
                    </select> : <input id="invoice-month" type="text" inputMode="numeric" placeholder="MM/AAAA" maxLength={7} value={competencia} onChange={handleCompetenciaChange} className="ui-input" required />}
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Mês e ano de referência da conta.</p>
                  </div>
                  <InvoiceField label="Vencimento" value={vencimento} onChange={setVencimento} required type="date" />
                  <InvoiceField label="Total a pagar (R$)" value={saldoPagar} onChange={setSaldoPagar} required />
                </div>
              </section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section className="invoice-section space-y-4">
                <div><h4 className="invoice-heading"><ArrowDownLeft className="w-4 h-4 text-blue-500" />Energia fornecida</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Energia recebida da distribuidora, conforme a fatura.</p></div>
                <fieldset className="min-w-0 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <legend className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-2">TUSD</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InvoiceField label="Quantidade (kWh)" value={fornecidaTusdQtd} onChange={setFornecidaTusdQtd} required />
                    <InvoiceField label="Preço (R$/kWh)" value={fornecidaTusdPreco} onChange={setFornecidaTusdPreco} required />
                    <InvoiceField label="Valor (R$)" value={fornecidaTusdValor} onChange={setFornecidaTusdValor} required />
                  </div>
                </fieldset>
<fieldset className="min-w-0 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <legend className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-2">TE</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InvoiceField label="Quantidade (kWh)" value={fornecidaTeQtd} onChange={setFornecidaTeQtd} required />
                    <InvoiceField label="Preço (R$/kWh)" value={fornecidaTePreco} onChange={setFornecidaTePreco} required />
                    <InvoiceField label="Valor (R$)" value={fornecidaTeValor} onChange={setFornecidaTeValor} required />
                  </div>
                </fieldset>
              </section>
                <section className="invoice-section space-y-4">
                <div><h4 className="invoice-heading"><ArrowUpRight className="w-4 h-4 text-blue-500" />Energia injetada</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Energia enviada à rede, conforme a fatura.</p></div>
                <fieldset className="min-w-0 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <legend className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-2">TUSD</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InvoiceField label="Quantidade (kWh)" value={injetadaTusdQtd} onChange={setInjetadaTusdQtd} required />
                    <InvoiceField label="Preço (R$/kWh)" value={injetadaTusdPreco} onChange={setInjetadaTusdPreco} required />
                    <InvoiceField label="Valor (R$)" value={injetadaTusdValor} onChange={setInjetadaTusdValor} required />
                  </div>
                </fieldset>
<fieldset className="min-w-0 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <legend className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-2">TE</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InvoiceField label="Quantidade (kWh)" value={injetadaTeQtd} onChange={setInjetadaTeQtd} required />
                    <InvoiceField label="Preço (R$/kWh)" value={injetadaTePreco} onChange={setInjetadaTePreco} required />
                    <InvoiceField label="Valor (R$)" value={injetadaTeValor} onChange={setInjetadaTeValor} required />
                  </div>
                </fieldset>
              </section>
              </div>
              <div><h4 className="invoice-heading">Informações complementares</h4><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Preencha apenas o que aparecer na sua conta.</p></div>
              <details className="invoice-optional">
                <summary>Bandeira tarifária <span className="font-normal text-slate-500">· opcional</span></summary>
                <div className="p-4 sm:p-5 space-y-4">
                  <div><label htmlFor="invoice-flag" className="ui-label">Bandeira do período</label><select id="invoice-flag" value={bandeiraTipo} onChange={e => setBandeiraTipo(e.target.value)} className="ui-input">
                    <option value="">Não informada</option>
                    {['Verde','Amarela','Vermelha Patamar 1','Vermelha Patamar 2'].map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                  </select></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InvoiceField label="Fornecida (kWh)" value={bandeiraFornecidaQtd} onChange={setBandeiraFornecidaQtd} /><InvoiceField label="Valor fornecida (R$)" value={bandeiraFornecidaValor} onChange={setBandeiraFornecidaValor} />
                    <InvoiceField label="Injetada (kWh)" value={bandeiraInjetadaQtd} onChange={setBandeiraInjetadaQtd} /><InvoiceField label="Valor injetada (R$)" value={bandeiraInjetadaValor} onChange={setBandeiraInjetadaValor} />
                  </div>
                </div>
              </details>
              <details className="invoice-optional">
                <summary>Encargos e contribuições <span className="font-normal text-slate-500">· opcional</span></summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5">
                  <InvoiceField label="Multa (R$)" value={multa} onChange={setMulta} /><InvoiceField label="Juros (R$)" value={juros} onChange={setJuros} /><InvoiceField label="Contribuição municipal (R$)" value={contribuicaoMunicipal} onChange={setContribuicaoMunicipal} /><InvoiceField label="Outros encargos (R$)" value={outros} onChange={setOutros} />
                </div>
              </details>
              <details className="invoice-optional">
                <summary>Créditos de energia <span className="font-normal text-slate-500">· opcional</span></summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5">
                  <InvoiceField label="Energia injetada informada (kWh)" value={energiaInjetadaInformada} onChange={setEnergiaInjetadaInformada} /><InvoiceField label="Créditos recebidos (kWh)" value={creditosRecebidos} onChange={setCreditosRecebidos} /><InvoiceField label="Participação no saldo (%)" value={participacaoSaldo} onChange={setParticipacaoSaldo} /><InvoiceField label="Saldo total (kWh)" value={saldoTotal} onChange={setSaldoTotal} /><InvoiceField label="Saldo atualizado (kWh)" value={saldoAtualizado} onChange={setSaldoAtualizado} />
                </div>
              </details>
            </fieldset>
          </div>
          <footer className="safe-bottom shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">Confira a competência e os valores antes de salvar.</p>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <button type="button" onClick={handleCancel} disabled={saving} className="ui-secondary">Cancelar</button>
              <button type="submit" disabled={saving} className="ui-primary"><Save className="w-4 h-4 shrink-0" />{saving ? 'Salvando...' : submitLabel}</button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default CadastroContaEnergia;
