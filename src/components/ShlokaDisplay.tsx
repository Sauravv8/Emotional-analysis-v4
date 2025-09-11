import React from 'react';
import { BookOpen, Heart, Lightbulb, Quote } from 'lucide-react';
import { ShlokaData, EmotionData } from '../App';

interface ShlokaDisplayProps {
  shloka: ShlokaData;
  emotion: EmotionData | null;
}

export const ShlokaDisplay: React.FC<ShlokaDisplayProps> = ({ shloka, emotion }) => {
  const getEmotionColor = (emotionType: string) => {
    const colors = {
      joy: 'text-yellow-400',
      sadness: 'text-blue-400',
      anxiety: 'text-purple-400',
      anger: 'text-red-400',
      confusion: 'text-gray-400',
      gratitude: 'text-green-400',
      fear: 'text-orange-400',
    };
    return colors[emotionType as keyof typeof colors] || 'text-spiritual-light';
  };

  return (
    <div className="relative group animate-slide-left">
      {/* Divine Radiance */}
      <div className="absolute -inset-2 bg-gradient-to-r from-spiritual-gold/30 via-spiritual-accent/20 to-spiritual-sage/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
      
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-spiritual-gold/20 hover:border-spiritual-gold/40 transition-all duration-500">
        {/* Sacred Mandala Background */}
        <div className="absolute inset-0 bg-mandala-pattern opacity-20 rounded-3xl"></div>
        <div className="absolute top-4 right-4 text-4xl text-spiritual-gold/20 animate-rotate-slow">🕉️</div>
        
        <div className="relative z-10">
      {/* Emotion Analysis Result */}
      {emotion && (
        <div className="mb-8 p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-4">
            <Heart className={`w-6 h-6 ${getEmotionColor(emotion.emotion)}`} />
            <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-spiritual-light bg-clip-text text-transparent capitalize">
              Soul Reading: {emotion.emotion}
            </h3>
              <p className="text-spiritual-light/60 text-sm">Emotional resonance detected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-spiritual-light/80 text-sm font-medium">Confidence:</span>
            <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-spiritual-gold to-spiritual-amber h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${emotion.confidence * 100}%` }}
              />
            </div>
            <span className="text-spiritual-gold font-bold text-sm">
              {Math.round(emotion.confidence * 100)}% confidence
            </span>
          </div>
        </div>
      )}

      {/* Shloka Display */}
      <div className="space-y-6">
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-spiritual-gold/10 rounded-full blur-2xl animate-pulse-gentle"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-spiritual-gold to-spiritual-amber rounded-full"></div>
              <Quote className="w-10 h-10 text-spiritual-gold animate-float" />
              <div className="w-1 h-8 bg-gradient-to-b from-spiritual-gold to-spiritual-amber rounded-full"></div>
            </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-spiritual-gold via-white to-spiritual-gold bg-clip-text text-transparent mb-4">
              🌟 Divine Revelation 🌟
            </h2>
            <div className="flex items-center justify-center space-x-2 text-spiritual-light/80">
              <span className="text-spiritual-gold">📖</span>
              <p className="font-medium">श्रीमद्भगवद्गीता • अध्याय {shloka.chapter} • श्लोक {shloka.verse}</p>
              <span className="text-spiritual-gold">📖</span>
            </div>
          </div>
        </div>

        {/* Sanskrit Text */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-spiritual-gold/20 to-spiritual-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-spiritual-gold/30 backdrop-blur-sm">
            <div className="text-center mb-4">
              <span className="text-spiritual-gold text-sm font-medium tracking-wider uppercase">पवित्र संस्कृत श्लोक</span>
            </div>
          <p className="text-3xl font-sanskrit text-spiritual-gold text-center leading-relaxed animate-fade-in">
            {shloka.sanskrit}
          </p>
            <div className="text-center mt-4">
              <span className="text-spiritual-light/60 text-sm font-medium">
                (भगवद्गीता: अध्याय {shloka.chapter}, श्लोक {shloka.verse})
              </span>
            </div>
            <div className="flex justify-center mt-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-spiritual-gold to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Translation */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-spiritual-sage/20 to-spiritual-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-spiritual-sage/30 to-spiritual-accent/30 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-spiritual-sage" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-spiritual-sage bg-clip-text text-transparent">
              दिव्य अनुवाद (Divine Translation)
            </h3>
          </div>
          <p className="text-spiritual-light/90 leading-relaxed text-lg italic font-serif">
            "{shloka.translation}"
          </p>
          <div className="mt-4 text-right">
            <span className="text-spiritual-light/50 text-sm">
              - श्रीमद्भगवद्गीता {shloka.chapter}.{shloka.verse}
            </span>
          </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-spiritual-accent/20 to-spiritual-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-spiritual-accent/30 to-spiritual-purple/30 rounded-full flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-spiritual-accent" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-spiritual-accent bg-clip-text text-transparent">
              आध्यात्मिक समझ (Spiritual Understanding)
            </h3>
          </div>
          <p className="text-spiritual-light/90 leading-relaxed text-lg">
            {shloka.explanation}
          </p>
          </div>
        </div>

        {/* Practical Advice */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-spiritual-gold/40 via-spiritual-sage/30 to-spiritual-accent/40 rounded-2xl blur-lg animate-divine-glow"></div>
          <div className="relative bg-gradient-to-br from-spiritual-gold/20 via-spiritual-sage/15 to-spiritual-accent/20 rounded-2xl p-8 border-2 border-spiritual-gold/40 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-spiritual-gold/40 to-spiritual-sage/40 rounded-full flex items-center justify-center animate-pulse-gentle">
            <Heart className="w-5 h-5 text-spiritual-gold" />
            </div>
            <div>
            <h3 className="text-xl font-bold text-white">✨ आत्मा के लिए पवित्र मार्गदर्शन ✨</h3>
              <p className="text-spiritual-gold/80 text-sm">आपकी यात्रा के लिए व्यक्तिगत ज्ञान</p>
            </div>
          </div>
          <p className="text-white leading-relaxed font-medium text-lg bg-white/5 rounded-xl p-4 border border-white/10">
            {shloka.practicalAdvice}
          </p>
          
          {/* Call to Action */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <span className="text-spiritual-gold text-sm">🙏</span>
              <span className="text-spiritual-light text-sm font-medium">इस ज्ञान को अपने दैनिक अभ्यास में अपनाएं</span>
              <span className="text-spiritual-gold text-sm">🙏</span>
            </div>
          </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};