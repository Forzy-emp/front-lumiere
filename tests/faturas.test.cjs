const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');

// Usa o compilador já presente no projeto, sem dependências adicionais de teste.
function loadTs(file) {
  const filename = path.resolve(file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const nativeRequire = createRequire(filename);
  const localRequire = specifier => {
    if (specifier.startsWith('.')) {
      const base = path.resolve(path.dirname(filename), specifier);
      const source = ['.ts', '.tsx'].map(extension => base + extension).find(candidate => fs.existsSync(candidate));
      if (source) return loadTs(source);
    }
    return nativeRequire(specifier);
  };
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports);
  return module.exports;
}

const { ultimosDozeMeses, validarCompetencia, formatarCompetencia } = loadTs('src/utils/competencia.ts');
const { montarFatura } = loadTs('src/utils/fatura.ts');

test('oferece exatamente 12 meses encerrados na virada do ano', () => {
  const meses = ultimosDozeMeses(new Date(2026, 0, 31));
  assert.equal(meses.length, 12);
  assert.equal(new Set(meses).size, 12);
  assert.equal(meses[0], '2025-12');
  assert.equal(meses[11], '2025-01');
  assert.equal(ultimosDozeMeses(new Date(2024, 2, 31))[0], '2024-02');
});

test('rejeita competência inválida e duplicada independentemente do dia', () => {
  for (const competencia of ['00/2026', '13/2026', '8/2026', '08/26', '']) {
    assert.ok(validarCompetencia(competencia));
  }
  assert.match(validarCompetencia('08/2026', ['2026-08-25T00:00:00.000Z']), /Já existe/);
  assert.equal(validarCompetencia('07/2026', ['2026-08-25']), null);
});

test('rejeita mês atual, futuro e mais antigo que os 12 meses permitidos no cadastro', () => {
  const permitidas = ultimosDozeMeses(new Date(2026, 8, 8));
  for (const competencia of ['09/2026', '10/2026', '08/2025']) {
    assert.ok(validarCompetencia(competencia, [], permitidas));
  }
  assert.equal(validarCompetencia('08/2026', [], permitidas), null);
  assert.equal(validarCompetencia('09/2025', [], permitidas), null);
});

test('formata o mês sem deslocamento por fuso horário', () => {
  assert.equal(formatarCompetencia('2026-01-01T00:00:00.000Z'), '01/2026');
});

const item = (quantidade, valor) => ({ quantidade, precoUnitario: 0.5, valor });
const conta = {
  competencia: '08/2026', vencimento: '2026-09-10', saldoPagar: 150,
  energiaAtivaFornecida: { tusd: item(100, 50), te: item(100, 50) },
  energiaAtivaInjetada: { tusd: item(80, 40), te: item(80, 40) },
};

test('mapeia fatura sem confundir energia injetada com geração e sem ID de usina provisório', () => {
  const payload = montarFatura(conta);
  assert.equal(payload.competencia, '2026-08-01');
  assert.equal(payload.valorTotal, 150);
  assert.equal(payload.itens.length, 4);
  assert.equal(payload.itens.find(item => item.tipo === 'TUSD_INJETADA').quantidade, 80);
  assert.equal(payload.itens.find(item => item.tipo === 'TE_INJETADA').natureza, 'CREDITO');
  assert.equal('usinaId' in payload, false);
  assert.equal('geracao_mes_anterior' in payload, false);
});

test('preserva bandeira, encargos e créditos zerados no mapeamento compartilhado', () => {
  const payload = montarFatura({ ...conta,
    bandeira: { tipo: 'Vermelha Patamar 2', energiaFornecida: { quantidade: 100, valor: 5 }, energiaInjetada: { quantidade: 80, valor: 4 } },
    encargos: { multa: 0, juros: 1, contribuicaoMunicipal: 20, outros: 2 },
    creditosEnergia: { saldoAtualizado: 0, creditosRecebidos: 0, participacaoSaldo: 0, saldoTotal: 0 },
  });
  assert.equal(payload.itens.length, 10);
  assert.equal(payload.bandeiraTipo, 'VERMELHA_PATAMAR_2');
  assert.equal(payload.saldoCreditosKwh, 0);
  assert.equal(payload.creditosRecebidosKwh, 0);
  assert.equal(payload.participacaoSaldoPercentual, 0);
  assert.equal(payload.saldoTotalCreditosKwh, 0);
  assert.equal(payload.itens.find(item => item.tipo === 'MULTA').valor, 0);
});
