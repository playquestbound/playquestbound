import { Home, Scroll, BookOpen, Compass, ShoppingBag } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/quests', icon: Scroll, label: 'Quests' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/store', icon: ShoppingBag, label: 'Store' },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="nav-item flex-1"
            activeClassName="active"
            end={to === '/'}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
