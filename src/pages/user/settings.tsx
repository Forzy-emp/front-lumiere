import { useState } from 'react';
import { Bell, Shield, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityLogs, setSecurityLogs] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  const { theme, setTheme } = useTheme();
  

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in font-sans">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Configurações</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Ajuste as preferências de notificação, acessibilidade e segurança.</p>
      </div>

      <div className="space-y-6">
        {/* Preference Category: General */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-lumiere-primary" />
            Preferências Gerais
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Idioma do Console</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Selecione o idioma padrão para a interface.</span>
              </div>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-lumiere-primary"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Tema Visual</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Escolha a aparência da sua interface.</span>
              </div>
              <select 
                value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-lumiere-primary"
              >
                <option value="light">Claro (Padrão)</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preference Category: Notifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-lumiere-primary" />
            Notificações
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Notificações por E-mail</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Receba alertas sobre atividades suspeitas ou transações críticas.</span>
              </div>
              <button 
                onClick={() => setEmailNotifications(!emailNotifications)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {emailNotifications ? (
                  <ToggleRight className="w-10 h-10 text-lumiere-primary" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Relatórios Semanais</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Receba um resumo de faturamento e engajamento semanal.</span>
              </div>
              <button 
                onClick={() => setWeeklyReports(!weeklyReports)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {weeklyReports ? (
                  <ToggleRight className="w-10 h-10 text-lumiere-primary" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preference Category: Security */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-lumiere-primary" />
            Segurança
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Histórico de Sessão</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Registrar local e IP de todos os logins efetuados na plataforma.</span>
              </div>
              <button 
                onClick={() => setSecurityLogs(!securityLogs)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {securityLogs ? (
                  <ToggleRight className="w-10 h-10 text-lumiere-primary" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}