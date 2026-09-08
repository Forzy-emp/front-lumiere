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

export const RegisterFatura = async (data: CreateFaturaRequest) => {
  const response = await api.post("/faturas", data);

  return response.data;
};

export const GetFaturas = async () => {
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
