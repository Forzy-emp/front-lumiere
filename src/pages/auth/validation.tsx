import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';

export default function Validation() {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact || 'seu e-mail/celular';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Count down timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      const newCode = pasteData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(59);
    setResendMessage('Um novo código de verificação foi enviado.');
    
    // Clear message after 4s
    setTimeout(() => {
      setResendMessage('');
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Por favor, preencha todos os 6 dígitos do código.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/new-password', { state: { contact } });
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
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-12 left-0 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          {/* Logo */}
          <div className="flex justify-center items-center gap-3 mb-12">
            <div className="h-11 w-11 rounded-xl bg-linear-to-br from-[#2E5CFF] to-[#FF7A2F] flex items-center justify-center text-white font-bold text-lg">
              L
            </div>

            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Lumière
            </span>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            Verificar Código
          </h2>

          <p className="mt-2 mb-8 text-slate-500 dark:text-slate-400">
            Enviamos um código de verificação de 6 dígitos para o endereço/celular: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{contact}</strong>
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-3 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="mb-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-center text-sm text-emerald-600 dark:text-emerald-400">
              {resendMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input dos 6 dígitos */}
            <div>
              <label className="mb-4 block text-sm text-slate-600 dark:text-slate-300 text-center">
                Insira o código abaixo
              </label>

              <div className="flex gap-2.5 justify-between max-w-sm mx-auto">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-150"
                  />
                ))}
              </div>
            </div>

            {/* Reenvio de Código */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0"
                >
                  Reenviar código
                </button>
              ) : (
                <span>Reenviar código em {countdown}s</span>
              )}
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
                  Verificar Código
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
