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
  <div className="min-h-screen grid lg:grid-cols-2 bg-white">
    {/* Lado esquerdo */}
    <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#1F4EFF] via-[#2E5CFF] to-[#FF8A3D]">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex flex-col items-center text-center text-white px-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <img
            src="/images/logo-lumiere.png"
            alt="Solar"
            className="w-[360px] max-w-full"
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
    <div className="flex items-center justify-center px-8 py-10 bg-white">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#2E5CFF] to-[#FF7A2F] flex items-center justify-center text-white font-bold text-lg">
            L
          </div>

          <span className="text-3xl font-bold text-slate-800">
            Lumière
          </span>
        </div>

        <h2 className="text-4xl font-bold text-slate-900">
          Entrar
        </h2>

        <p className="mt-2 mb-8 text-slate-500">
          Acesse sua conta para gerenciar sua usina solar
        </p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-slate-600">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-14 rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="mb-2 block text-sm text-slate-600">
              Senha
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 rounded-xl border border-slate-300 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500">
              <input type="checkbox" className="rounded" />
              Lembrar-me
            </label>

            <a
              href="#"
              className="text-blue-600 hover:underline"
            >
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2E5CFF] to-[#FF7A2F] font-semibold text-white transition hover:opacity-95"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <>
                Entrar
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">
            ou
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-slate-500">
          Não tem conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Criar conta
          </Link>
        </p>

      </div>
    </div>
  </div>
);}