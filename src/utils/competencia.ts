export function mesReferencia(date = new Date(), deslocamento = 0): string {
  const mes = new Date(date.getFullYear(), date.getMonth() + deslocamento, 1);
  return `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, "0")}`;
}

export function ultimosDozeMeses(date = new Date()): string[] {
  return Array.from({ length: 12 }, (_, index) => mesReferencia(date, -index - 1));
}

export function formatarCompetencia(competencia: string): string {
  const [ano, mes] = competencia.slice(0, 7).split("-");
  return `${mes}/${ano}`;
}

export function competenciaParaMes(competencia: string): string {
  const [mes, ano] = competencia.split("/");
  return `${ano}-${mes}`;
}

export function validarCompetencia(
  competencia: string,
  cadastradas: string[] = [],
  permitidas?: string[],
): string | null {
  if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(competencia)) {
    return "Informe uma competência válida no formato MM/AAAA.";
  }
  const mes = competenciaParaMes(competencia);
  if (cadastradas.some((data) => data.slice(0, 7) === mes)) {
    return "Já existe uma fatura para esta usina neste mês.";
  }
  if (permitidas && !permitidas.includes(mes)) {
    return "Escolha um dos 12 meses anteriores ao mês atual.";
  }
  return null;
}
