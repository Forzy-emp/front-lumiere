import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, MapPin } from 'lucide-react';
import { CadUsina } from "../../../service/usina";

interface Beneficiary {
    id: string;
    name: string;
    email: string;
    percent: number;
}

interface MaintenanceLog {
    id: string;
    date: string;
    time: string;
    performedBy: 'self' | 'company';
    companyName?: string;
}

interface Plant {
    id: string;
    name: string;
    cep: string;
    address: string;
    panelsCount: number;
    lastMonthProduction: number;
    lastMonthProductionAnterior?: number;
    lastMonthFaturamento?: number;
    lastMonthFaturamentoAnterior?: number;
    saldoRede?: number;
    economiaAcumulada?: number;
    energiaEnviada?: number;
    status: 'ativo' | 'inativo';
    beneficiariesLimit?: number;
    sunExposure?: number;
    beneficiaries: Beneficiary[];
    installationDate: string;
    lastMaintenanceDate: string;
    maintenanceHistory?: MaintenanceLog[];
}


export default function RegisterNewSolarPowerPlant() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Fields
    const [name, setName] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [panelsCount, setPanelsCount] = useState<number | ''>('');
    const [lastMonthProduction, setLastMonthProduction] = useState<number | ''>('');
    const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
    const [beneficiariesLimit, setBeneficiariesLimit] = useState<number | ''>('');
    const [sunExposure, setSunExposure] = useState<number | ''>('');
    const [installationDate, setInstallationDate] = useState('');
    const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCep(val);
        const cleanCep = val.replace(/\D/g, '');

        // Simulated CEP auto-fill
        if (cleanCep.length === 8) {
            setRua('Avenida Paulista');
            setBairro('Bela Vista');
            setCidade('São Paulo');
            setEstado('SP');
            setNumero('1000');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !cep || !rua || !bairro || !cidade || !estado || !panelsCount || !installationDate) {
            setError('Por favor, preencha todos os campos obrigatórios (incluindo a data de instalação).');
            return;
        }

        setLoading(true);

        const data = {
            name,
            cep,
            logradouro: rua,
            numero,
            bairro,
            cidade,
            estado,
            qtd_placas: Number(panelsCount),
            geracao_mes_anterior: Number(lastMonthProduction || 0),
            limite_beneficiarios: Number(beneficiariesLimit || 0),
            exposicao_solar_diaria: Number(sunExposure || 0),
            data_instalacao: installationDate,
            data_ultima_manutencao:
                lastMaintenanceDate || installationDate,
        };

        try {
            setLoading(true);

            const response = await CadUsina(data);

            console.log(response);

            navigate("/dashboard/usina");
        } catch (error: any) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Erro ao cadastrar usina."
            );
        } finally {
            setLoading(false);
        }

        // setTimeout(() => {
        //     // Fetch current list
        //     const stored = localStorage.getItem('solarPlants');
        //     let currentPlants: Plant[] = [];
        //     if (stored) {
        //         try {
        //             currentPlants = JSON.parse(stored);
        //         } catch (err) {
        //             console.error(err);
        //         }
        //     }

        //     const newId = String(Date.now());
        //     const fullAddress = `${rua}, ${numero ? numero : 'S/N'} - ${bairro} - ${cidade} - ${estado}`;

        //     const production = lastMonthProduction === '' ? 0 : Number(lastMonthProduction);
        //     const limit = beneficiariesLimit === '' ? undefined : Number(beneficiariesLimit);
        //     const sun = sunExposure === '' ? undefined : Number(sunExposure);
        //     const panels = Number(panelsCount);

        //     // Default faturamento / saldo calculations to make it fully populated
        //     const defaultFaturamento = production * 2.3;
        //     const defaultSaldo = production * 1.15;
        //     const defaultEnviada = production * 15.4;
        //     const defaultEconomia = production * 9.9;

        //     const newPlant: Plant = {
        //         id: newId,
        //         name,
        //         cep,
        //         address: fullAddress,
        //         panelsCount: panels,
        //         lastMonthProduction: production,
        //         lastMonthProductionAnterior: production > 0 ? Math.round(production * 0.9) : 0,
        //         lastMonthFaturamento: defaultFaturamento,
        //         lastMonthFaturamentoAnterior: defaultFaturamento > 0 ? Math.round(defaultFaturamento * 0.9) : 0,
        //         saldoRede: defaultSaldo,
        //         energiaEnviada: defaultEnviada,
        //         economiaAcumulada: defaultEconomia,
        //         status,
        //         beneficiariesLimit: limit,
        //         sunExposure: sun,
        //         beneficiaries: [],
        //         installationDate,
        //         lastMaintenanceDate: lastMaintenanceDate || installationDate,
        //         maintenanceHistory: []
        //     };

        //     currentPlants.push(newPlant);
        //     localStorage.setItem('solarPlants', JSON.stringify(currentPlants));

        //     setLoading(false);
        //     navigate('/dashboard/usina');
        // }, 1000);
    };

    return (
        <div className="space-y-6 animate-fade-in relative pb-10">

            {/* Header & Back Action */}
            <div>
                <button
                    onClick={() => navigate('/dashboard/usina')}
                    className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0 outline-none"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar para Minhas Usinas
                </button>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Cadastrar Nova Usina</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Insira as informações técnicas e de localização da sua nova usina de energia solar.
                </p>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl">

                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Identificação Básica */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Identificação Básica</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Apelido da Usina *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Usina Solar Lumière II"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Status da Usina *
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Localização */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                            <MapPin className="w-4.5 h-4.5 text-slate-400" />
                            Localização da Usina
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    CEP *
                                </label>
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    value={cep}
                                    onChange={handleCepChange}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">Digite 8 dígitos para preenchimento rápido</span>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Logradouro (Rua / Avenida) *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rua das Flores"
                                    value={rua}
                                    onChange={(e) => setRua(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    placeholder="1000"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Bairro *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Centro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Cidade *
                                </label>
                                <input
                                    type="text"
                                    placeholder="São Paulo"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Estado *
                                </label>
                                <input
                                    type="text"
                                    placeholder="SP"
                                    maxLength={2}
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value.toUpperCase())}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Especificações Técnicas */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Especificações Técnicas</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Número de Placas Solares *
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ex: 24"
                                    value={panelsCount}
                                    onChange={(e) => setPanelsCount(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5 flex items-center gap-1">
                                    Geração de Energia no Mês Anterior (kWh)
                                    <span className="text-xs font-normal text-slate-400">(Opcional)</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ex: 850 (Deixe 0 ou em branco se inativa)"
                                    value={lastMonthProduction}
                                    onChange={(e) => setLastMonthProduction(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5 flex items-center gap-1">
                                    Número Limite de Beneficiários
                                    <span className="text-xs font-normal text-slate-400">(Opcional)</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ex: 30"
                                    value={beneficiariesLimit}
                                    onChange={(e) => setBeneficiariesLimit(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5 flex items-center gap-1">
                                    Tempo de Exposição ao Sol Diário (Horas)
                                    <span className="text-xs font-normal text-slate-400">(Opcional)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Ex: 5.5"
                                    value={sunExposure}
                                    onChange={(e) => setSunExposure(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Section 4: Cronograma de Manutenção */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Cronograma de Manutenção</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5">
                                    Data de Instalação *
                                </label>
                                <input
                                    type="date"
                                    value={installationDate}
                                    onChange={(e) => setInstallationDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-1.5 flex items-center gap-1">
                                    Data da Última Manutenção
                                    <span className="text-xs font-normal text-slate-400">(Opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    value={lastMaintenanceDate}
                                    onChange={(e) => setLastMaintenanceDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <span className="text-[10px] text-slate-450 mt-1 block">Se deixada em branco, assume-se a data de instalação.</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/usina')}
                            className="px-5 py-3 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-sm font-bold cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white rounded-xl text-sm font-bold shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Salvar Usina
                                </>
                            )}
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
}
