import api from "./api";

export const TipoFaturaItem = {
  TUSD_FORNECIDA: "TUSD_FORNECIDA",
  TE_FORNECIDA: "TE_FORNECIDA",
  TUSD_INJETADA: "TUSD_INJETADA",
  TE_INJETADA: "TE_INJETADA",
  BANDEIRA_FORNECIDA: "BANDEIRA_FORNECIDA",
  BANDEIRA_INJETADA: "BANDEIRA_INJETADA",
  MULTA: "MULTA",
  JUROS: "JUROS",
  CONTRIBUICAO_MUNICIPAL: "CONTRIBUICAO_MUNICIPAL",
  OUTRO: "OUTRO",
} as const;

export type TipoFaturaItem =
  (typeof TipoFaturaItem)[keyof typeof TipoFaturaItem];

export const NaturezaFaturaItem = {
  COBRANCA: "COBRANCA",
  CREDITO: "CREDITO",
} as const;

export type NaturezaFaturaItem =
  (typeof NaturezaFaturaItem)[keyof typeof NaturezaFaturaItem];

export const BandeiraTipo = {
  VERDE: "VERDE",
  AMARELA: "AMARELA",
  VERMELHA_PATAMAR_1: "VERMELHA_PATAMAR_1",
  VERMELHA_PATAMAR_2: "VERMELHA_PATAMAR_2",
  OUTRA: "OUTRA",
} as const;

export type BandeiraTipo = (typeof BandeiraTipo)[keyof typeof BandeiraTipo];

export interface FaturaItemRequest {
  tipo: TipoFaturaItem;
  descricao?: string;
  natureza: NaturezaFaturaItem;
  unidade?: string;
  quantidade?: number;
  precoUnitario?: number;
  valor: number;
}

export interface CreateFaturaRequest {
  usinaId: number;
  competencia: string;
  vencimento: string;
  valorTotal: number;
  bandeiraTipo?: BandeiraTipo;
  saldoCreditosKwh?: number;
  creditosRecebidosKwh?: number;
  participacaoSaldoPercentual?: number;
  saldoTotalCreditosKwh?: number;
  itens: FaturaItemRequest[];
}

export type FaturaInicialRequest = Omit<CreateFaturaRequest, "usinaId">;

export interface Fatura {
  id: number;
  usinaId: number;
  competencia: string;
  vencimento: string;
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

export const RegisterFatura = async (data: CreateFaturaRequest): Promise<Fatura> => {
  const response = await api.post("/faturas", data);

  return response.data;
};

export const GetFaturas = async (): Promise<Fatura[]> => {
  const response = await api.get("/faturas");

  return response.data;
};

export const GetFaturaById = async (id: number) => {
  const response = await api.get(`/faturas/${id}`);

  return response.data;
};

export const GetCalculosFatura = async (id: number) => {
  const response = await api.get(`/faturas/${id}/calculos`);

  return response.data;
};
