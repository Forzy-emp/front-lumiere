import type { ContaEnergia } from '../components/CadastroContaEnergia';
import { BandeiraTipo, NaturezaFaturaItem, TipoFaturaItem, type FaturaInicialRequest, type FaturaItemRequest } from '../service/fatura';

  const converterCompetencia = (competencia: string): string => {
    const [mes, ano] = competencia.split('/');

    return `${ano}-${mes}-01`;
  };

  const converterBandeira = (bandeira?: string): BandeiraTipo | undefined => {
    switch (bandeira) {
      case 'Verde':
        return BandeiraTipo.VERDE;

      case 'Amarela':
        return BandeiraTipo.AMARELA;

      case 'Vermelha Patamar 1':
        return BandeiraTipo.VERMELHA_PATAMAR_1;

      case 'Vermelha Patamar 2':
        return BandeiraTipo.VERMELHA_PATAMAR_2;

      default:
        return undefined;
    }
  };


export function montarFatura(dados: ContaEnergia): FaturaInicialRequest {
      const itens: FaturaItemRequest[] = [];

      // TUSD FORNECIDA
      if (
        dados.energiaAtivaFornecida.tusd.quantidade !== null &&
        dados.energiaAtivaFornecida.tusd.precoUnitario !== null &&
        dados.energiaAtivaFornecida.tusd.valor !== null
      ) {
        itens.push({
          tipo: TipoFaturaItem.TUSD_FORNECIDA,
          natureza: NaturezaFaturaItem.COBRANCA,
          unidade: 'kWh',
          quantidade:
            dados.energiaAtivaFornecida.tusd.quantidade,
          precoUnitario:
            dados.energiaAtivaFornecida.tusd.precoUnitario,
          valor:
            dados.energiaAtivaFornecida.tusd.valor,
        });
      }

      // TE FORNECIDA
      if (
        dados.energiaAtivaFornecida.te.quantidade !== null &&
        dados.energiaAtivaFornecida.te.precoUnitario !== null &&
        dados.energiaAtivaFornecida.te.valor !== null
      ) {
        itens.push({
          tipo: TipoFaturaItem.TE_FORNECIDA,
          natureza: NaturezaFaturaItem.COBRANCA,
          unidade: 'kWh',
          quantidade:
            dados.energiaAtivaFornecida.te.quantidade,
          precoUnitario:
            dados.energiaAtivaFornecida.te.precoUnitario,
          valor:
            dados.energiaAtivaFornecida.te.valor,
        });
      }

      // TUSD INJETADA
      if (
        dados.energiaAtivaInjetada.tusd.quantidade !== null &&
        dados.energiaAtivaInjetada.tusd.precoUnitario !== null &&
        dados.energiaAtivaInjetada.tusd.valor !== null
      ) {
        itens.push({
          tipo: TipoFaturaItem.TUSD_INJETADA,
          natureza: NaturezaFaturaItem.CREDITO,
          unidade: 'kWh',
          quantidade:
            dados.energiaAtivaInjetada.tusd.quantidade,
          precoUnitario:
            dados.energiaAtivaInjetada.tusd.precoUnitario,
          valor:
            dados.energiaAtivaInjetada.tusd.valor,
        });
      }

      // TE INJETADA
      if (
        dados.energiaAtivaInjetada.te.quantidade !== null &&
        dados.energiaAtivaInjetada.te.precoUnitario !== null &&
        dados.energiaAtivaInjetada.te.valor !== null
      ) {
        itens.push({
          tipo: TipoFaturaItem.TE_INJETADA,
          natureza: NaturezaFaturaItem.CREDITO,
          unidade: 'kWh',
          quantidade:
            dados.energiaAtivaInjetada.te.quantidade,
          precoUnitario:
            dados.energiaAtivaInjetada.te.precoUnitario,
          valor:
            dados.energiaAtivaInjetada.te.valor,
        });
      }

      // BANDEIRA FORNECIDA
      if (
        dados.bandeira?.energiaFornecida.valor !== null &&
        dados.bandeira?.energiaFornecida.valor !== undefined
      ) {
        itens.push({
          tipo: TipoFaturaItem.BANDEIRA_FORNECIDA,
          natureza: NaturezaFaturaItem.COBRANCA,
          unidade: 'kWh',
          quantidade:
            dados.bandeira.energiaFornecida.quantidade ??
            undefined,
          valor:
            dados.bandeira.energiaFornecida.valor,
        });
      }

      // BANDEIRA INJETADA
      if (
        dados.bandeira?.energiaInjetada.valor !== null &&
        dados.bandeira?.energiaInjetada.valor !== undefined
      ) {
        itens.push({
          tipo: TipoFaturaItem.BANDEIRA_INJETADA,
          natureza: NaturezaFaturaItem.CREDITO,
          unidade: 'kWh',
          quantidade:
            dados.bandeira.energiaInjetada.quantidade ??
            undefined,
          valor:
            dados.bandeira.energiaInjetada.valor,
        });
      }

      // MULTA
      if (dados.encargos?.multa != null) {
        itens.push({
          tipo: TipoFaturaItem.MULTA,
          natureza: NaturezaFaturaItem.COBRANCA,
          valor: dados.encargos.multa,
        });
      }

      // JUROS
      if (dados.encargos?.juros != null) {
        itens.push({
          tipo: TipoFaturaItem.JUROS,
          natureza: NaturezaFaturaItem.COBRANCA,
          valor: dados.encargos.juros,
        });
      }

      // CONTRIBUIÇÃO MUNICIPAL
      if (
        dados.encargos?.contribuicaoMunicipal != null
      ) {
        itens.push({
          tipo:
            TipoFaturaItem.CONTRIBUICAO_MUNICIPAL,
          natureza: NaturezaFaturaItem.COBRANCA,
          valor:
            dados.encargos.contribuicaoMunicipal,
        });
      }

      // OUTROS
      if (dados.encargos?.outros != null) {
        itens.push({
          tipo: TipoFaturaItem.OUTRO,
          descricao: 'Outros encargos',
          natureza: NaturezaFaturaItem.COBRANCA,
          valor: dados.encargos.outros,
        });
      }

      const payload: FaturaInicialRequest = {

        competencia: converterCompetencia(
          dados.competencia
        ),

        vencimento: dados.vencimento,

        valorTotal: dados.saldoPagar,

        itens,
      };

      const bandeira = converterBandeira(
        dados.bandeira?.tipo
      );

      if (bandeira) {
        payload.bandeiraTipo = bandeira;
      }

      if (
        dados.creditosEnergia?.saldoAtualizado != null
      ) {
        payload.saldoCreditosKwh =
          dados.creditosEnergia.saldoAtualizado;
      }

      if (
        dados.creditosEnergia?.creditosRecebidos != null
      ) {
        payload.creditosRecebidosKwh =
          dados.creditosEnergia.creditosRecebidos;
      }

      if (
        dados.creditosEnergia?.participacaoSaldo != null
      ) {
        payload.participacaoSaldoPercentual =
          dados.creditosEnergia.participacaoSaldo;
      }

      if (
        dados.creditosEnergia?.saldoTotal != null
      ) {
        payload.saldoTotalCreditosKwh =
          dados.creditosEnergia.saldoTotal;
      }

      if (
        dados.creditosEnergia?.saldoAtualizado != null
      ) {
        payload.saldoCreditosKwh =
          dados.creditosEnergia.saldoAtualizado;
      }


  return payload;
}
