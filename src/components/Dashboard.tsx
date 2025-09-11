import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Target, BookOpen, Heart, TrendingUp, CheckCircle, Star, Gift } from 'lucide-react';
import { UserStats } from '../App';

interface DashboardProps {
  userStats: UserStats;
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'spiritual' | 'emotional' | 'physical' | 'mental';
  icon: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userStats }) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [completedTasksToday, setCompletedTasksToday] = useState<string[]>([]);

  // Generate daily tasks based on the day
  const generateDailyTasks = (): DailyTask[] => {
    const today = new Date().getDay();
    const allTasks = [
      // Spiritual Tasks
      { id: 'read-shloka', title: 'Read a Sacred Shloka', description: 'Study one verse from Bhagavad Gita', points: 15, category: 'spiritual' as const, icon: '📖' },
      { id: 'meditation', title: 'Divine Meditation', description: 'Meditate for 10 minutes', points: 25, category: 'spiritual' as const, icon: '🧘‍♀️' },
      { id: 'gratitude', title: 'Practice Gratitude', description: 'Write 3 things you\'re grateful for', points: 10, category: 'spiritual' as const, icon: '🙏' },
      { id: 'mantra', title: 'Chant Sacred Mantras', description: 'Recite Om or Gayatri Mantra', points: 20, category: 'spiritual' as const, icon: '🕉️' },
      
      // Emotional Tasks
      { id: 'emotion-check', title: 'Emotional Check-in', description: 'Analyze your current emotional state', points: 15, category: 'emotional' as const, icon: '💭' },
      { id: 'forgiveness', title: 'Practice Forgiveness', description: 'Forgive someone or yourself', points: 30, category: 'emotional' as const, icon: '💖' },
      { id: 'compassion', title: 'Show Compassion', description: 'Help someone in need', points: 25, category: 'emotional' as const, icon: '🤝' },
      
      // Physical Tasks
      { id: 'yoga', title: 'Sacred Yoga Practice', description: 'Do 15 minutes of yoga', points: 20, category: 'physical' as const, icon: '🧘‍♂️' },
      { id: 'nature-walk', title: 'Connect with Nature', description: 'Spend 20 minutes in nature', points: 15, category: 'physical' as const, icon: '🌿' },
      
      // Mental Tasks
      { id: 'study-wisdom', title: 'Study Ancient Wisdom', description: 'Read spiritual or philosophical text', points: 20, category: 'mental' as const, icon: '📚' },
      { id: 'self-reflection', title: 'Self-Reflection', description: 'Journal about your spiritual journey', points: 15, category: 'mental' as const, icon: '✍️' },
    ];

    // Select 5 tasks for today based on day of week
    const tasksForToday = [];
    const startIndex = today * 2;
    
    // Always include emotion check and one spiritual task
    tasksForToday.push(allTasks.find(t => t.id === 'emotion-check')!);
    tasksForToday.push(allTasks.find(t => t.id === 'read-shloka')!);
    
    // Add 3 more tasks based on the day
    for (let i = 0; i < 3; i++) {
      const taskIndex = (startIndex + i) % allTasks.length;
      if (!tasksForToday.find(t => t.id === allTasks[taskIndex].id)) {
        tasksForToday.push(allTasks[taskIndex]);
      }
    }

    return tasksForToday.slice(0, 5).map(task => ({
      ...task,
      completed: completedTasksToday.includes(task.id)
    }));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasksToday(prev => {
      const newCompleted = prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
      
      // Save to localStorage
      localStorage.setItem('completedTasksToday', JSON.stringify(newCompleted));
      return newCompleted;
    });
  };

  useEffect(() => {
    // Load completed tasks from localStorage
    const saved = localStorage.getItem('completedTasksToday');
    if (saved) {
      setCompletedTasksToday(JSON.parse(saved));
    }
    
    // Generate tasks for today
    setDailyTasks(generateDailyTasks());
  }, [completedTasksToday]);

  const achievements = [
    { id: 1, title: 'Wisdom Seeker', description: 'Complete 10 emotion analyses', icon: BookOpen, unlocked: userStats.totalSessions >= 10, progress: userStats.totalSessions, target: 10 },
    { id: 2, title: 'Emotional Master', description: 'Maintain 7-day streak', icon: Heart, unlocked: userStats.streakDays >= 7, progress: userStats.streakDays, target: 7 },
    { id: 3, title: 'Karma Warrior', description: 'Earn 500 karma points', icon: Trophy, unlocked: userStats.karmaPoints >= 500, progress: userStats.karmaPoints, target: 500 },
    { id: 4, title: 'Balanced Soul', description: 'Achieve 80% emotional balance', icon: TrendingUp, unlocked: userStats.emotionalBalance >= 80, progress: userStats.emotionalBalance, target: 80 },
  ];

  // Get top emotions for display
  const topEmotions = Object.entries(userStats.emotionDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const getCategoryColor = (category: string) => {
    const colors = {
      spiritual: 'from-purple-500 to-indigo-500',
      emotional: 'from-pink-500 to-rose-500',
      physical: 'from-green-500 to-emerald-500',
      mental: 'from-blue-500 to-cyan-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Welcome Message */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
            🕉️ Your Spiritual Dashboard 🕉️
          </h1>
          <p className="text-white/80 text-xl font-medium">Track your journey towards inner peace and divine wisdom</p>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{userStats.karmaPoints}</p>
              <p className="text-white/70 text-lg font-medium">⭐Karma Points</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{userStats.streakDays}</p>
              <p className="text-white/70 text-lg font-medium">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{userStats.emotionalBalance}%</p>
              <p className="text-white/70 text-lg font-medium">Emotional Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {completedTasksToday.length}/{dailyTasks.length}
              </p>
              <p className="text-white/70 text-lg font-medium">Daily Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Emotion Distribution */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Emotional Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topEmotions.length > 0 ? topEmotions.map(([emotion, count], index) => (
            <div key={emotion} className="text-center group">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="48"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(count / userStats.totalSessions) * 301} 301`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`text-${index === 0 ? 'purple' : index === 1 ? 'pink' : 'blue'}-400`} />
                    <stop offset="100%" className={`text-${index === 0 ? 'indigo' : index === 1 ? 'rose' : 'cyan'}-400`} />
                  </linearGradient>
                </defs>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{count}</span>
                </div>
              </div>
              <p className="text-white capitalize font-bold text-xl mb-2">{emotion}</p>
              <p className="text-white/60 text-lg">**{Math.round((count / userStats.totalSessions) * 100)}%</p>
            </div>
          )) : (
            <div className="col-span-3 text-center py-12">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <p className="text-white/70 text-xl">Start your emotional journey to see patterns here</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced Daily Tasks */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-10 border border-white/20">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Today's Spiritual Tasks</h2>
          </div>
          <div className="space-y-4">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                  task.completed
                    ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/30'
                    : 'bg-gradient-to-r from-white/5 to-white/10 border-white/20 hover:border-white/30'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 scale-110'
                            : 'border-white/30 hover:border-white/50 hover:scale-110'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-5 h-5 text-white" />}
                      </button>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{task.icon}</span>
                        <div>
                          <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-white/70' : 'text-white'}`}>
                            **{task.title}**
                          </h3>
                          <p className="text-white/60 text-sm">{task.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold text-lg bg-gradient-to-r ${getCategoryColor(task.category)} bg-clip-text text-transparent`}>
                        +{task.points} pts
                      </span>
                      <p className="text-white/50 text-xs capitalize">{task.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Daily Progress</span>
              <span className="text-white font-bold">{completedTasksToday.length}/{dailyTasks.length} completed</span>
            </div>
            <div className="mt-2 bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(completedTasksToday.length / dailyTasks.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Achievements */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-10 border border-white/20">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Achievements</h2>
          </div>
          <div className="space-y-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progress = Math.min(100, (achievement.progress / achievement.target) * 100);
              
              return (
                <div
                  key={achievement.id}
                  className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-400/30'
                      : 'bg-gradient-to-r from-white/5 to-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl mb-2 ${
                        achievement.unlocked ? 'text-white' : 'text-white/70'
                      }`}>
                        **{achievement.title}**
                      </h3>
                      <p className="text-white/60 mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Progress</span>
                          <span className="text-white font-bold">{achievement.progress}/{achievement.target}</span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              achievement.unlocked 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                : 'bg-gradient-to-r from-gray-500 to-gray-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Weekly Progress Chart */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Weekly Emotional Journey</h2>
        <div className="grid grid-cols-7 gap-6">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const height = userStats.totalSessions > 0 ? Math.min(80, (userStats.emotionalBalance / 100) * 80 + Math.random() * 20) : 20;
            const isToday = index === new Date().getDay() - 1;
            
            return (
              <div key={day} className="text-center group">
                <div className="h-32 flex items-end mb-4">
                  <div
                    className={`w-full rounded-t-2xl transition-all duration-500 group-hover:scale-105 ${
                      isToday
                        ? 'bg-gradient-to-t from-purple-600 to-pink-500 shadow-lg'
                        : 'bg-gradient-to-t from-blue-600/60 to-purple-600/60 hover:from-blue-500 hover:to-purple-500'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <p className={`text-lg font-bold ${isToday ? 'text-purple-300' : 'text-white/70'}`}>
                  {day}
                </p>
                {isToday && <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto mt-2 animate-pulse"></div>}
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <p className="text-white/60 text-lg">
            **Total Sessions: {userStats.totalSessions} | Average Confidence: {Math.round(userStats.averageConfidence * 100)}%**
          </p>
        </div>
      </div>
    </div>
  );
};