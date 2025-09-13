import React, { useState } from 'react';
import { Header } from './components/Header';
import { EmotionInput } from './components/EmotionInput';
import { ShlokaDisplay } from './components/ShlokaDisplay';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { UserJourney } from './components/UserJourney';
import { Navigation } from './components/Navigation';
import ProjectLandingPage from './components/ProjectLandingPage';

export type EmotionData = {
  emotion: string;
  confidence: number;
  timestamp: Date;
  inputText?: string;
};

export type ShlokaData = {
  sanskrit: string;
  translation: string;
  chapter: number;
  verse: number;
  explanation: string;
  practicalAdvice: string;
  relevantEmotion: string;
};

export type UserSession = {
  id: string;
  emotion: string;
  confidence: number;
  inputText: string;
  timestamp: Date;
  shlokaChapter: number;
  shlokaVerse: number;
};

export type UserStats = {
  totalSessions: number;
  emotionDistribution: Record<string, number>;
  averageConfidence: number;
  streakDays: number;
  karmaPoints: number;
  emotionalBalance: number;
  completedTasks: number;
  totalTasks: number;
};

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'home' | 'chat' | 'dashboard' | 'journey'>('landing');
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [shlokaData, setShlokaData] = useState<ShlokaData | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalSessions: 0,
    emotionDistribution: {},
    averageConfidence: 0,
    streakDays: 0,
    karmaPoints: 0,
    emotionalBalance: 50,
    completedTasks: 0,
    totalTasks: 5
  });

  // Load user data on component mount
  React.useEffect(() => {
    loadUserData();
    loadUserSessions();
  }, []);

  const loadUserSessions = () => {
    const saved = localStorage.getItem('userSessions');
    if (saved) {
      const sessions = JSON.parse(saved);
      setUserSessions(sessions);
      updateUserStatsFromSessions(sessions);
    }
  };

  const saveUserSessions = (sessions: UserSession[]) => {
    localStorage.setItem('userSessions', JSON.stringify(sessions));
    updateUserStatsFromSessions(sessions);
  };

  const updateUserStatsFromSessions = (sessions: UserSession[]) => {
    if (sessions.length === 0) return;

    const emotionDist: Record<string, number> = {};
    let totalConfidence = 0;

    sessions.forEach(session => {
      emotionDist[session.emotion] = (emotionDist[session.emotion] || 0) + 1;
      totalConfidence += session.confidence;
    });

    const avgConfidence = totalConfidence / sessions.length;
    const positiveEmotions = (emotionDist.joy || 0) + (emotionDist.gratitude || 0) + (emotionDist.love || 0) + (emotionDist.hope || 0);
    const negativeEmotions = (emotionDist.sadness || 0) + (emotionDist.anger || 0) + (emotionDist.fear || 0) + (emotionDist.anxiety || 0);
    const totalEmotions = positiveEmotions + negativeEmotions + (emotionDist.confusion || 0);
    const emotionalBalance = totalEmotions > 0 ? Math.round((positiveEmotions / totalEmotions) * 100) : 50;

    setUserStats(prev => ({
      ...prev,
      totalSessions: sessions.length,
      emotionDistribution: emotionDist,
      averageConfidence: avgConfidence,
      emotionalBalance,
      karmaPoints: sessions.length * 15 + Math.round(avgConfidence * 100),
      streakDays: calculateStreak(sessions)
    }));
  };
  const loadUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-progress');
      const data = await response.json();
      
      setUserStats({
        totalSessions: data.total_sessions || 0,
        emotionDistribution: data.emotion_distribution || {},
        averageConfidence: data.average_confidence || 0,
        streakDays: data.streak_days || 0,
        karmaPoints: data.karma_points || 0,
        emotionalBalance: data.emotional_balance || 50,
        completedTasks: data.completed_tasks || 0,
        totalTasks: 5
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleEmotionAnalysis = (emotion: EmotionData) => {
    setEmotionData(emotion);
    
    // Simulate API call to get relevant shloka
    const mockShloka: ShlokaData = {
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
      translation: "You have the right to perform your actions, but you are not entitled to the fruits of action.",
      chapter: 2,
      verse: 47,
      explanation: "This fundamental teaching reminds us to focus on our duties and efforts rather than being attached to outcomes. When we perform actions without attachment to results, we find peace and clarity.",
      practicalAdvice: "Practice mindful action today. Choose one task and perform it with complete attention, without worrying about the outcome. Notice how this changes your stress levels.",
      relevantEmotion: emotion.emotion
    };
    setShlokaData(mockShloka);
    
    // Add session to user data
    const newSession: UserSession = {
      id: Date.now().toString(),
      emotion: emotion.emotion,
      confidence: emotion.confidence,
      inputText: emotion.inputText || '',
      timestamp: new Date(),
      shlokaChapter: mockShloka.chapter,
      shlokaVerse: mockShloka.verse
    };
    
    const updatedSessions = [newSession, ...userSessions];
    setUserSessions(updatedSessions);
    saveUserSessions(updatedSessions);
  };

  const calculateStreak = (sessions: UserSession[]): number => {
    if (sessions.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < sessions.length - 1; i++) {
      const sessionDate = new Date(sessions[i].timestamp);
      const prevSessionDate = new Date(sessions[i + 1].timestamp);
      
      const daysDiff = Math.floor((sessionDate.getTime() - prevSessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streak++;
      } else if (daysDiff > 1) {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-spiritual-gradient">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-divine-radial"></div>
        <div className="absolute inset-0 bg-mandala-pattern opacity-40"></div>
        <div className="absolute inset-0 bg-sacred-geometry opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-spiritual-deep/30 to-transparent"></div>
      </div>
      
      {/* Floating Sacred Geometry */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-spiritual-gold/30 rounded-full animate-rotate-slow"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-2 border-spiritual-sage/40 rounded-full animate-float-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 border-2 border-spiritual-orange/25 rounded-full animate-lotus-spin"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 border-2 border-spiritual-purple/30 rounded-full animate-breathe"></div>
        
        {/* Sacred Om Symbol */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-spiritual-gold/15 animate-sacred-pulse font-sanskrit">ॐ</div>
        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 text-4xl text-spiritual-sage/15 animate-float-gentle font-sanskrit" style={{ animationDelay: '2s' }}>🕉️</div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
      {currentView !== 'landing' && (
        <>
          <Header userStats={userStats} />
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
        </>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'landing' && (
          <ProjectLandingPage onStart={() => setCurrentView('home')} />
        )}
        {currentView === 'home' && (
          <div className="space-y-8">
            <div className="text-center mb-12 relative">
              {/* Divine Aura Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-spiritual-gold/15 rounded-full blur-3xl animate-breathe"></div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 animate-fade-in">
                  <div className="text-6xl mb-4 animate-lotus-bloom">🪷</div>
                  <div className="text-2xl text-spiritual-gold font-sanskrit mb-2 font-bold">श्रीमद्भगवद्गीता</div>
                </div>
                
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up font-display">
                Discover Your Inner <span className="bg-gradient-to-r from-spiritual-gold to-spiritual-orange bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">Divine Wisdom</span>
              </h1>
              <p className="text-xl md:text-2xl text-spiritual-light max-w-3xl mx-auto animate-slide-up leading-relaxed font-medium">
                Experience personalized spiritual guidance from the eternal wisdom of the Bhagavad Gita, 
                tailored to your unique emotional journey through AI-powered analysis
              </p>
              
              {/* Sacred Divider */}
              <div className="flex items-center justify-center mt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="h-px bg-gradient-to-r from-transparent via-spiritual-gold to-transparent w-64"></div>
                <div className="mx-4 text-spiritual-gold text-2xl animate-pulse-soft">✦</div>
                <div className="h-px bg-gradient-to-r from-transparent via-spiritual-gold to-transparent w-64"></div>
              </div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <EmotionInput onEmotionAnalyzed={handleEmotionAnalysis} />
              {shlokaData && <ShlokaDisplay shloka={shlokaData} emotion={emotionData} />}
            </div>
          </div>
        )}
        
        {currentView === 'chat' && <ChatInterface />}
        {currentView === 'dashboard' && <Dashboard userStats={userStats} />}
        {currentView === 'journey' && <UserJourney userSessions={userSessions} userStats={userStats} />}
      </main>
      </div>
    </div>
  );
}

export default App;