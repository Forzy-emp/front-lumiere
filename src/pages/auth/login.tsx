import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Brand light gradient backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lumiere-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lumiere-secondary/10 blur-[120px]" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Logo Icon SVG */}
          <div className="h-16 w-16 mb-4">
            <svg viewBox="0 0 160 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sunGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffb03a" />
                  <stop offset="100%" stopColor="#f2a160" />
                </linearGradient>
                <linearGradient id="panelGradL" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22AADA" />
                  <stop offset="100%" stopColor="#054986" />
                </linearGradient>
                <linearGradient id="swoopGradL" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffb03a" />
                  <stop offset="100%" stopColor="#f2a160" />
                </linearGradient>
              </defs>
              <circle cx="45" cy="35" r="14" fill="url(#sunGradL)" />
              <path d="M25 105 C 55 125, 120 95, 115 45 C 110 20, 85 35, 65 55" stroke="url(#swoopGradL)" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M15 65 C25 60, 40 60, 50 65 L50 95 C40 90, 25 90, 15 95 Z" fill="url(#panelGradL)" opacity="0.9" />
              <path d="M55 66 C65 62, 80 62, 90 66 L90 96 C80 92, 65 92, 55 96 Z" fill="url(#panelGradL)" opacity="0.9" />
              <path d="M95 68 C105 65, 120 65, 130 68 L130 98 C120 95, 105 95, 95 98 Z" fill="url(#panelGradL)" opacity="0.9" />
              <path d="M15 100 C25 95, 40 95, 50 100 L50 120 C40 115, 25 115, 15 120 Z" fill="url(#panelGradL)" />
              <path d="M55 101 C65 97, 80 97, 90 101 L90 121 C80 117, 65 117, 55 121 Z" fill="url(#panelGradL)" />
              <path d="M95 103 C105 100, 120 100, 130 103 L130 123 C120 120, 105 120, 95 123 Z" fill="url(#panelGradL)" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">LUMIERE</h2>
          <span className="text-[10px] font-extrabold tracking-widest text-lumiere-secondary uppercase -mt-0.5">Solar Club</span>
          <p className="text-slate-500 mt-3 text-sm font-medium">Entre na sua conta para continuar</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-650 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Endereço de E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Senha
              </label>
              <a href="#" className="text-xs font-semibold text-lumiere-primary hover:text-lumiere-tertiary transition-colors">
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-lumiere-primary to-lumiere-tertiary hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-lumiere-primary/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Entrar <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Ainda não tem conta?{' '}
            <Link to="/register" className="font-bold text-lumiere-primary hover:text-lumiere-tertiary transition-colors">
              Registre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
