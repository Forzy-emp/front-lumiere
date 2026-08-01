import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sun,
  History, 
  BarChart3,
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronRight 
} from 'lucide-react';

// Lumiere Logo Component
export function LumiereLogoHorizontal({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 160 150" className="h-full aspect-square" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sunGradH" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb03a" />
            <stop offset="100%" stopColor="#f2a160" />
          </linearGradient>
          <linearGradient id="panelGradH" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22AADA" />
            <stop offset="100%" stopColor="#054986" />
          </linearGradient>
          <linearGradient id="swoopGradH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffb03a" />
            <stop offset="100%" stopColor="#f2a160" />
          </linearGradient>
        </defs>
        {/* Sun */}
        <circle cx="45" cy="35" r="14" fill="url(#sunGradH)" />
        
        {/* Swoop (orange ring) */}
        <path d="M25 105 C 55 125, 120 95, 115 45 C 110 20, 85 35, 65 55" stroke="url(#swoopGradH)" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Solar panel grid block 1 */}
        <path d="M15 65 C25 60, 40 60, 50 65 L50 95 C40 90, 25 90, 15 95 Z" fill="url(#panelGradH)" opacity="0.9" />
        <path d="M55 66 C65 62, 80 62, 90 66 L90 96 C80 92, 65 92, 55 96 Z" fill="url(#panelGradH)" opacity="0.9" />
        <path d="M95 68 C105 65, 120 65, 130 68 L130 98 C120 95, 105 95, 95 98 Z" fill="url(#panelGradH)" opacity="0.9" />
        
        {/* Solar panel grid block 2 */}
        <path d="M15 100 C25 95, 40 95, 50 100 L50 120 C40 115, 25 115, 15 120 Z" fill="url(#panelGradH)" />
        <path d="M55 101 C65 97, 80 97, 90 101 L90 121 C80 117, 65 117, 55 121 Z" fill="url(#panelGradH)" />
        <path d="M95 103 C105 100, 120 100, 130 103 L130 123 C120 120, 105 120, 95 123 Z" fill="url(#panelGradH)" />
      </svg>
      <div className="flex flex-col justify-center select-none">
        <span className="font-bold text-lg tracking-tight leading-none text-lumiere-tertiary">LUMIERE</span>
        <span className="text-[9px] font-extrabold tracking-widest leading-none text-lumiere-secondary uppercase">SOLAR CLUB</span>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('user@lumiere.com');
  const [userName, setUserName] = useState('Cliente Lumière');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      // Derive simple display name
      const parts = email.split('@')[0];
      const capitalized = parts.charAt(0).toUpperCase() + parts.slice(1);
      setUserName(capitalized);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Requested Menu lateral items:
  // Dashboard, Minha Usina, Consumo, Histórico, Relatórios, Manutenção, Perfil, Configurações, Sair
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Minha Usina', path: '/dashboard/usina', icon: Sun },
    { name: 'Histórico', path: '/dashboard/history', icon: History },
    { name: 'Relatórios', path: '/dashboard/relatorios', icon: BarChart3 },
    { name: 'Perfil', path: '/dashboard/profile', icon: User },
    { name: 'Configurações', path: '/dashboard/settings', icon: Settings },
  ];

  // Helper to determine active path
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <LumiereLogoHorizontal className="h-9" />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-600 dark:text-slate-300 hover:text-lumiere-tertiary p-1 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:z-auto
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo at the top of Sidebar */}
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <LumiereLogoHorizontal className="h-10" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path === '/dashboard/consumo' || item.path === '/dashboard/relatorios' || item.path === '/dashboard/manutencao' ? '#' : item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group
                    ${active 
                      ? 'bg-lumiere-primary/10 dark:bg-lumiere-primary/20 text-lumiere-tertiary font-bold border-l-4 border-lumiere-primary' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border-l-4 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-lumiere-tertiary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-lumiere-tertiary" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-lumiere-primary to-lumiere-tertiary flex items-center justify-center text-sm font-semibold uppercase text-white shadow-sm">
              {userName.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{userName}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent"
          >
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-red-650" />
            <span className="text-sm font-medium">Sair da usina</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <LumiereLogoHorizontal className="h-9" />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications Button */}
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-lumiere-secondary ring-2 ring-white dark:ring-slate-900" />
            </button>
            
            {/* Settings Button */}
            <Link to="/dashboard/settings" className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all">
              <Settings className="w-5 h-5" />
            </Link>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* User Profile Info & Photo */}
            <Link to="/dashboard/profile" className="flex items-center gap-2.5 hover:opacity-90 group transition-opacity">
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block group-hover:text-lumiere-tertiary">{userName}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block -mt-0.5">{userEmail}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-lumiere-primary/20 text-lumiere-tertiary border border-lumiere-primary/30 flex items-center justify-center font-bold text-sm">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
        />
      )}
    </div>
  );
}