import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, ArrowRight, ChevronLeft } from 'lucide-react';

export default function NewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Requirements check
  const requirements = [
    { label: 'Pelo menos 8 caracteres', met: password.length >= 8 },
    { label: 'Uma letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Uma letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Um número', met: /\d/.test(password) },
    { label: 'Um caractere especial (ex: @, #, $, %)', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const allRequirementsMet = requirements.every(req => req.met);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!allRequirementsMet) {
      setError('A senha não atende a todos os requisitos de segurança abaixo.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-linear-to-br from-[#1F4EFF] via-[#2E5CFF] to-[#FF8A3D]">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col items-center text-center text-white px-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8">
            <img
              src="/images/logo-lumiere.png"
              alt="Solar"
              className="w-90 max-w-full"
            />
          </div>

          <h1 className="mt-10 text-4xl font-bold">
            Bem-vindo ao Lumière
          </h1>

          <p className="mt-3 text-lg text-white/80">
            Gerenciamento inteligente de energia solar
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex items-center justify-center px-8 py-10 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md relative">
          
          {/* Voltar */}
          <Link
            to="/login"
            className="absolute -top-12 left-0 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar para o login
          </Link>

          {/* Logo */}
          <div className="flex justify-center items-center gap-3 mb-12">
            <div className="h-11 w-11 rounded-xl bg-linear-to-br from-[#2E5CFF] to-[#FF7A2F] flex items-center justify-center text-white font-bold text-lg">
              L
            </div>

            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Lumière
            </span>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Nova Senha
          </h2>

          <p className="mt-2 mb-8 text-slate-500 dark:text-slate-400">
            Crie uma nova senha forte para acessar a sua conta.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-3 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300">
                <Check className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100">Senha redefinida com sucesso!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Redirecionando para a página de login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Senha */}
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">
                  Nova Senha
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Requisitos Dinâmicos */}
                <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Requisitos de Segurança:</p>
                  <ul className="space-y-1.5">
                    {requirements.map((req, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                          req.met 
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium' 
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
                        )}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">
                  Confirmar Senha
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-linear-to-br from-[#2E5CFF] to-[#FF7A2F] font-semibold text-white transition hover:opacity-95 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    Definir Nova Senha
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
