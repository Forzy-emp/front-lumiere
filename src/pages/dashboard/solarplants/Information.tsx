import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Sun, 
  MapPin, 
  Users, 
  BatteryCharging, 
  Plus, 
  Trash2, 
  Edit, 
  Leaf,  
  PlusCircle, 
  X,
  Check,
  AlertTriangle,
  AlertOctagon,
  Wrench
} from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  percent: number;
}

interface Plant {
  maintenanceHistory: any;
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
}

export default function SolarPlantInformation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plant, setPlant] = useState<Plant | null>(null);
  
  // Modal controllers
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [isEditPlantModalOpen, setIsEditPlantModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Reading Form State
  const [newGeneration, setNewGeneration] = useState<number | ''>('');
  const [newConsumption, setNewConsumption] = useState<number | ''>('');
  const [readingLoading, setReadingLoading] = useState(false);

  // Edit Plant Form State
  const [editName, setEditName] = useState('');
  const [editCep, setEditCep] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPanelsCount, setEditPanelsCount] = useState<number | ''>('');
  const [editSunExposure, setEditSunExposure] = useState<number | ''>('');
  const [editBeneficiariesLimit, setEditBeneficiariesLimit] = useState<number | ''>('');
  const [editInstallationDate, setEditInstallationDate] = useState('');
  const [editLastMaintenanceDate, setEditLastMaintenanceDate] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Maintenance Logging Form State
  const [maintDate, setMaintDate] = useState('');
  const [maintTime, setMaintTime] = useState('');
  const [maintPerformedBy, setMaintPerformedBy] = useState<'self' | 'company'>('self');
  const [maintCompanyName, setMaintCompanyName] = useState('');
  const [maintLoading, setMaintLoading] = useState(false);
  const [maintError, setMaintError] = useState('');

  // Beneficiary Form State
  const [benId, setBenId] = useState<string | null>(null); // For editing
  const [benName, setBenName] = useState('');
  const [benEmail, setBenEmail] = useState('');
  const [benPercent, setBenPercent] = useState<number | ''>('');
  const [benError, setBenError] = useState('');

  // Load plants
  useEffect(() => {
    const stored = localStorage.getItem('solarPlants');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Plant[];
        setPlants(parsed);
        const found = parsed.find(p => p.id === id);
        if (found) {
          setPlant(found);
        } else {
          // If not found, go back
          navigate('/dashboard/usina');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [id, navigate]);

  const savePlantsList = (updatedList: Plant[]) => {
    setPlants(updatedList);
    localStorage.setItem('solarPlants', JSON.stringify(updatedList));
    const found = updatedList.find(p => p.id === id);
    if (found) {
      setPlant(found);
    }
  };

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  // Toggle status
  const handleToggleStatus = () => {
    if (!plant) return;
    const updated = plants.map(p => {
      if (p.id === plant.id) {
        return {
          ...p,
          status: p.status === 'ativo' ? 'inativo' : 'ativo' as 'ativo' | 'inativo'
        };
      }
      return p;
    });
    savePlantsList(updated);
    triggerToast(`Status da usina atualizado com sucesso!`);
  };

  // Maintenance and Date Utilities
  const getMonthsSince = (dateStr: string) => {
    if (!dateStr) return 0;
    const maintenanceDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - maintenanceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30.4);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Não informado';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const handleOpenMaintenanceModal = () => {
    if (!plant) return;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setMaintDate(todayStr);
    setMaintTime(timeStr);
    setMaintPerformedBy('self');
    setMaintCompanyName('');
    setMaintError('');
    setIsMaintenanceModalOpen(true);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plant) return;
    setMaintError('');

    if (!maintDate || !maintTime) {
      setMaintError('Data e hora são campos obrigatórios.');
      return;
    }

    if (maintPerformedBy === 'company' && !maintCompanyName.trim()) {
      setMaintError('Por favor, informe o nome da empresa terceirizada.');
      return;
    }

    setMaintLoading(true);

    setTimeout(() => {
      const newLog = {
        id: String(Date.now()),
        date: maintDate,
        time: maintTime,
        performedBy: maintPerformedBy,
        companyName: maintPerformedBy === 'company' ? maintCompanyName.trim() : undefined
      };

      const updated = plants.map(p => {
        if (p.id === plant.id) {
          const history = p.maintenanceHistory ? [...p.maintenanceHistory, newLog] : [newLog];
          return {
            ...p,
            lastMaintenanceDate: maintDate,
            maintenanceHistory: history
          };
        }
        return p;
      });

      savePlantsList(updated);
      setMaintLoading(false);
      setIsMaintenanceModalOpen(false);
      triggerToast('Manutenção registrada com sucesso!');
    }, 900);
  };

  const handleOpenEditPlantModal = () => {
    if (!plant) return;
    setEditName(plant.name);
    setEditCep(plant.cep);
    setEditAddress(plant.address);
    setEditPanelsCount(plant.panelsCount);
    setEditSunExposure(plant.sunExposure || '');
    setEditBeneficiariesLimit(plant.beneficiariesLimit || '');
    setEditInstallationDate(plant.installationDate);
    setEditLastMaintenanceDate(plant.lastMaintenanceDate);
    setIsEditPlantModalOpen(true);
  };

  const handleEditPlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plant) return;

    if (!editName || !editCep || !editAddress || !editPanelsCount || !editInstallationDate || !editLastMaintenanceDate) {
      triggerToast('Por favor, preencha todos os campos obrigatórios para editar a usina.', 'error');
      return;
    }

    setEditLoading(true);

    setTimeout(() => {
      const updated = plants.map(p => {
        if (p.id === plant.id) {
          return {
            ...p,
            name: editName,
            cep: editCep,
            address: editAddress,
            panelsCount: Number(editPanelsCount),
            sunExposure: editSunExposure === '' ? undefined : Number(editSunExposure),
            beneficiariesLimit: editBeneficiariesLimit === '' ? undefined : Number(editBeneficiariesLimit),
            installationDate: editInstallationDate,
            lastMaintenanceDate: editLastMaintenanceDate
          };
        }
        return p;
      });

      savePlantsList(updated);
      setEditLoading(false);
      setIsEditPlantModalOpen(false);
      triggerToast('Dados da usina editados com sucesso!');
    }, 900);
  };

  // 1. Reading Form Handler (Novo Registro)
  const handleOpenReadingModal = () => {
    setNewGeneration(plant?.lastMonthProduction || '');
    setNewConsumption('');
    setIsReadingModalOpen(true);
  };

  const handleReadingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plant) return;

    if (newGeneration === '') {
      triggerToast('Geração recente é um campo obrigatório.', 'error');
      return;
    }

    setReadingLoading(true);

    setTimeout(() => {
      const updatedGen = Number(newGeneration);
      const updatedCon = newConsumption === '' ? 0 : Number(newConsumption);
      
      const updated = plants.map(p => {
        if (p.id === plant.id) {
          // Recalculate faturamento, saldo, economia, energia enviada
          const defaultFaturamento = updatedGen * 2.3;
          const defaultSaldo = Math.max(0, updatedGen - updatedCon) * 1.15;
          const defaultEnviada = updatedGen * 15.4;
          const defaultEconomia = updatedGen * 9.9;

          return {
            ...p,
            lastMonthProductionAnterior: p.lastMonthProduction,
            lastMonthProduction: updatedGen,
            lastMonthFaturamentoAnterior: p.lastMonthFaturamento,
            lastMonthFaturamento: defaultFaturamento,
            saldoRede: (p.saldoRede ?? 0) + defaultSaldo, // Accumulate credit balance
            energiaEnviada: (p.energiaEnviada ?? 0) + updatedGen, // Accumulate injected energy
            economiaAcumulada: (p.economiaAcumulada ?? 0) + defaultEconomia // Accumulate savings
          };
        }
        return p;
      });

      savePlantsList(updated);
      setReadingLoading(false);
      setIsReadingModalOpen(false);
      triggerToast('Nova leitura de geração registrada e agregada com sucesso!');
    }, 900);
  };

  // 2. Beneficiaries Form Handlers
  const handleOpenAddBeneficiary = () => {
    setBenId(null);
    setBenName('');
    setBenEmail('');
    setBenPercent('');
    setBenError('');
    setIsBeneficiaryModalOpen(true);
  };

  const handleOpenEditBeneficiary = (b: Beneficiary) => {
    setBenId(b.id);
    setBenName(b.name);
    setBenEmail(b.email);
    setBenPercent(b.percent);
    setBenError('');
    setIsBeneficiaryModalOpen(true);
  };

  const handleBeneficiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plant) return;

    if (!benName || !benEmail || benPercent === '') {
      setBenError('Por favor, preencha todos os campos do formulário.');
      return;
    }

    const percentVal = Number(benPercent);
    if (percentVal <= 0 || percentVal > 100) {
      setBenError('A alocação deve ser um valor de 1% a 100%.');
      return;
    }

    // Exceeded Limit check
    if (plant.beneficiariesLimit && !benId && plant.beneficiaries.length >= plant.beneficiariesLimit) {
      setBenError(`Limite de beneficiários da usina (${plant.beneficiariesLimit}) atingido.`);
      return;
    }

    // Credits validation
    const currentAllocationTotal = plant.beneficiaries
      .filter(b => b.id !== benId)
      .reduce((sum, b) => sum + b.percent, 0);

    if (currentAllocationTotal + percentVal > 100) {
      setBenError(`Limite de alocação de créditos excedido. Disponível: ${100 - currentAllocationTotal}%.`);
      return;
    }

    // Process Add / Edit
    const updated = plants.map(p => {
      if (p.id === plant.id) {
        let newList = [...p.beneficiaries];
        if (benId) {
          // Edit
          newList = newList.map(b => b.id === benId ? { ...b, name: benName, email: benEmail, percent: percentVal } : b);
        } else {
          // Add new
          newList.push({
            id: String(Date.now()),
            name: benName,
            email: benEmail,
            percent: percentVal
          });
        }
        return {
          ...p,
          beneficiaries: newList
        };
      }
      return p;
    });

    savePlantsList(updated);
    setIsBeneficiaryModalOpen(false);
    triggerToast(benId ? 'Beneficiário atualizado!' : 'Novo beneficiário adicionado!');
  };

  const handleRemoveBeneficiary = (bId: string) => {
    if (!plant) return;
    const updated = plants.map(p => {
      if (p.id === plant.id) {
        return {
          ...p,
          beneficiaries: p.beneficiaries.filter(b => b.id !== bId)
        };
      }
      return p;
    });
    savePlantsList(updated);
    triggerToast('Beneficiário removido do recebimento de créditos.');
  };

  const handleDeletePlant = () => {
    if (!plant) return;
    if (confirm(`Tem certeza de que deseja excluir a usina "${plant.name}" do sistema? Esta ação é irreversível.`)) {
      const updated = plants.filter(p => p.id !== plant.id);
      localStorage.setItem('solarPlants', JSON.stringify(updated));
      navigate('/dashboard/usina');
    }
  };

  if (!plant) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const currentAllocation = plant.beneficiaries.reduce((sum, b) => sum + b.percent, 0);

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      
      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          toastType === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <Check className="w-5 h-5" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Back Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard/usina')}
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0 outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar para Minhas Usinas
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{plant.name}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              plant.status === 'ativo'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
            }`}>
              {plant.status === 'ativo' ? 'Ativa' : 'Inativa'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            {plant.address}
          </p>
        </div>

        {/* Global actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleOpenEditPlantModal}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 animate-fade-in"
          >
            <Edit className="w-3.5 h-3.5" />
            Editar Usina
          </button>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              plant.status === 'ativo'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
            }`}
          >
            {plant.status === 'ativo' ? 'Desativar Usina' : 'Ativar Usina'}
          </button>
          <button
            onClick={handleDeletePlant}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            Excluir Usina
          </button>
        </div>
      </div>

      {/* Main Grid: Details + Beneficiaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Technical Info & Readings */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Specifications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-500" />
              Especificações Técnicas
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Placas Solares:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{plant.panelsCount} unidades</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Exposição Solar:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {plant.sunExposure ? `${plant.sunExposure}h / dia` : 'Não informado'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">CEP:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{plant.cep}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Limite de Clientes:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {plant.beneficiariesLimit ? `${plant.beneficiariesLimit} pessoas` : 'Sem limite'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Instalação:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{formatDate(plant.installationDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Última Manutenção:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{formatDate(plant.lastMaintenanceDate)}</span>
              </div>
            </div>
          </div>

          {/* Alertas de Manutenção Preventiva */}
          {(() => {
            const months = getMonthsSince(plant.lastMaintenanceDate);
            const isYellow = months >= 5 && months < 6;
            const isRed = months >= 6;
            
            if (plant.status !== 'ativo' || (!isYellow && !isRed)) return null;
            
            return (
              <div className={`border rounded-2xl p-5 shadow-sm space-y-3 ${
                isRed 
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                  : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-2.5">
                  {isRed ? (
                    <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`text-xs font-bold ${isRed ? 'text-red-800 dark:text-red-400' : 'text-amber-800 dark:text-amber-400'}`}>
                      {isRed ? 'Manutenção Vencida!' : 'Manutenção Recomendada'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isRed 
                        ? `Esta usina excedeu o prazo limite de 6 meses (última há ${months} meses).` 
                        : `Recomenda-se realizar uma manutenção preventiva em breve (última há ${months} meses).`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenMaintenanceModal}
                  className={`w-full py-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99] ${
                    isRed
                      ? 'bg-red-650 hover:bg-red-750 text-white shadow-sm'
                      : 'bg-amber-550 hover:bg-amber-650 text-white shadow-sm'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  Registrar Nova Manutenção
                </button>
              </div>
            );
          })()}

          {/* Plant Statistics Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
              Dados de Produção Recente
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 dark:text-slate-400">Geração no Último Mês:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{plant.lastMonthProduction.toLocaleString()} kWh</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 dark:text-slate-400">Faturamento Estimado:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  R$ {(plant.lastMonthFaturamento ?? plant.lastMonthProduction * 2.3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-450 dark:text-slate-400">Saldo Atual (Crédito):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{(plant.saldoRede ?? 0).toLocaleString()} kWh</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 dark:text-slate-400">Economia Acumulada:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  R$ {(plant.economiaAcumulada ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-xs pt-1 border-t border-dashed border-slate-100 dark:border-slate-800">
                <span className="text-slate-450 dark:text-slate-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-green-500" />
                  CO₂ Evitado Estimado:
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {((plant.energiaEnviada ?? 0) * 0.0003).toFixed(1)} ton
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenReadingModal}
              className="w-full mt-2 py-3 border-2 border-dashed border-blue-400 hover:border-blue-500 hover:bg-blue-50/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Novo Registro de Geração
            </button>
          </div>

          {/* Histórico de Manutenções */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" />
                Histórico de Manutenções
              </h3>
              <button
                onClick={handleOpenMaintenanceModal}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0 outline-none"
              >
                Registrar
              </button>
            </div>

            {plant.maintenanceHistory && plant.maintenanceHistory.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {[...plant.maintenanceHistory].reverse().map((log) => (
                  <div key={log.id} className="text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl flex justify-between items-start animate-fade-in">
                    <div>
                      <p className="font-bold text-slate-755 dark:text-slate-200">
                        {formatDate(log.date)} às {log.time}
                      </p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">
                        Realizado por: <span className="font-semibold">{log.performedBy === 'self' ? 'Eu mesmo' : `Empresa: ${log.companyName}`}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 dark:text-slate-500 text-center py-2">
                Nenhuma manutenção registrada no histórico.
              </p>
            )}
          </div>

        </div>

        {/* Right Side: Beneficiary Management */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Beneficiaries Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Beneficiaries Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Beneficiários Associados
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribua os créditos gerados pela usina entre seus consumidores cadastrados.
                </p>
              </div>

              <button
                onClick={handleOpenAddBeneficiary}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-750 text-white px-4 text-xs font-bold shadow-sm transition-colors gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                Adicionar
              </button>
            </div>

            {/* Credit Allocation Analytics */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Créditos Totais Alocados:</span>
                <span className={`font-bold ${
                  currentAllocation > 100 
                    ? 'text-red-500' 
                    : currentAllocation === 100 
                      ? 'text-emerald-600' 
                      : 'text-blue-600'
                }`}>
                  {currentAllocation}% / 100%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    currentAllocation > 100 
                      ? 'bg-red-500' 
                      : currentAllocation === 100 
                        ? 'bg-emerald-500' 
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, currentAllocation)}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Dica: O total alocado não pode ultrapassar 100% dos créditos.
              </div>
            </div>

            {/* Beneficiary List */}
            {plant.beneficiaries.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-150 dark:divide-slate-800">
                {plant.beneficiaries.map((b) => (
                  <div key={b.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    
                    {/* User profile */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold shrink-0 uppercase select-none">
                        {b.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{b.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{b.email}</p>
                      </div>
                    </div>

                    {/* Allocated percent & actions */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{b.percent}%</span>
                        <p className="text-[8px] text-slate-400 uppercase font-semibold">Crédito</p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEditBeneficiary(b)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Editar beneficiário"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveBeneficiary(b.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-650 rounded-lg transition-colors cursor-pointer"
                          title="Excluir beneficiário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <Users className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Nenhum Beneficiário Associado</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-4 max-w-xs">
                  Os créditos gerados por esta usina ainda não estão sendo destinados a nenhum cliente.
                </p>
                <button
                  onClick={handleOpenAddBeneficiary}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  Associar Primeiro Cliente
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* 1. Modal: Novo Registro de Geração */}
      {isReadingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Registrar Leitura</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Informe os novos dados operacionais da usina.</p>
              </div>
              <button 
                onClick={() => setIsReadingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReadingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Geração do Mês (kWh) *</label>
                <input
                  type="number"
                  placeholder="Ex: 1950"
                  value={newGeneration}
                  onChange={(e) => setNewGeneration(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  Uso/Consumo Interno (kWh)
                  <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
                </label>
                <input
                  type="number"
                  placeholder="Ex: 150 (Energia gasta localmente)"
                  value={newConsumption}
                  onChange={(e) => setNewConsumption(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400 block mt-1">O consumo local reduz o crédito injetado no saldo da rede.</span>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsReadingModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={readingLoading}
                  className="px-4 py-2 bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {readingLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Salvar Registro'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Gestão de Beneficiários */}
      {isBeneficiaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {benId ? 'Editar Beneficiário' : 'Adicionar Beneficiário'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Destine uma fração da geração de créditos.</p>
              </div>
              <button 
                onClick={() => setIsBeneficiaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {benError && (
              <div className="mb-4 p-2 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs text-center font-medium">
                {benError}
              </div>
            )}

            <form onSubmit={handleBeneficiarySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Clara Mendes"
                  value={benName}
                  onChange={(e) => setBenName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">E-mail *</label>
                <input
                  type="email"
                  placeholder="Ex: clara@email.com"
                  value={benEmail}
                  onChange={(e) => setBenEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1 flex justify-between">
                  <span>Crédito Alocado (%) *</span>
                  <span className="text-[10px] text-slate-400">Total disponível: {100 - (plant.beneficiaries.filter(b => b.id !== benId).reduce((sum, b) => sum + b.percent, 0))}%</span>
                </label>
                <input
                  type="number"
                  placeholder="Ex: 25"
                  value={benPercent}
                  onChange={(e) => setBenPercent(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  min={1}
                  max={100}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsBeneficiaryModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                >
                  {benId ? 'Salvar Alterações' : 'Adicionar Beneficiário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Editar Usina */}
      {isEditPlantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Edit className="w-4 h-4 text-blue-500" />
                  Editar Informações da Usina
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Altere as especificações técnicas e de localização da usina.</p>
              </div>
              <button 
                onClick={() => setIsEditPlantModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditPlantSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Apelido da Usina *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">CEP *</label>
                  <input
                    type="text"
                    value={editCep}
                    onChange={(e) => setEditCep(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Endereço Completo *</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Placas Solares *</label>
                  <input
                    type="number"
                    value={editPanelsCount}
                    onChange={(e) => setEditPanelsCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1 flex items-center gap-0.5">
                    Exposição (h/dia)
                    <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editSunExposure}
                    onChange={(e) => setEditSunExposure(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1 flex items-center gap-0.5">
                    Limite Clientes
                    <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="number"
                    value={editBeneficiariesLimit}
                    onChange={(e) => setEditBeneficiariesLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Data de Instalação *</label>
                  <input
                    type="date"
                    value={editInstallationDate}
                    onChange={(e) => setEditInstallationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Última Manutenção *</label>
                  <input
                    type="date"
                    value={editLastMaintenanceDate}
                    onChange={(e) => setEditLastMaintenanceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditPlantModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1 min-w-[100px] cursor-pointer"
                >
                  {editLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Registrar Manutenção */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                  Registrar Manutenção Realizada
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Informe as especificações e responsáveis da manutenção.</p>
              </div>
              <button 
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {maintError && (
              <div className="mb-4 p-2 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 text-xs text-center font-medium">
                {maintError}
              </div>
            )}

            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Data da Manutenção *</label>
                  <input
                    type="date"
                    value={maintDate}
                    onChange={(e) => setMaintDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Hora da Manutenção *</label>
                  <input
                    type="time"
                    value={maintTime}
                    onChange={(e) => setMaintTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-2">Quem realizou a manutenção? *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                    maintPerformedBy === 'self' 
                      ? 'border-blue-500 bg-blue-50/10 text-blue-650 dark:text-blue-400 font-bold' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}>
                    <input 
                      type="radio" 
                      name="maintPerformedBy" 
                      value="self" 
                      checked={maintPerformedBy === 'self'}
                      onChange={() => setMaintPerformedBy('self')}
                      className="hidden" 
                    />
                    <span>Eu mesmo</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                    maintPerformedBy === 'company' 
                      ? 'border-blue-500 bg-blue-50/10 text-blue-650 dark:text-blue-400 font-bold' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}>
                    <input 
                      type="radio" 
                      name="maintPerformedBy" 
                      value="company" 
                      checked={maintPerformedBy === 'company'}
                      onChange={() => setMaintPerformedBy('company')}
                      className="hidden" 
                    />
                    <span>Empresa</span>
                  </label>
                </div>
              </div>

              {maintPerformedBy === 'company' && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">Nome da Empresa Prestadora *</label>
                  <input
                    type="text"
                    placeholder="Ex: SolarTech Manutenções"
                    value={maintCompanyName}
                    onChange={(e) => setMaintCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:border-blue-500 focus:outline-none"
                    required={maintPerformedBy === 'company'}
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={maintLoading}
                  className="px-4 py-2 bg-linear-to-r from-[#2E5CFF] to-[#FF7A2F] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-1 min-w-[100px] cursor-pointer"
                >
                  {maintLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Salvar Registro'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
