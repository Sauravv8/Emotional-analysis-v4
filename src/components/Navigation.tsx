import React from 'react';
import { Home, MessageCircle, BarChart3, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentView: 'landing' | 'home' | 'chat' | 'dashboard' | 'journey';
  onViewChange: (view: 'landing' | 'home' | 'chat' | 'dashboard' | 'journey') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Emotion Analysis' },
    { id: 'chat', icon: MessageCircle, label: 'Krishna Chat' },
    { id: 'dashboard', icon: BarChart3, label: 'Karma Dashboard' },
    { id: 'journey', icon: TrendingUp, label: 'Your Journey' },
  ];

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 relative overflow-hidden">
      {/* Divine Energy Flow */}
      <div className="absolute inset-0 bg-gradient-to-r from-spiritual-gold/5 via-transparent via-transparent to-spiritual-accent/5"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex space-x-2 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <div key={item.id} className="relative group">
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-spiritual-gold/30 to-spiritual-amber/30 rounded-xl blur-sm"></div>
                )}
              <button
                onClick={() => onViewChange(item.id as any)}
                className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-spiritual-gold to-spiritual-amber text-spiritual-deep shadow-lg font-bold'
                    : 'text-spiritual-light hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-white/20' : 'group-hover:bg-white/10'} transition-all duration-300`}>
                <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium ${isActive ? 'text-spiritual-deep' : ''}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-spiritual-gold rounded-full animate-pulse"></div>
                )}
              </button>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};