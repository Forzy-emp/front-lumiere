import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { CadastroContaEnergia, type ContaEnergia } from "./CadastroContaEnergia";
import { GetFaturas, RegisterFatura, type Fatura } from "../service/fatura";
import { formatarCompetencia, validarCompetencia } from "../utils/competencia";
import { montarFatura } from "../utils/fatura";

export function FaturasUsina({ usinaId }: { usinaId: number }) {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    GetFaturas().then(dados => {
      if (active) setFaturas(dados.filter(fatura => Number(fatura.usinaId) === usinaId));
    }).catch(() => {
      if (active) setError("Não foi possível carregar as faturas. Tente novamente para consultar o histórico e cadastrar uma fatura.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [usinaId, reload]);

  const handleSave = async (dados: ContaEnergia) => {
    // Reconsulta antes de salvar para detectar faturas adicionadas em outra sessão.
    const atuais = (await GetFaturas()).filter(fatura => Number(fatura.usinaId) === usinaId);
    setFaturas(atuais);
    const erroCompetencia = validarCompetencia(dados.competencia, atuais.map(fatura => fatura.competencia));
    if (erroCompetencia) throw new Error(erroCompetencia);
    const salva = await RegisterFatura({ ...montarFatura(dados), usinaId });
    setFaturas([...atuais, salva]);
    setIsOpen(false);
    setSuccess("Fatura cadastrada com sucesso.");
  };

  const ordenadas = [...faturas].sort((a, b) => b.competencia.localeCompare(a.competencia));

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" /> Histórico de Faturas
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consulte as contas de energia desta usina. Uma fatura por mês.</p>
        </div>
        <button type="button" disabled={loading || !!error} onClick={() => { setSuccess(""); setIsOpen(true); }}
          className="ui-primary w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Nova Fatura
        </button>
      </div>
      {success && <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
      {loading ? <p role="status" className="text-sm text-slate-500">Carregando faturas...</p> : error ? (
        <div role="alert" className="text-sm text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button type="button" className="mt-2 font-bold underline cursor-pointer" onClick={() => { setLoading(true); setError(""); setReload(value => value + 1); }}>Tentar novamente</button>
        </div>
      ) : faturas.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4">Nenhuma fatura cadastrada para esta usina.</p>
      ) : (
        <>
        <ul className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {ordenadas.map(fatura => (
            <li key={fatura.id} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <span>{formatarCompetencia(fatura.competencia)}</span>
                <span>{Number(fatura.valor_total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Vencimento: {fatura.vencimento.slice(0, 10).split("-").reverse().join("/")}</p>
            </li>
          ))}
        </ul>
        <div className="hidden sm:block overflow-x-auto max-h-96">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr><th scope="col" className="py-3 pr-4">Competência</th><th scope="col" className="py-3 pr-4">Vencimento</th><th scope="col" className="py-3 text-right">Valor total</th></tr>
            </thead>
            <tbody>
              {ordenadas.map(fatura => (
                <tr key={fatura.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-3 pr-4 font-semibold">{formatarCompetencia(fatura.competencia)}</td>
                  <td className="py-3 pr-4">{fatura.vencimento.slice(0, 10).split("-").reverse().join("/")}</td>
                  <td className="py-3 text-right whitespace-nowrap">{Number(fatura.valor_total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
      {isOpen && <CadastroContaEnergia idUsina={usinaId} competenciasCadastradas={faturas.map(fatura => fatura.competencia)} onSave={handleSave} onClose={() => setIsOpen(false)} />}
    </section>
  );
}
