import { Home, User, Compass, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavTheme } from '@/hooks/useNavTheme';
import questSword from '@/assets/quest-sword.png';
import { useMemo } from 'react';


const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/quests', icon: null, label: 'Quests', isCenter: true },
  { to: '/store', icon: ShoppingBag, label: 'Store' },
  { to: '/profile', icon: User, label: 'You' },
];

export function BottomNav() {
  const location = useLocation();
  const { config, designStyle } = useNavTheme();
  const isModern = designStyle === 'modern';

  const navColors = useMemo(() => {
    if (isModern) {
      return {
        bgColor: 'rgba(255, 255, 255, 0.92)',
        iconColor: 'rgba(0, 0, 0, 0.5)',
        activeIconColor: '#ffffff',
        activeBgColor: 'hsl(155, 35%, 28%)',
        glowColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        shadowColor: '0 2px 20px rgba(0,0,0,0.08)',
        labelColor: 'rgba(0, 0, 0, 0.45)',
        activeLabelColor: '#ffffff',
      };
    }
    return {
      bgColor: config.bgColor,
      iconColor: config.iconColor,
      activeIconColor: config.activeIconColor,
      activeBgColor: config.activeBgColor,
      glowColor: config.glowColor,
      borderColor: config.borderColor,
      shadowColor: `0 0 20px ${config.glowColor}, 0 4px 20px rgba(0,0,0,0.3)`,
      labelColor: config.iconColor,
      activeLabelColor: config.activeIconColor,
    };
  }, [isModern, config]);

  const NavItem = ({ to, icon: Icon, label, isCenter }: { to: string; icon: typeof Home | null; label: string; isCenter?: boolean }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    
    if (isCenter) {
      return (
        <Link
          to={to}
          className="relative flex flex-col items-center justify-center px-4 transition-transform duration-200 hover:scale-105"
        >
          <img 
            src={questSword} 
            alt="Quests" 
            className="w-14 h-14 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain -my-5 sm:-my-6 md:-my-8"
            style={{
              filter: isModern 
                ? 'brightness(0.3) drop-shadow(0 2px 6px rgba(0,0,0,0.1))' 
                : `drop-shadow(0 4px 12px ${navColors.glowColor})`,
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
              backgroundColor: navColors.activeBgColor,
              boxShadow: isModern ? 'none' : `0 0 12px ${navColors.glowColor}`,
            }}
          />
        )}
        {Icon && (
          <Icon 
            className="relative z-10 w-5 h-5 transition-colors duration-200"
            style={{ 
              color: isActive ? navColors.activeIconColor : navColors.iconColor,
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      
      <nav 
        className="flex items-center justify-evenly backdrop-blur-sm rounded-full px-2 py-2 overflow-visible min-w-[340px] sm:min-w-0"
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
