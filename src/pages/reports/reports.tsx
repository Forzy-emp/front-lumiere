import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  BatteryCharging,
  CircleDollarSign,
  Gauge,
  Zap,
  TrendingDown,
  ReceiptText,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileText,
  TriangleAlert,
  PlugZap,
  ClipboardCheck,
  Coins,
  ChartNoAxesColumnIncreasing,
  ChartSpline,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

import { GetMyUsinas } from "../../service/usina";
import { GetFaturas, GetCalculosFatura } from "../../service/fatura";

interface Usina {
  id: number;
  name: string;
}

interface Fatura {
  id: number;
  usinaId: number;
  competencia: string;
  valor_total: string | number;

  saldo_creditos_kwh: string | number | null;
  creditos_recebidos_kwh: string | number | null;
  participacao_saldo_percentual: string | number | null;
  saldo_total_creditos_kwh: string | number | null;

  fatura_item?: Array<{
    id: number;
    tipo: string;
    quantidade: string | number | null;
    valor: string | number;
  }>;
}

interface Calculos {
  fatura: {
    id: number;
    usinaId: number;
    usina: string;
    competencia: string;
    valorTotal: number;
  };

  energia: {
    fornecidaKwh: number;
    injetadaKwh: number;
    consumoLiquidoKwh: number;
    taxaCompensacaoPercentual: number;
  };

  valores: {
    valorCompensado: number;
    custoEnergeticoBruto: number;
    custoEnergeticoLiquido: number;
    reducaoPercentual: number;
    custoMedioKwh: number;
    valorMedioCompensadoKwh: number;
  };

  tarifas: {
    tarifaCheia: number;
    tarifaScee: number;
    diferencaTarifaria: number;
    percentualTusd: number;
  };

  bandeira: {
    valorFornecida: number;
    valorInjetada: number;
    impactoLiquido: number;
  };

  encargos: {
    total: number;
    percentualFatura: number;
  };

  custoDisponibilidade: {
    tipoLigacao: string | null;
    quantidadeMinimaKwh: number | null;
    valor: number | null;
  };

  benchmarkRegulatorio: {
    energiaNaoCompensadaKwh: number;
    valorEnergiaSemCompensacao: number | null;
    cdd: number | null;
    energiaCompensadaNecessariaKwh: number | null;
    valorCompensadoConsideradoPiso: number | null;
    faturamentoRegulatorio: number | null;
    valorMinimoAplicavel: number | null;
  };

  reconstrucaoFatura: {
    tusdFornecida: number;
    tusdInjetada: number;
    teFornecida: number;
    teInjetada: number;
    tusdTeLiquido: number;

    bandeiraFornecida: number;
    bandeiraInjetada: number;
    bandeiraLiquida: number;

    contribuicaoMunicipal: number;
    multa: number;
    juros: number;
    outros: number;

    valorTotalInformado: number;
    reconstrucaoSimples: number;
  };

  alertasAuditoria: {
    benchmarkRegulatorio: number | null;
    tusdTeLiquido: number;
    diferencaBenchmarkLinhas: number | null;

    valorTotalInformado: number;
    reconstrucaoSimples: number;
    diferencaReconstrucaoTotal: number;
  };

  tiposLigacao: Array<{
    tipoLigacao: string;
    quantidadeMinimaKwh: number;
    cdd: number;

    energiaNaoCompensadaKwh: number;
    valorEnergiaNaoCompensada: number;

    energiaCompensadaNecessariaKwh: number;
    pisoRegulatorio: number;
  }>;

  conferencia: Array<{
    tipo: string;
    quantidade: number | null;
    precoUnitario: number | null;
    valorCalculado: number | null;
    valorInformado: number | null;
    diferenca: number | null;
    conferido: boolean | null;
    presente: boolean;
  }>;
}

export default function Reports() {
  const [usinas, setUsinas] = useState<Usina[]>([]);
  const [usinaSelecionada, setUsinaSelecionada] = useState<number | null>(null);

  const [todasFaturas, setTodasFaturas] = useState<Fatura[]>([]);
  const [faturas, setFaturas] = useState<Fatura[]>([]);

  const [faturaSelecionada, setFaturaSelecionada] = useState<number | null>(
    null,
  );

  const [calculos, setCalculos] = useState<Calculos | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingCalculos, setLoadingCalculos] = useState(false);

  // ---------------------------------------------------------
  // CARREGA USINAS E FATURAS QUE PERTENCEM AO USUÁRIO
  // ---------------------------------------------------------
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);

        const [dadosUsinas, dadosFaturas] = await Promise.all([
          GetMyUsinas(),
          GetFaturas(),
        ]);

        setUsinas(dadosUsinas);
        setTodasFaturas(dadosFaturas);

        if (dadosUsinas.length > 0) {
          setUsinaSelecionada(dadosUsinas[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // ---------------------------------------------------------
  // FILTRA FATURAS QUANDO TROCA A USINA
  // ---------------------------------------------------------
  useEffect(() => {
    if (!usinaSelecionada) {
      setFaturas([]);
      setFaturaSelecionada(null);
      setCalculos(null);
      return;
    }

    const filtradas = todasFaturas
      .filter((fatura) => Number(fatura.usinaId) === Number(usinaSelecionada))
      .sort(
        (a, b) =>
          new Date(b.competencia).getTime() - new Date(a.competencia).getTime(),
      );

    setFaturas(filtradas);

    if (filtradas.length > 0) {
      setFaturaSelecionada(filtradas[0].id);
    } else {
      setFaturaSelecionada(null);
      setCalculos(null);
    }
  }, [usinaSelecionada, todasFaturas]);

  // ---------------------------------------------------------
  // BUSCA CÁLCULOS DA COMPETÊNCIA SELECIONADA
  // ---------------------------------------------------------
  useEffect(() => {
    const carregarCalculos = async () => {
      if (!faturaSelecionada) {
        setCalculos(null);
        return;
      }

      try {
        setLoadingCalculos(true);

        const dados = await GetCalculosFatura(faturaSelecionada);

        setCalculos(dados);
      } catch (error) {
        console.error("Erro ao carregar cálculos da fatura:", error);

        setCalculos(null);
      } finally {
        setLoadingCalculos(false);
      }
    };

    carregarCalculos();
  }, [faturaSelecionada]);

  const faturaAtual = useMemo(() => {
    return faturas.find((fatura) => fatura.id === faturaSelecionada) ?? null;
  }, [faturas, faturaSelecionada]);

  // ---------------------------------------------------------
  // FORMATADORES
  // ---------------------------------------------------------
  const moeda = (valor?: number | string | null) =>
    Number(valor ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const numero = (valor?: number | string | null, casas = 2) =>
    Number(valor ?? 0).toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    });

  const competencia = (data: string) => {
    const date = new Date(data);

    return date
      .toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(/^./, (letra) => letra.toUpperCase());
  };

  const competenciaCurta = (data: string) => {
    const date = new Date(data);

    return date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    });
  };

  // ---------------------------------------------------------
  // GRÁFICO: ENERGIA FORNECIDA X INJETADA
  // Histórico obtido diretamente das faturas
  // ---------------------------------------------------------
  const dadosEnergia = useMemo(() => {
    return [...faturas].reverse().map((fatura) => {
      const tusdFornecida = fatura.fatura_item?.find(
        (item) => item.tipo === "TUSD_FORNECIDA",
      );

      const tusdInjetada = fatura.fatura_item?.find(
        (item) => item.tipo === "TUSD_INJETADA",
      );

      return {
        competencia: competenciaCurta(fatura.competencia),
        fornecida: Number(tusdFornecida?.quantidade ?? 0),
        injetada: Number(tusdInjetada?.quantidade ?? 0),
      };
    });
  }, [faturas]);

  // ---------------------------------------------------------
  // GRÁFICO: EVOLUÇÃO DO SALDO DE CRÉDITOS
  // ---------------------------------------------------------
  const dadosCreditos = useMemo(() => {
    return [...faturas].reverse().map((fatura) => ({
      competencia: competenciaCurta(fatura.competencia),
      saldo: Number(fatura.saldo_creditos_kwh ?? 0),
    }));
  }, [faturas]);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-lumiere-primary" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // SEM USINAS
  // ---------------------------------------------------------
  if (usinas.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Sun className="mx-auto mb-4 h-12 w-12 text-slate-300" />

        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Nenhuma usina encontrada
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Você ainda não possui usinas disponíveis para gerar relatórios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------- */}
      {/* CABEÇALHO */}
      {/* -------------------------------------------------- */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
            <BarChart3 className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Relatórios
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Análise energética e financeira da usina
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* FILTROS */}
      {/* -------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2">
          {/* USINA */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Usina
            </label>

            <select
              aria-label="Usina do relatório"
              value={usinaSelecionada ?? ""}
              onChange={(e) => setUsinaSelecionada(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-lumiere-primary focus:ring-2 focus:ring-lumiere-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {usinas.map((usina) => (
                <option key={usina.id} value={usina.id}>
                  {usina.name}
                </option>
              ))}
            </select>
          </div>

          {/* COMPETÊNCIA */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Competência
            </label>

            <select
              aria-label="Competência do relatório"
              value={faturaSelecionada ?? ""}
              disabled={faturas.length === 0}
              onChange={(e) => setFaturaSelecionada(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-lumiere-primary focus:ring-2 focus:ring-lumiere-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {faturas.length === 0 ? (
                <option>Nenhuma fatura cadastrada</option>
              ) : (
                faturas.map((fatura) => (
                  <option key={fatura.id} value={fatura.id}>
                    {competencia(fatura.competencia)}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* SEM FATURAS */}
      {/* -------------------------------------------------- */}
      {faturas.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <ReceiptText className="mx-auto mb-4 h-12 w-12 text-slate-300" />

          <h2 className="font-bold text-slate-700 dark:text-slate-200">
            Nenhuma fatura encontrada
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Essa usina ainda não possui competências cadastradas.
          </p>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* DASHBOARD */}
      {/* -------------------------------------------------- */}
      {faturaAtual && (
        <>
          {loadingCalculos ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Calculando indicadores...
            </div>
          ) : (
            calculos && (
              <>
                {/* ------------------------------------------ */}
                {/* PRIMEIRA LINHA */}
                {/* ------------------------------------------ */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <CardIndicador
                    titulo="Energia Injetada"
                    valor={`${numero(calculos.energia.injetadaKwh, 2)} kWh`}
                    descricao="Energia enviada para a rede"
                    icon={<Zap className="h-5 w-5" />}
                  />

                  <CardIndicador
                    titulo="Taxa de Compensação"
                    valor={`${numero(
                      calculos.energia.taxaCompensacaoPercentual,
                      2,
                    )}%`}
                    descricao="Relação entre energia injetada e fornecida"
                    icon={<Gauge className="h-5 w-5" />}
                  />

                  <CardIndicador
                    titulo="Valor Compensado"
                    valor={moeda(calculos.valores.valorCompensado)}
                    descricao="Valor energético compensado"
                    icon={<CircleDollarSign className="h-5 w-5" />}
                  />

                  <CardIndicador
                    titulo="Saldo Atual de Créditos"
                    valor={`${numero(faturaAtual.saldo_creditos_kwh, 2)} kWh`}
                    descricao="Saldo informado pela concessionária"
                    icon={<BatteryCharging className="h-5 w-5" />}
                  />
                </div>

                {/* ------------------------------------------ */}
                {/* SEGUNDA LINHA */}
                {/* ------------------------------------------ */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <CardIndicador
                    titulo="Custo Energético Bruto"
                    valor={moeda(calculos.valores.custoEnergeticoBruto)}
                    descricao="Antes da compensação"
                    icon={<CircleDollarSign className="h-5 w-5" />}
                  />

                  <CardIndicador
                    titulo="Custo Energético Líquido"
                    valor={moeda(calculos.valores.custoEnergeticoLiquido)}
                    descricao="Após a compensação"
                    icon={<CircleDollarSign className="h-5 w-5" />}
                  />

                  <CardIndicador
                    titulo="Redução de Custo"
                    valor={`${numero(calculos.valores.reducaoPercentual, 2)}%`}
                    descricao="Redução do custo energético"
                    icon={<TrendingDown className="h-5 w-5" />}
                  />

                  <CardIndicador
                    titulo="Encargos"
                    valor={moeda(calculos.encargos.total)}
                    descricao={`${numero(
                      calculos.encargos.percentualFatura,
                      2,
                    )}% do total da fatura`}
                    icon={<ReceiptText className="h-5 w-5" />}
                  />
                </div>

                {/* ================================================== */}
                {/* AUDITORIA SCEE - CÁLCULOS DO EXCEL DO CLIENTE */}
                {/* ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Auditoria SCEE
                      </h2>

                      <p className="text-xs text-slate-500">
                        Indicadores de conferência solicitados pelo cliente
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    {/* ENERGIA NÃO COMPENSADA */}
                    <MiniIndicador
                      titulo="Energia não compensada"
                      valor={`${numero(
                        calculos.energia.consumoLiquidoKwh,
                        2,
                      )} kWh`}
                    />

                    {/* TARIFA CHEIA */}
                    <MiniIndicador
                      titulo="Tarifa Cheia"
                      valor={tarifa(calculos.tarifas.tarifaCheia)}
                    />

                    <MiniIndicador
                      titulo="Tarifa SCEE"
                      valor={tarifa(calculos.tarifas.tarifaScee)}
                    />

                    <MiniIndicador
                      titulo="Diferença Tarifária"
                      valor={tarifa(calculos.tarifas.diferencaTarifaria)}
                    />

                    {/* PERCENTUAL TUSD */}
                    <MiniIndicador
                      titulo="Percentual TUSD"
                      valor={`${numero(calculos.tarifas.percentualTusd, 2)}%`}
                    />

                    {/* TIPO DE LIGAÇÃO */}
                    <MiniIndicador
                      titulo="Tipo de Ligação"
                      valor={
                        calculos.custoDisponibilidade.tipoLigacao
                          ? formatarTipoLigacao(
                              calculos.custoDisponibilidade.tipoLigacao,
                            )
                          : "Não informado"
                      }
                    />

                    {/* QUANTIDADE MÍNIMA */}
                    <MiniIndicador
                      titulo="Disponibilidade Mínima"
                      valor={
                        calculos.custoDisponibilidade.quantidadeMinimaKwh !==
                        null
                          ? `${numero(
                              calculos.custoDisponibilidade.quantidadeMinimaKwh,
                              0,
                            )} kWh`
                          : "—"
                      }
                    />

                    {/* CUSTO DE DISPONIBILIDADE */}
                    <MiniIndicador
                      titulo="Custo de Disponibilidade"
                      valor={
                        calculos.custoDisponibilidade.valor !== null
                          ? moeda(calculos.custoDisponibilidade.valor)
                          : "—"
                      }
                    />
                  </div>
                </div>

                {/* ================================================== */}
                {/* BENCHMARK REGULATÓRIO */}
                {/* ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <Scale className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Benchmark Regulatório
                      </h2>

                      <p className="text-xs text-slate-500">
                        Verificação do custo de disponibilidade e do piso
                        regulatório
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <MiniIndicador
                      titulo="Energia não compensada"
                      valor={`${numero(
                        calculos.benchmarkRegulatorio.energiaNaoCompensadaKwh,
                        3,
                      )} kWh`}
                    />

                    <MiniIndicador
                      titulo="Valor da energia sem compensação"
                      valor={
                        calculos.benchmarkRegulatorio
                          .valorEnergiaSemCompensacao !== null
                          ? moeda(
                              calculos.benchmarkRegulatorio
                                .valorEnergiaSemCompensacao,
                            )
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="CDD"
                      valor={
                        calculos.benchmarkRegulatorio.cdd !== null
                          ? moeda(calculos.benchmarkRegulatorio.cdd)
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="Energia compensada necessária"
                      valor={
                        calculos.benchmarkRegulatorio
                          .energiaCompensadaNecessariaKwh !== null
                          ? `${numero(
                              calculos.benchmarkRegulatorio
                                .energiaCompensadaNecessariaKwh,
                              4,
                            )} kWh`
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="Valor compensado considerado no piso"
                      valor={
                        calculos.benchmarkRegulatorio
                          .valorCompensadoConsideradoPiso !== null
                          ? moeda(
                              calculos.benchmarkRegulatorio
                                .valorCompensadoConsideradoPiso,
                            )
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="Faturamento regulatório"
                      valor={
                        calculos.benchmarkRegulatorio.faturamentoRegulatorio !==
                        null
                          ? moeda(
                              calculos.benchmarkRegulatorio
                                .faturamentoRegulatorio,
                            )
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="Valor mínimo aplicável"
                      valor={
                        calculos.benchmarkRegulatorio.valorMinimoAplicavel !==
                        null
                          ? moeda(
                              calculos.benchmarkRegulatorio
                                .valorMinimoAplicavel,
                            )
                          : "—"
                      }
                    />
                  </div>
                </div>

                {/* ================================================== */}
                {/* RECONSTRUÇÃO DA FATURA */}
                {/* ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Reconstrução das Linhas da Fatura
                      </h2>

                      <p className="text-xs text-slate-500">
                        Reconstrução dos valores apresentados na conta de
                        energia
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <MiniIndicador
                      titulo="TUSD fornecida"
                      valor={moeda(calculos.reconstrucaoFatura.tusdFornecida)}
                    />

                    <MiniIndicador
                      titulo="TUSD injetada"
                      valor={moeda(calculos.reconstrucaoFatura.tusdInjetada)}
                    />

                    <MiniIndicador
                      titulo="TE fornecida"
                      valor={moeda(calculos.reconstrucaoFatura.teFornecida)}
                    />

                    <MiniIndicador
                      titulo="TE injetada"
                      valor={moeda(calculos.reconstrucaoFatura.teInjetada)}
                    />

                    <MiniIndicador
                      titulo="TUSD + TE líquido"
                      valor={moeda(calculos.reconstrucaoFatura.tusdTeLiquido)}
                    />

                    <MiniIndicador
                      titulo="Bandeira fornecida"
                      valor={moeda(
                        calculos.reconstrucaoFatura.bandeiraFornecida,
                      )}
                    />

                    <MiniIndicador
                      titulo="Bandeira injetada"
                      valor={moeda(
                        calculos.reconstrucaoFatura.bandeiraInjetada,
                      )}
                    />

                    <MiniIndicador
                      titulo="Bandeira líquida"
                      valor={moeda(calculos.reconstrucaoFatura.bandeiraLiquida)}
                    />

                    <MiniIndicador
                      titulo="Contribuição Municipal (CIP)"
                      valor={moeda(
                        calculos.reconstrucaoFatura.contribuicaoMunicipal,
                      )}
                    />

                    <MiniIndicador
                      titulo="Multa"
                      valor={moeda(calculos.reconstrucaoFatura.multa)}
                    />

                    <MiniIndicador
                      titulo="Total informado"
                      valor={moeda(
                        calculos.reconstrucaoFatura.valorTotalInformado,
                      )}
                    />

                    <MiniIndicador
                      titulo="Reconstrução simples"
                      valor={moeda(
                        calculos.reconstrucaoFatura.reconstrucaoSimples,
                      )}
                    />
                  </div>
                </div>

                {/* ================================================== */}
                {/* COMPARAÇÃO E ALERTAS DE AUDITORIA */}
                {/* ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <TriangleAlert className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Comparação e Alertas de Auditoria
                      </h2>

                      <p className="text-xs text-slate-500">
                        Diferenças identificadas na reconstrução da fatura
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <MiniIndicador
                      titulo="Benchmark regulatório do piso"
                      valor={
                        calculos.alertasAuditoria.benchmarkRegulatorio !== null
                          ? moeda(
                              calculos.alertasAuditoria.benchmarkRegulatorio,
                            )
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="TUSD + TE líquido pelas linhas"
                      valor={moeda(calculos.alertasAuditoria.tusdTeLiquido)}
                    />

                    <MiniIndicador
                      titulo="Diferença benchmark × linhas"
                      valor={
                        calculos.alertasAuditoria.diferencaBenchmarkLinhas !==
                        null
                          ? moeda(
                              calculos.alertasAuditoria
                                .diferencaBenchmarkLinhas,
                            )
                          : "—"
                      }
                    />

                    <MiniIndicador
                      titulo="Total da fatura informado"
                      valor={moeda(
                        calculos.alertasAuditoria.valorTotalInformado,
                      )}
                    />

                    <MiniIndicador
                      titulo="Reconstrução simples"
                      valor={moeda(
                        calculos.alertasAuditoria.reconstrucaoSimples,
                      )}
                    />

                    <MiniIndicador
                      titulo="Diferença reconstrução × total"
                      valor={moeda(
                        calculos.alertasAuditoria.diferencaReconstrucaoTotal,
                      )}
                    />
                  </div>
                </div>

                {/* ================================================== */}
                {/* TIPOS DE LIGAÇÃO */}
                {/* ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <PlugZap className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Tipos de Ligação
                      </h2>

                      <p className="text-xs text-slate-500">
                        Comparação do custo de disponibilidade conforme o tipo
                        de ligação
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto overscroll-x-contain" role="region" aria-label="Tabela do relatório, role horizontalmente para ver todas as colunas" tabIndex={0}>
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
                          <th className="px-3 py-3">Ligação</th>
                          <th className="px-3 py-3 text-right">CDD kWh</th>
                          <th className="px-3 py-3 text-right">CDD R$</th>
                          <th className="px-3 py-3 text-right">
                            Não comp. kWh
                          </th>
                          <th className="px-3 py-3 text-right">Não comp. R$</th>
                          <th className="px-3 py-3 text-right">
                            Comp. necessária
                          </th>
                          <th className="px-3 py-3 text-right">
                            Piso regulatório
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {calculos.tiposLigacao.map((item) => (
                          <tr
                            key={item.tipoLigacao}
                            className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                          >
                            <td className="px-3 py-4 font-medium text-slate-700 dark:text-slate-200">
                              {formatarTipoLigacao(item.tipoLigacao)}
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600 dark:text-slate-300">
                              {numero(item.quantidadeMinimaKwh, 0)} kWh
                            </td>

                            <td className="px-3 py-4 text-right">
                              {moeda(item.cdd)}
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600 dark:text-slate-300">
                              {numero(item.energiaNaoCompensadaKwh, 3)} kWh
                            </td>

                            <td className="px-3 py-4 text-right">
                              {moeda(item.valorEnergiaNaoCompensada)}
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600 dark:text-slate-300">
                              {numero(item.energiaCompensadaNecessariaKwh, 4)}{" "}
                              kWh
                            </td>

                            <td className="px-3 py-4 text-right font-semibold text-slate-700 dark:text-slate-200">
                              {moeda(item.pisoRegulatorio)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ================================================== */}
                {/* CONFERÊNCIA DA FATURA */}
                {/* ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Conferência da Fatura
                      </h2>

                      <p className="text-xs text-slate-500">
                        Comparação entre quantidade × tarifa unitária e o valor
                        informado na fatura
                      </p>
                    </div>
                  </div>

                  {calculos.conferencia.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-slate-800/60">
                      Não existem itens com quantidade e tarifa unitária
                      suficientes para conferência.
                    </div>
                  ) : (
                    <div className="overflow-x-auto overscroll-x-contain" role="region" aria-label="Tabela do relatório, role horizontalmente para ver todas as colunas" tabIndex={0}>
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
                            <th className="px-3 py-3">Item</th>

                            <th className="px-3 py-3 text-right">Quantidade</th>

                            <th className="px-3 py-3 text-right">Tarifa</th>

                            <th className="px-3 py-3 text-right">Calculado</th>

                            <th className="px-3 py-3 text-right">Fatura</th>

                            <th className="px-3 py-3 text-right">Diferença</th>

                            <th className="px-3 py-3 text-center">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {calculos.conferencia.map((item) => (
                            <tr
                              key={item.tipo}
                              className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                            >
                              <td className="px-3 py-4 font-medium text-slate-700 dark:text-slate-200">
                                {formatarTipoItem(item.tipo)}
                              </td>

                              <td className="px-3 py-4 text-right text-slate-600 dark:text-slate-300">
                                {item.quantidade !== null
                                  ? `${numero(item.quantidade, 3)} kWh`
                                  : "—"}
                              </td>

                              <td className="px-3 py-4 text-right text-slate-600 dark:text-slate-300">
                                {item.precoUnitario !== null
                                  ? tarifa(item.precoUnitario)
                                  : "—"}
                              </td>

                              <td className="px-3 py-4 text-right">
                                {item.valorCalculado !== null
                                  ? moeda(item.valorCalculado)
                                  : "—"}
                              </td>

                              <td className="px-3 py-4 text-right">
                                {item.valorInformado !== null
                                  ? moeda(item.valorInformado)
                                  : "—"}
                              </td>

                              <td className="px-3 py-4 text-right">
                                {item.diferenca !== null
                                  ? moeda(Math.abs(item.diferenca))
                                  : "—"}
                              </td>

                              <td className="px-3 py-4">
                                <div className="flex justify-center">
                                  {item.conferido === null ? (
                                    <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                      {item.presente
                                        ? "Informado"
                                        : "Não informado"}
                                    </div>
                                  ) : item.conferido ? (
                                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Conferido
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                      <AlertTriangle className="h-3.5 w-3.5" />
                                      Divergência
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ------------------------------------------ */}
                {/* INFORMAÇÕES DOS CRÉDITOS */}
                {/* ------------------------------------------ */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <Coins className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Créditos de Energia
                      </h2>

                      <p className="text-xs text-slate-500">
                        Informações registradas na fatura da competência
                        selecionada
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <MiniIndicador
                      titulo="Créditos Recebidos"
                      valor={`${numero(
                        faturaAtual.creditos_recebidos_kwh,
                        2,
                      )} kWh`}
                    />

                    <MiniIndicador
                      titulo="Saldo Total"
                      valor={`${numero(
                        faturaAtual.saldo_total_creditos_kwh,
                        2,
                      )} kWh`}
                    />

                    <MiniIndicador
                      titulo="Saldo Atualizado"
                      valor={`${numero(faturaAtual.saldo_creditos_kwh, 2)} kWh`}
                    />

                    <MiniIndicador
                      titulo="Participação no Saldo"
                      valor={`${numero(
                        faturaAtual.participacao_saldo_percentual,
                        2,
                      )}%`}
                    />
                  </div>
                </div>

                {/* ------------------------------------------ */}
                {/* GRÁFICO ENERGIA */}
                {/* ------------------------------------------ */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <ChartNoAxesColumnIncreasing className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Energia Fornecida × Injetada
                      </h2>

                      <p className="text-xs text-slate-500">
                        Comparativo das competências cadastradas para esta usina
                      </p>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosEnergia}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis dataKey="competencia" fontSize={12} />

                        <YAxis fontSize={12} unit=" kWh" />

                        <Tooltip />

                        <Legend />

                        <Bar
                          dataKey="fornecida"
                          name="Energia fornecida"
                          fill="#f59e0b"
                          radius={[5, 5, 0, 0]}
                        />

                        <Bar
                          dataKey="injetada"
                          name="Energia injetada"
                          fill="#0ea5e9"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ------------------------------------------ */}
                {/* GRÁFICO CRÉDITOS */}
                {/* ------------------------------------------ */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
                      <ChartSpline className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        Evolução do Saldo de Créditos
                      </h2>

                      <p className="text-xs text-slate-500">
                        Histórico do saldo informado nas faturas
                      </p>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dadosCreditos}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis dataKey="competencia" fontSize={12} />

                        <YAxis fontSize={12} unit=" kWh" />

                        <Tooltip />

                        <Legend />

                        <Line
                          type="monotone"
                          dataKey="saldo"
                          name="Saldo de créditos"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )
          )}
        </>
      )}
    </div>
  );
}

// =========================================================
// CARD PRINCIPAL
// =========================================================

interface CardIndicadorProps {
  titulo: string;
  valor: string;
  descricao: string;
  icon: ReactNode;
}

function CardIndicador({ titulo, valor, descricao, icon }: CardIndicadorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumiere-primary/10 text-lumiere-tertiary">
          {icon}
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
        {valor}
      </p>

      <p className="mt-2 text-xs text-slate-500">{descricao}</p>
    </div>
  );
}
const formatarTipoLigacao = (tipo: string) => {
  const tipos: Record<string, string> = {
    MONOFASICA: "Monofásica",
    BIFASICA_2_CONDUTORES: "Bifásica - 2 condutores",
    BIFASICA_3_CONDUTORES: "Bifásica - 3 condutores",
    TRIFASICA: "Trifásica",
  };

  return tipos[tipo] ?? tipo;
};

const formatarTipoItem = (tipo: string) => {
  const tipos: Record<string, string> = {
    TUSD_FORNECIDA: "TUSD - Energia Fornecida",
    TE_FORNECIDA: "TE - Energia Fornecida",
    TUSD_INJETADA: "TUSD - Energia Injetada",
    TE_INJETADA: "TE - Energia Injetada",
    BANDEIRA_FORNECIDA: "Bandeira - Energia Fornecida",
    BANDEIRA_INJETADA: "Bandeira - Energia Injetada",
    MULTA: "Multa",
    JUROS: "Juros",
    CONTRIBUICAO_MUNICIPAL: "Contribuição Municipal",
    OUTRO: "Outro",
    TOTAL: "TOTAL",
  };

  return tipos[tipo] ?? tipo;
};

const tarifa = (valor?: number | string | null) => {
  if (valor === null || valor === undefined) {
    return "—";
  }

  return `R$ ${Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  })}/kWh`;
};
// =========================================================
// CARD MENOR
// =========================================================

interface MiniIndicadorProps {
  titulo: string;
  valor: string;
}

function MiniIndicador({ titulo, valor }: MiniIndicadorProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-800 dark:text-white">
        {valor}
      </p>
    </div>
  );
}
