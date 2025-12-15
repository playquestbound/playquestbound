import { Home, BookOpen, Compass, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import questSword from '@/assets/quest-sword.png';

const leftItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
];

const rightItems = [
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/store', icon: ShoppingBag, label: 'Store' },
];

export function BottomNav() {
  const location = useLocation();
  const isQuestsActive = location.pathname === '/quests' || location.pathname.startsWith('/quests');

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: typeof Home; label: string }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    
    return (
      <Link
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
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-2">
        {/* Left pill */}
        <nav className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-2 py-2 border border-white/20">
          {leftItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Center Quests button - elevated */}
        <Link
          to="/quests"
          className="relative flex flex-col items-center -mt-6 transition-transform duration-200 hover:scale-105"
        >
          <img 
            src={questSword} 
            alt="Quests" 
            className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]"
          />
          <span className={`font-tech text-[10px] mt-1 transition-colors duration-200 ${
            isQuestsActive ? 'text-white font-medium' : 'text-white/60'
          }`}>
            Quests
          </span>
        </Link>

        {/* Right pill */}
        <nav className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-2 py-2 border border-white/20">
          {rightItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
