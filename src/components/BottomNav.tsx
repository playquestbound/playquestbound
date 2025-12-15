import { Home, BookOpen, Compass, ShoppingBag, Sword } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/quests', icon: Sword, label: 'Quests', isCenter: true },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/store', icon: ShoppingBag, label: 'Store' },
];

export function BottomNav() {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label, isCenter }: { to: string; icon: typeof Home; label: string; isCenter?: boolean }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    
    if (isCenter) {
      return (
        <Link
          to={to}
          className="relative flex flex-col items-center justify-center px-1 transition-transform duration-200 hover:scale-105"
          style={{ marginTop: '-24px' }}
        >
          <img 
            src="/images/quest-sword.png" 
            alt="Quests" 
            className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]"
          />
        </Link>
      );
    }
    
    return (
      <Link
        to={to}
        className="relative flex flex-col items-center justify-center px-3 sm:px-4 py-2 transition-all duration-200"
      >
        {isActive && (
          <div className="absolute inset-0 bg-white rounded-full" />
        )}
        {Icon && (
          <Icon 
            className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
              isActive ? 'text-black' : 'text-white/70'
            }`}
            strokeWidth={isActive ? 2.5 : 2}
          />
        )}
        <span className={`relative z-10 font-tech text-[10px] mt-0.5 transition-colors duration-200 ${
          isActive ? 'text-black font-medium' : 'text-white/60'
        }`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-end bg-black/80 backdrop-blur-sm rounded-full px-2 py-2 border border-white/20">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}
