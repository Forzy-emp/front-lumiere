import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Smartphone, ArrowRight, ChevronLeft } from 'lucide-react';

export default function RecoverPassword() {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic icon detection
  const isPhone = /\d/.test(contact) && !contact.includes('@');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contact.trim()) {
      setError('Por favor, insira seu e-mail ou número de telefone.');
      return;
    }

    // Basic email validation if it doesn't look like a phone number
    if (!isPhone && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    // Basic phone validation (needs at least some length)
    if (isPhone && contact.trim().replace(/\D/g, '').length < 8) {
      setError('Por favor, insira um número de telefone válido.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/validation', { state: { contact: contact.trim() } });
    }, 800);
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
            Recuperar Senha
          </h2>

          <p className="mt-2 mb-8 text-slate-500 dark:text-slate-400">
            Insira o seu e-mail ou celular cadastrado e enviaremos um código de validação.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-3 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* E-mail ou Celular */}
            <div>
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">
                E-mail ou Celular
              </label>

              <div className="relative">
                {isPhone ? (
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors duration-200" />
                ) : (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors duration-200" />
                )}

                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="seu@email.com ou (11) 99999-9999"
                  className="w-full h-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
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
                  Enviar Código
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
