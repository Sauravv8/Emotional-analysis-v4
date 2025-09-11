import React, { useState } from 'react';
import { Crown, Sparkles, User, Settings, LogOut, Edit } from 'lucide-react';
import { UserStats } from '../App';

interface HeaderProps {
  userStats?: UserStats;
}

export const Header: React.FC<HeaderProps> = ({ userStats }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Spiritual Seeker',
    email: 'seeker@spiritualjourney.com',
    joinDate: 'January 2024',
    favoriteVerse: 'Bhagavad Gita 2.47',
    spiritualGoal: 'Inner Peace & Self-Realization'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setIsEditing(false);
    localStorage.setItem('userProfile', JSON.stringify(editForm));
  };

  const handleCancelEdit = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };

  // Load profile from localStorage on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      const profile = JSON.parse(saved);
      setUserProfile(profile);
      setEditForm(profile);
    }
  }, []);

  return (
    <header className="bg-gradient-to-r from-spiritual-deep/80 via-spiritual-navy/70 to-spiritual-slate/80 backdrop-blur-xl border-b border-spiritual-gold/20 relative overflow-hidden">
      {/* Enhanced Divine Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-spiritual-gold/10 via-spiritual-sage/5 to-spiritual-orange/10"></div>
      <div className="absolute inset-0 bg-mandala-pattern opacity-10"></div>
      
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              {/* Enhanced Sacred Geometry Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-spiritual-gold/40 to-spiritual-orange/40 rounded-full blur-2xl group-hover:from-spiritual-gold/60 group-hover:to-spiritual-orange/60 transition-all duration-500"></div>
              
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-spiritual-gold/30 via-spiritual-sage/20 to-spiritual-orange/30 rounded-full border-2 border-spiritual-gold/50 backdrop-blur-sm hover:scale-110 transition-all duration-500 animate-glow-divine">
                <Crown className="w-8 h-8 text-spiritual-gold animate-pulse-soft" />
                <Sparkles className="w-4 h-4 text-spiritual-orange absolute -top-1 -right-1 animate-bounce-gentle" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-spiritual-gold to-spiritual-orange bg-clip-text text-transparent font-display">
                  Gita Guidance
                </h1>
                <div className="text-spiritual-gold text-2xl animate-float-gentle">🕉️</div>
              </div>
              <p className="text-lg text-spiritual-light font-medium">
                Divine Wisdom • AI-Powered Guidance • Spiritual Growth
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Enhanced Karma Display */}
            <div className="text-right bg-gradient-to-r from-spiritual-gold/20 to-spiritual-orange/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-spiritual-gold/30 hover:border-spiritual-gold/50 transition-all duration-300 animate-breathe">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-spiritual-gold to-spiritual-orange rounded-full animate-pulse-soft"></div>
                <p className="text-spiritual-gold font-bold text-2xl">{userStats?.karmaPoints || 0}</p>
                <span className="text-white/80 text-lg font-medium">Karma</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="text-spiritual-orange text-sm">🔥</div>
                <p className="text-white/80 text-sm font-medium">{userStats?.streakDays || 0}-day streak</p>
              </div>
            </div>
            
            {/* Enhanced Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="relative group cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-spiritual-sage/50 to-spiritual-gold/50 rounded-full border-3 border-spiritual-gold/60 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-all duration-300 hover:border-spiritual-gold/80 animate-sacred-pulse">
                  <span className="text-white font-bold text-lg">🧘</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-spiritual-gold/40 to-spiritual-sage/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-16 w-96 bg-gradient-to-br from-spiritual-deep/95 to-spiritual-navy/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-spiritual-gold/30 z-50 overflow-hidden animate-scale-in">
                  <div className="p-8">
                    {!isEditing ? (
                      <>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-spiritual-gold to-spiritual-orange rounded-full flex items-center justify-center animate-glow-divine">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white font-display">{userProfile.name}</h3>
                            <p className="text-spiritual-light">{userProfile.email}</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="bg-spiritual-gold/10 rounded-2xl p-4 border border-spiritual-gold/20">
                            <p className="text-spiritual-light text-sm font-medium">Spiritual Journey Started</p>
                            <p className="text-white font-bold">{userProfile.joinDate}</p>
                          </div>
                          
                          <div className="bg-spiritual-sage/10 rounded-2xl p-4 border border-spiritual-sage/20">
                            <p className="text-spiritual-light text-sm font-medium">Favorite Verse</p>
                            <p className="text-white font-bold">{userProfile.favoriteVerse}</p>
                          </div>
                          
                          <div className="bg-spiritual-orange/10 rounded-2xl p-4 border border-spiritual-orange/20">
                            <p className="text-spiritual-light text-sm font-medium">Spiritual Goal</p>
                            <p className="text-white font-bold">{userProfile.spiritualGoal}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-spiritual-gold to-spiritual-orange hover:from-spiritual-gold/80 hover:to-spiritual-orange/80 rounded-xl transition-all duration-300 text-white font-medium animate-shimmer bg-[length:200%_100%]"
                          >
                            <Edit className="w-5 h-5" />
                            <span>Edit Profile</span>
                          </button>
                          
                          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-spiritual-sage/20 hover:bg-spiritual-sage/30 rounded-xl transition-all duration-300 text-white font-medium border border-spiritual-sage/30">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                          </button>
                          
                          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 rounded-xl transition-all duration-300 text-red-300 font-medium border border-red-500/30">
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-white mb-6 text-center font-display">Edit Profile</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-spiritual-light text-sm font-medium mb-2">Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-4 py-3 bg-spiritual-gold/10 border border-spiritual-gold/30 rounded-xl text-white placeholder-spiritual-light focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 focus:border-spiritual-gold/50 transition-all duration-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-spiritual-light text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="w-full px-4 py-3 bg-spiritual-sage/10 border border-spiritual-sage/30 rounded-xl text-white placeholder-spiritual-light focus:outline-none focus:ring-2 focus:ring-spiritual-sage/50 focus:border-spiritual-sage/50 transition-all duration-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-spiritual-light text-sm font-medium mb-2">Favorite Verse</label>
                            <input
                              type="text"
                              value={editForm.favoriteVerse}
                              onChange={(e) => setEditForm({...editForm, favoriteVerse: e.target.value})}
                              className="w-full px-4 py-3 bg-spiritual-orange/10 border border-spiritual-orange/30 rounded-xl text-white placeholder-spiritual-light focus:outline-none focus:ring-2 focus:ring-spiritual-orange/50 focus:border-spiritual-orange/50 transition-all duration-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-spiritual-light text-sm font-medium mb-2">Spiritual Goal</label>
                            <textarea
                              value={editForm.spiritualGoal}
                              onChange={(e) => setEditForm({...editForm, spiritualGoal: e.target.value})}
                              className="w-full px-4 py-3 bg-spiritual-purple/10 border border-spiritual-purple/30 rounded-xl text-white placeholder-spiritual-light focus:outline-none focus:ring-2 focus:ring-spiritual-purple/50 focus:border-spiritual-purple/50 resize-none h-20 transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveProfile}
                            className="flex-1 py-3 bg-gradient-to-r from-spiritual-sage to-spiritual-emerald hover:from-spiritual-sage/80 hover:to-spiritual-emerald/80 rounded-xl transition-all duration-300 text-white font-bold animate-glow-divine"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 py-3 bg-spiritual-slate/30 hover:bg-spiritual-slate/40 rounded-xl transition-all duration-300 text-white font-bold border border-spiritual-slate/50"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};