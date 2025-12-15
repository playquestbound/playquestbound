import { Home, BookOpen, Compass, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavTheme } from '@/hooks/useNavTheme';
import questSword from '@/assets/quest-sword.png';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/quests', icon: null, label: 'Quests', isCenter: true },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/store', icon: ShoppingBag, label: 'Store' },
];

export function BottomNav() {
  const location = useLocation();
  const { config } = useNavTheme();

  const NavItem = ({ to, icon: Icon, label, isCenter }: { to: string; icon: typeof Home | null; label: string; isCenter?: boolean }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    
    if (isCenter) {
      return (
        <Link
          to={to}
          className="relative flex flex-col items-center justify-center px-1 sm:px-2 transition-transform duration-200 hover:scale-105"
        >
          <img 
            src={questSword} 
            alt="Quests" 
            className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain -my-4 sm:-my-6 md:-my-8"
            style={{
              filter: `drop-shadow(0 4px 12px ${config.glowColor})`,
            }}
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
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              backgroundColor: config.activeBgColor,
              boxShadow: `0 0 12px ${config.glowColor}`,
            }}
          />
        )}
        {Icon && (
          <Icon 
            className="relative z-10 w-5 h-5 transition-colors duration-200"
            style={{ 
              color: isActive ? config.activeIconColor : config.iconColor,
            }}
            strokeWidth={isActive ? 2.5 : 2}
          />
        )}
        <span 
          className="relative z-10 font-tech text-[10px] mt-0.5 transition-colors duration-200"
          style={{ 
            color: isActive ? config.activeIconColor : config.iconColor,
            fontWeight: isActive ? 500 : 400,
            opacity: isActive ? 1 : 0.7,
          }}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav 
        className="flex items-center backdrop-blur-sm rounded-full px-2 py-2 overflow-visible"
        style={{
          backgroundColor: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          boxShadow: `0 0 20px ${config.glowColor}, 0 4px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}
