import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Check, Save } from 'lucide-react';
import { GetUserProfile } from '../../service/auth';

export default function Profile() {
  const [name, setName] = useState('Admin Lumière');
  const [email, setEmail] = useState('admin@lumiere.com');
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await GetUserProfile();
      if (response) {
        setName(response.name);
        setEmail(response.email);

        console.log("type: ", response.type);
        if(response.type == 1) {
          setRole("Administrador");
        } else if(response.type == 2) {
          setRole("Associado");
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      localStorage.setItem('userEmail', email);
      // Fade away save message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in font-sans">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Meu Perfil</h2>
        <p className="text-sm text-slate-500">Gerencie suas informações pessoais e credenciais de acesso.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Alterações salvas com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Sidebar card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-lumiere-primary to-lumiere-tertiary flex items-center justify-center text-3xl font-extrabold text-white shadow-md mb-4 border-2 border-slate-100">
            {name.substring(0, 2).toUpperCase()}
          </div>
          <h3 className="font-bold text-slate-800">{name}</h3>
          <p className="text-xs text-slate-400 mt-1">{email}</p>
          <span className="mt-4 px-3 py-1 rounded-full bg-lumiere-primary/10 border border-lumiere-primary/20 text-lumiere-tertiary text-[10px] font-bold tracking-wider uppercase">
            {role}
          </span>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-lumiere-primary" />
                Informações Básicas
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome de Exibição</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Shield className="w-4 h-4 text-lumiere-primary" />
                Segurança
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nova Senha</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-lumiere-primary to-lumiere-tertiary hover:opacity-95 text-sm font-bold text-white rounded-xl shadow-lg shadow-lumiere-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
