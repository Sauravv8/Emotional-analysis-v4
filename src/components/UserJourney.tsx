import React, { useState } from 'react';
import { Calendar, TrendingUp, Heart, BookOpen, Filter } from 'lucide-react';
import { UserSession, UserStats } from '../App';

interface UserJourneyProps {
  userSessions: UserSession[];
  userStats: UserStats;
}

export const UserJourney: React.FC<UserJourneyProps> = ({ userSessions, userStats }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Filter sessions based on timeframe
  const getFilteredSessions = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedTimeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return userSessions.filter(session => new Date(session.timestamp) >= cutoffDate);
  };

  const filteredSessions = getFilteredSessions();
  
  // Calculate growth trend
  const calculateGrowthTrend = () => {
    if (filteredSessions.length < 2) return 0;
    
    const recent = filteredSessions.slice(0, Math.ceil(filteredSessions.length / 2));
    const older = filteredSessions.slice(Math.ceil(filteredSessions.length / 2));
    
    const recentPositive = recent.filter(s => ['joy', 'gratitude', 'love', 'hope'].includes(s.emotion)).length;
    const olderPositive = older.filter(s => ['joy', 'gratitude', 'love', 'hope'].includes(s.emotion)).length;
    
    const recentRatio = recent.length > 0 ? recentPositive / recent.length : 0;
    const olderRatio = older.length > 0 ? olderPositive / older.length : 0;
    
    return Math.round((recentRatio - olderRatio) * 100);
  };

  const growthTrend = calculateGrowthTrend();
  
  // Get dominant emotion
  const getDominantEmotion = () => {
    if (Object.keys(userStats.emotionDistribution).length === 0) return 'Balanced';
    
    return Object.entries(userStats.emotionDistribution)
      .sort(([,a], [,b]) => b - a)[0][0];
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'bg-yellow-400',
      sadness: 'bg-blue-400',
      anxiety: 'bg-purple-400',
      anger: 'bg-red-400',
      confusion: 'bg-gray-400',
      gratitude: 'bg-green-400',
      fear: 'bg-orange-400',
      love: 'bg-pink-400',
      hope: 'bg-indigo-400',
    };
    return colors[emotion as keyof typeof colors] || 'bg-spiritual-light';
  };

  const getShlokaPreview = (chapter: number, verse: number) => {
    const shlokaMap: Record<string, string> = {
      '2.47': 'You have the right to perform your actions...',
      '2.48': 'Perform your duty equipoised...',
      '2.12': 'Never was there a time when I did not exist...',
      '18.66': 'Abandon all varieties of dharma and surrender unto Me...',
      '2.63': 'From anger comes delusion...',
      '6.29': 'A true yogi observes Me in all beings...',
    };
    
    return shlokaMap[`${chapter}.${verse}`] || 'Divine wisdom from the Bhagavad Gita';
  };
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Spiritual Journey</h1>
          <p className="text-spiritual-light">Track your emotional growth and spiritual insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-spiritual-light" />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-spiritual-gold"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-spiritual-sage" />
            <h3 className="text-lg font-semibold text-white">Growth Trend</h3>
          </div>
          <div className={`text-3xl font-bold mb-2 ${growthTrend >= 0 ? 'text-spiritual-sage' : 'text-red-400'}`}>
            {growthTrend >= 0 ? '+' : ''}{growthTrend}%
          </div>
          <p className="text-spiritual-light text-sm">Emotional balance improvement</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Dominant Emotion</h3>
          </div>
          <div className="text-2xl font-bold text-pink-400 mb-2 capitalize">{getDominantEmotion()}</div>
          <p className="text-spiritual-light text-sm">Most frequent this month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-8 h-8 text-spiritual-gold" />
            <h3 className="text-lg font-semibold text-white">Insights Gained</h3>
          </div>
          <div className="text-3xl font-bold text-spiritual-gold mb-2">{userStats.totalSessions}</div>
          <p className="text-spiritual-light text-sm">Shlokas studied</p>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Journey Entries</h2>
        
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Begin Your Spiritual Journey</h3>
            <p className="text-spiritual-light">Start analyzing your emotions to see your journey unfold here</p>
          </div>
        ) : (
        <div className="space-y-6">
          {filteredSessions.slice(0, 10).map((session, index) => (
            <div key={session.id} className="relative">
              {/* Timeline line */}
              {index < Math.min(filteredSessions.length - 1, 9) && (
                <div className="absolute left-6 top-12 w-0.5 h-24 bg-white/20"></div>
              )}
              
              <div className="flex space-x-6">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getEmotionColor(session.emotion)}`}></div>
                  <div className="mt-2 text-xs text-spiritual-light">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Entry content */}
                <div className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getEmotionColor(session.emotion)}`}>
                        {session.emotion}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-4 h-4 rounded-full ${
                              star <= (session.confidence * 10) / 2
                                ? 'bg-spiritual-gold'
                                : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-spiritual-light">
                        {Math.round(session.confidence * 100)}% confidence
                      </span>
                    </div>
                    <Calendar className="w-5 h-5 text-spiritual-light" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Guiding Shloka</h4>
                      <p className="text-spiritual-light italic">
                        {getShlokaPreview(session.shlokaChapter, session.shlokaVerse)}
                      </p>
                      <p className="text-spiritual-light/60 text-xs mt-1">
                        Bhagavad Gita {session.shlokaChapter}.{session.shlokaVerse}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-1">Your Expression</h4>
                      <p className="text-spiritual-light">
                        {session.inputText.length > 100 
                          ? session.inputText.substring(0, 100) + '...' 
                          : session.inputText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Emotional Pattern Analysis */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Emotional Patterns</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(userStats.emotionDistribution).length > 0 ? 
            Object.entries(userStats.emotionDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 4)
              .map(([emotion, count]) => {
                const percentage = Math.round((count / userStats.totalSessions) * 100);
                return (
            <div key={emotion} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-white/20"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${percentage * 1.88} 188`}
                    className="text-spiritual-gold"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{percentage}%</span>
                </div>
              </div>
              <p className="text-spiritual-light capitalize text-sm">{emotion}</p>
              <p className="text-spiritual-light/60 text-xs">{count} times</p>
            </div>
                );
              }) : 
            <div className="col-span-4 text-center py-8">
              <p className="text-spiritual-light">Start your journey to see emotional patterns</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};