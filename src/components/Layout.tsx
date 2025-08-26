import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Inbox, Calendar, Clock, BarChart3, Baseline as Timeline, CheckSquare, Menu, X, Home } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Backlog', href: '/backlog', icon: Inbox },
  { name: 'Today', href: '/today', icon: Clock },
  { name: 'This Week', href: '/this-week', icon: CheckSquare },
  { name: 'Next Week', href: '/next-week', icon: Calendar },
  { name: 'Timeline', href: '/timeline', icon: Timeline },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}
        style={{ 
          opacity: mobileMenuOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <div 
          className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/70 to-blue-900/80 backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)} 
        />
        <div 
          className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-blue-900 shadow-2xl"
          style={{
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              Sprint Planner
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white/70 hover:text-white transition-all duration-300 hover:rotate-90"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-2 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 backdrop-blur-lg text-white shadow-lg shadow-blue-500/30 border border-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5 hover:shadow-md hover:border-white/5 border border-transparent'
                  }`}
                >
                  <item.icon 
                    className={`mr-4 h-5 w-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-white scale-110' 
                        : 'text-white/60 group-hover:text-white group-hover:scale-110'
                    }`} 
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-blue-900 shadow-2xl">
          <div className="flex flex-1 flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  Sprint Planner
                </h1>
              </div>
            </div>
            <nav className="mt-4 flex-1 space-y-2 px-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 backdrop-blur-lg text-white shadow-lg shadow-blue-500/30 border border-white/10 transform transition-all duration-300'
                        : 'text-white/70 hover:text-white hover:bg-white/5 hover:shadow-md hover:border-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon 
                      className={`mr-4 h-5 w-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-white scale-110' 
                          : 'text-white/60 group-hover:text-white group-hover:scale-110'
                      }`} 
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40">
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-purple-900 px-4 py-3 shadow-lg border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Sprint Planner</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white/80 hover:text-white transition-all duration-300 hover:rotate-12 hover:scale-110"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <main className="flex-1">
          <div className="relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
            </div>
            <div className="relative">
              {children}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}