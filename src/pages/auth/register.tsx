// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Lock, Mail, User, ArrowRight, Check } from 'lucide-react';

// export default function Register() {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!name || !email || !password || !confirmPassword) {
//       setError('Por favor, preencha todos os campos.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('As senhas não coincidem.');
//       return;
//     }

//     if (password.length < 6) {
//       setError('A senha deve ter pelo menos 6 caracteres.');
//       return;
//     }

//     setLoading(true);

//     // Simulate registration
//     setTimeout(() => {
//       setLoading(false);
//       setSuccess(true);
//       setTimeout(() => {
//         navigate('/login');
//       }, 1500);
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
//       {/* Brand light gradient backgrounds */}
//       <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lumiere-primary/10 blur-[120px]" />
//       <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lumiere-secondary/10 blur-[120px]" />

//       <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative z-10">
//         <div className="text-center mb-8 flex flex-col items-center">
//           {/* Logo Icon SVG */}
//           <div className="h-16 w-16 mb-4">
//             <svg viewBox="0 0 160 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <defs>
//                 <linearGradient id="sunGradR" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#ffb03a" />
//                   <stop offset="100%" stopColor="#f2a160" />
//                 </linearGradient>
//                 <linearGradient id="panelGradR" x1="0%" y1="0%" x2="0%" y2="100%">
//                   <stop offset="0%" stopColor="#22AADA" />
//                   <stop offset="100%" stopColor="#054986" />
//                 </linearGradient>
//                 <linearGradient id="swoopGradR" x1="0%" y1="0%" x2="100%" y2="0%">
//                   <stop offset="0%" stopColor="#ffb03a" />
//                   <stop offset="100%" stopColor="#f2a160" />
//                 </linearGradient>
//               </defs>
//               <circle cx="45" cy="35" r="14" fill="url(#sunGradR)" />
//               <path d="M25 105 C 55 125, 120 95, 115 45 C 110 20, 85 35, 65 55" stroke="url(#swoopGradR)" strokeWidth="4" strokeLinecap="round" fill="none" />
//               <path d="M15 65 C25 60, 40 60, 50 65 L50 95 C40 90, 25 90, 15 95 Z" fill="url(#panelGradR)" opacity="0.9" />
//               <path d="M55 66 C65 62, 80 62, 90 66 L90 96 C80 92, 65 92, 55 96 Z" fill="url(#panelGradR)" opacity="0.9" />
//               <path d="M95 68 C105 65, 120 65, 130 68 L130 98 C120 95, 105 95, 95 98 Z" fill="url(#panelGradR)" opacity="0.9" />
//               <path d="M15 100 C25 95, 40 95, 50 100 L50 120 C40 115, 25 115, 15 120 Z" fill="url(#panelGradR)" />
//               <path d="M55 101 C65 97, 80 97, 90 101 L90 121 C80 117, 65 117, 55 121 Z" fill="url(#panelGradR)" />
//               <path d="M95 103 C105 100, 120 100, 130 103 L130 123 C120 120, 105 120, 95 123 Z" fill="url(#panelGradR)" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Criar Conta</h2>
//           <p className="text-slate-500 mt-2 text-sm font-medium">Comece a usar o Lumière gratuitamente</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-655 text-sm text-center">
//             {error}
//           </div>
//         )}

//         {success ? (
//           <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center space-y-3">
//             <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
//               <Check className="w-5 h-5" />
//             </div>
//             <p className="font-bold text-slate-800">Conta criada com sucesso!</p>
//             <p className="text-xs text-slate-500">Redirecionando para a página de login...</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
//                 Nome Completo
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
//                   <User className="w-5 h-5" />
//                 </span>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Seu Nome"
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
//                 Endereço de E-mail
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
//                   <Mail className="w-5 h-5" />
//                 </span>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="nome@exemplo.com"
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
//                 Senha
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
//                   <Lock className="w-5 h-5" />
//                 </span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
//                 Confirmar Senha
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
//                   <Lock className="w-5 h-5" />
//                 </span>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 mt-2 bg-gradient-to-r from-lumiere-primary to-lumiere-tertiary hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-lumiere-primary/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   Criar minha conta <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>
//         )}

//         <div className="mt-8 text-center">
//           <p className="text-sm text-slate-500 font-medium">
//             Já possui uma conta?{' '}
//             <Link to="/login" className="font-bold text-lumiere-primary hover:text-lumiere-tertiary transition-colors">
//               Fazer login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Novos campos do mockup (sem validação, apenas controlados)
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Brand light gradient backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lumiere-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lumiere-secondary/10 blur-[120px]" />

      <div className="w-full max-w-xl relative z-10">
        {/* Voltar */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-lumiere-primary hover:text-lumiere-tertiary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-600 via-purple-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
              L
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">Lumière</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Criar Conta</h2>
            <p className="text-slate-500 mt-1 text-sm">Preencha os dados abaixo para começar</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800">Conta criada com sucesso!</p>
              <p className="text-xs text-slate-500">Redirecionando para a página de login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="São Paulo"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-lumiere-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecione um estado</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-lumiere-primary focus:ring-lumiere-primary"
                />
                <span>
                  Aceito os{' '}
                  <span className="font-semibold text-lumiere-primary hover:text-lumiere-tertiary transition-colors">
                    termos de serviço
                  </span>{' '}
                  e a{' '}
                  <span className="font-semibold text-lumiere-primary hover:text-lumiere-tertiary transition-colors">
                    política de privacidade
                  </span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-linear-to-r from-indigo-600 via-purple-500 to-orange-500 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-lumiere-primary/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Criar Conta <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Já tem conta?{' '}
              <Link to="/login" className="font-bold text-lumiere-primary hover:text-lumiere-tertiary transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}