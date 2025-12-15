import { Home, ScrollText, BookOpen, Compass, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/quests', icon: ScrollText, label: 'Quests' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/store', icon: ShoppingBag, label: 'Store' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-2 py-2 border border-white/20">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center justify-center px-4 py-2 transition-all duration-200"
            >
              {isActive && (
                <div className="absolute inset-0 bg-white rounded-full" />
              )}
              <Icon 
                className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
                  isActive ? 'text-black' : 'text-white/70'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`relative z-10 font-tech text-[10px] mt-0.5 transition-colors duration-200 ${
                isActive ? 'text-black font-medium' : 'text-white/60'
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
