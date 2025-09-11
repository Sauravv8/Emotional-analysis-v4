import React, { useState, useRef, useEffect } from 'react';
import { Mic, Type, Camera, Send, Loader, Video, Square, Play } from 'lucide-react';

// This is a mock for the props, assuming it's defined in your App.js
// You can replace this with your actual EmotionData type
export interface EmotionData {
  emotion: string;
  confidence: number;
  timestamp: Date;
  inputText: string;
}

interface EmotionInputProps {
  onEmotionAnalyzed: (emotion: EmotionData) => void;
}

// Helper component to define styles that can't be done with Tailwind alone
const CustomStyles = () => (
  <style>{`
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .bg-mandala-pattern {
      background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 1.5rem 1.5rem;
    }
  `}</style>
);


export const EmotionInput: React.FC<EmotionInputProps> = ({ onEmotionAnalyzed }) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'video'>('text');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<string>('');
  const [realTimeConfidence, setRealTimeConfidence] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Facial emotion detection using camera
  const startVideoAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsVideoActive(true);
        
        // Start real-time emotion detection
        intervalRef.current = setInterval(() => {
          analyzeVideoFrame();
        }, 2000); // Analyze every 2 seconds
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Use a more user-friendly modal/toast in a real app
      // alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopVideoAnalysis = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsVideoActive(false);
    setDetectedEmotion('');
    setRealTimeConfidence(0);
  };

  const analyzeVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Simulate facial emotion detection
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.6 + Math.random() * 0.3; 
    
    setDetectedEmotion(randomEmotion);
    setRealTimeConfidence(confidence);
    
    if (confidence > 0.85) { // Auto-submit on high confidence
      setTimeout(() => {
        onEmotionAnalyzed({
          emotion: randomEmotion,
          confidence: confidence,
          timestamp: new Date(),
          inputText: `Facial expression analysis detected: ${randomEmotion}`
        });
      }, 1000);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && inputMode === 'text') return;
    
    setIsAnalyzing(true);
    
    // Fallback to local analysis since backend is not available
    // In a real app, the try-catch block for the fetch would be here.
    setTimeout(() => { // Simulate network delay
        const emotion = analyzeEmotionLocally(inputText);
        onEmotionAnalyzed({
            emotion: emotion.emotion,
            confidence: emotion.confidence,
            timestamp: new Date(),
            inputText
        });
        setIsAnalyzing(false);
        setInputText(''); // Clear input after analysis
    }, 1500);
  };

  const analyzeEmotionLocally = (text: string) => {
    // Merged and de-duplicated emotion keywords
    const emotionKeywords = {
        joy: ['happy', 'joyful', 'excited', 'wonderful', 'great', 'amazing', 'fantastic', 'blessed', 'grateful', 'love', 'beautiful', 'perfect', 'awesome', 'brilliant', 'cheerful', 'smiling', 'ecstatic', 'overjoyed', 'thrilled', 'blissful', 'content', 'peaceful', 'sunny', 'delighted', 'elated', 'jubilant', 'glad', 'radiant', 'laughing', 'sparkling', 'heavenly', 'amused', 'proud', 'hopeful', 'lighthearted', 'carefree', 'inspired', 'on cloud nine', 'over the moon'],
        sadness: ['sad', 'depressed', 'down', 'unhappy', 'grief', 'sorrow', 'heartbroken', 'lonely', 'cry', 'tears', 'hurt', 'pain', 'loss', 'miss', 'miserable', 'gloomy', 'blue', 'melancholy', 'despair', 'hopeless', 'dejected', 'weary', 'drained', 'empty', 'downhearted', 'unloved', 'abandoned', 'helpless', 'worthless', 'shattered', 'aching heart', 'broken', 'wounded', 'regret', 'mourning', 'heavy-hearted', 'mournful', 'sorrowful', 'tearful', 'crying'],
        anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'overwhelmed', 'restless', 'tense', 'afraid', 'scared', 'concern', 'trouble', 'uneasy', 'unsettled', 'jitters', 'overthinking', 'insecure', 'dread', 'apprehensive', 'shaky', 'on edge', 'fidgety', 'fear of failure', 'sleepless', 'trembling', 'tight chest', 'can’t breathe', 'butterflies in stomach', 'mental pressure', 'paranoid', 'distressed', 'panicky'],
        anger: ['angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 'hate', 'disgusted', 'outraged', 'livid', 'bitter', 'resentful', 'cross', 'infuriated', 'offended', 'provoked', 'burning', 'boiling', 'fed up', 'grumpy', 'hostile', 'enraged', 'pissed', 'snappy', 'agitated', 'storming', 'seeing red', 'short-tempered', 'irate', 'wrathful', 'fuming', 'angst', 'indignant', 'pissed off', 'heated', 'sore'],
        fear: ['afraid', 'scared', 'terrified', 'frightened', 'worry', 'fearful', 'panic', 'nervous', 'anxious', 'startled', 'alarmed', 'horrified', 'shaken', 'uneasy', 'timid', 'in dread', 'spooked', 'creeped out', 'on edge', 'paralyzed', 'goosebumps', 'shivers', 'worst nightmare', 'scary', 'phobia', 'worried sick', 'fear of unknown', 'gut-wrenching', 'intimidated', 'weak-kneed', 'losing control'],
        disgust: ['disgusted', 'grossed out', 'repulsed', 'nauseated', 'sickened', 'yuck', 'ugh', 'vile', 'horrible taste', 'revolted', 'appalled', 'distasteful', 'dirty feeling', 'gross', 'offended by smell/taste/behavior'],
        guilt: ['guilty', 'remorse', 'regret', 'apologetic', 'ashamed', 'sorry', 'blame myself', 'fault', 'wrongdoing', 'misdeed', 'self-reproach', 'contrite', 'sinful', 'in the wrong', 'remorseful', 'sorrow for wrongdoing', 'penitent', 'repentant'],
        shame: ['ashamed', 'embarrassed', 'humiliated', 'mortified', 'self-conscious', 'awkward', 'looked down on', 'insecure', 'cringe', 'loss of face', 'shy', 'red-faced', 'lost face', 'disgraced', 'deep shame', 'want to hide'],
        boredom: ['bored', 'uninterested', 'restless', 'dull', 'tedious', 'meh', 'not engaged', 'yawn', 'lazy', 'sleepy', 'apathetic', 'monotonous', 'time dragging', 'lifeless', 'tired of this', 'fed up', 'already seen this', 'checked out', 'listless', 'disengaged'],
        confusion: ['confused', 'lost', 'uncertain', 'unclear', 'puzzled', 'bewildered', "don't know", 'unsure', 'doubt', 'question', 'mixed up', 'disoriented', 'stuck', 'hesitant', 'undecided', 'foggy', 'blurred', 'perplexed', 'no idea', 'at sea', 'blank mind', 'unfocused', 'baffled', 'clueless', 'scratching head', 'misunderstood', 'unsolved', 'torn', 'iffy', 'hazy'],
        gratitude: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude', 'thank you', 'fortunate', 'lucky', 'indebted', 'much obliged', 'obliged', 'praise', 'cherish', 'valued', 'recognized', 'thank God', 'so kind', 'graceful', 'warm-hearted', 'full of thanks', 'overjoyed with kindness', 'thank heavens', 'grateful beyond words'],
        love: ['love', 'adore', 'cherish', 'fond', 'infatuated', 'passionate', 'caring', 'affectionate', 'devoted', 'romantic', 'heartfelt', 'admire', 'darling', 'sweetheart', 'beloved', 'deeply care', 'falling for', 'smitten', 'head over heels', 'treasure', 'endearment', 'flirt', 'crush', 'sweet', 'special one', 'my love'],
        surprise: ['surprised', 'shocked', 'stunned', 'amazed', 'astonished', 'startled', 'wow', 'gasp', 'oh my', 'unexpected', 'speechless', 'mind blown', 'flabbergasted', 'whoa', 'taken aback', 'jaw drop', 'in awe', 'did not expect', 'unbelievable', 'out of the blue'],
        hope: ['hopeful', 'optimistic', 'confident', 'faith', 'looking forward', 'anticipating', 'positive', 'bright future', 'expecting good', 'trust', 'dreaming', 'aspiring', 'uplifted', 'inspired', 'glass half full'],
        pride: ['proud', 'accomplished', 'successful', 'confident', 'victorious', 'triumphant', 'achieved', 'dignity', 'self-respect', 'glory', 'fulfilled', 'honored', 'respected', 'admired'],
        motivation: ['motivated', 'driven', 'inspired', 'determined', 'pumped', 'energetic', 'ready to go', 'on fire', 'goal-oriented', 'ambitious', 'focused', 'committed', 'unstoppable', 'disciplined'],
        relief: ['relieved', 'safe now', 'finally', 'phew', 'thank goodness', 'free from stress', 'calm now', 'released', 'breathing easy', 'at ease', 'peaceful', 'glad it’s over'],
        enthusiasm: ['enthusiastic', 'eager', 'keen', 'stoked', 'amped', 'raring to go', 'excited for this', 'hyped', 'all in', 'high-energy'],
        neutral: ['neutral', 'okay', 'fine', 'so-so', 'meh', 'indifferent', 'nothing special', 'even-keeled', 'ordinary', 'baseline']
    };

    const textLower = text.toLowerCase();
    let maxScore = 0;
    let detectedEmotion = 'neutral'; // Default to neutral if no keywords match
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g'); // Use word boundaries
        const matches = (textLower.match(regex) || []).length;
        return acc + matches;
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    }
    
    if (maxScore === 0) {
        detectedEmotion = 'confusion';
    }

    const textLength = text.split(' ').length;
    const baseConfidence = Math.min(0.95, 0.4 + (maxScore * 0.2));
    const lengthBonus = Math.min(0.3, textLength * 0.02);
    const confidence = Math.min(0.95, baseConfidence + lengthBonus);
    
    return { emotion: detectedEmotion, confidence };
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          setInputText("Voice recording completed. Speech-to-text analysis would process this audio for emotional content and convert speech to text for analysis.");
          stream.getTracks().forEach(track => track.stop());
        };
        
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        setMediaRecorder(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopVideoAnalysis();
    };
  }, []);

  return (
    <div className="relative group animate-slide-up">
      <CustomStyles />
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-indigo-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-900/30 to-gray-900/50 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500">
        <div className="absolute inset-0 bg-mandala-pattern opacity-10 rounded-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-purple-300 text-2xl">🧘‍♀️</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent text-center">
                Express Your Emotions
              </h2>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-pink-300 text-2xl">✨</span>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed text-center text-lg font-medium">
              Share the depths of your heart and soul. Let AI analyze your emotions through text, voice, or facial expressions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-8 p-2 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl backdrop-blur-sm border border-white/20">
            {[
              { mode: 'text' as const, icon: Type, label: 'Text', color: 'from-blue-500 to-purple-500' },
              { mode: 'voice' as const, icon: Mic, label: 'Voice', color: 'from-purple-500 to-pink-500' },
              { mode: 'video' as const, icon: Camera, label: 'Video', color: 'from-pink-500 to-red-500' },
            ].map(({ mode, icon: Icon, label, color }) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`flex-1 flex items-center justify-center space-x-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl transition-all duration-500 relative overflow-hidden ${
                  inputMode === mode
                    ? `bg-gradient-to-r ${color} text-white shadow-2xl scale-105`
                    : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-102'
                }`}
              >
                {inputMode === mode && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${color} animate-pulse`}></div>
                )}
                <div className="relative z-10 flex items-center space-x-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-md sm:text-lg">{label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {inputMode === 'text' && (
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pour your heart out... How are you feeling today?"
                  className="relative w-full h-48 px-6 py-4 bg-black/20 border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/50 resize-none backdrop-blur-sm transition-all duration-500 text-lg leading-relaxed font-medium"
                  maxLength={1000}
                />
                <div className="absolute bottom-4 right-4 text-white/50 text-sm font-medium">
                  {inputText.length}/1000
                </div>
              </div>
            )}

            {inputMode === 'voice' && (
              <div className="text-center py-10 sm:py-20 relative bg-black/10 rounded-2xl border border-white/10">
                <div className="relative z-10">
                  <button
                    onClick={handleVoiceRecord}
                    className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 mx-auto mb-8 ${
                      isRecording
                        ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse shadow-2xl scale-110'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {!isRecording && (
                      <div className="absolute -inset-4 bg-purple-500/30 rounded-full animate-ping"></div>
                    )}
                    <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </button>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {isRecording ? '🎙️ Listening...' : '🎵 Speak from your heart'}
                  </h3>
                  <p className="text-white/70 text-lg font-medium">
                    {isRecording ? 'Click to stop recording' : 'Your voice carries your emotions'}
                  </p>
                </div>
              </div>
            )}

            {inputMode === 'video' && (
              <div className="text-center py-8 relative bg-black/10 rounded-2xl border border-white/10">
                <div className="relative z-10">
                  {!isVideoActive ? (
                    <div>
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                        <Camera className="w-10 h-10 text-pink-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Soul Vision Analysis</h3>
                      <p className="text-white/70 mb-6 max-w-md mx-auto leading-relaxed">
                        Let AI read the emotions in your expressions.
                      </p>
                      <button
                        onClick={startVideoAnalysis}
                        className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        <Play className="w-6 h-6 inline mr-2" />
                        Start Reading
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative inline-block mx-auto">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          className="w-full max-w-sm h-auto rounded-2xl border-4 border-pink-500/50 shadow-2xl"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        {detectedEmotion && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                            <p className="text-white font-bold text-lg capitalize">{detectedEmotion}</p>
                            <p className="text-white/80 text-sm">{Math.round(realTimeConfidence * 100)}% confidence</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">🔮 Real-time Detection Active</h3>
                        <p className="text-white/70">AI is analyzing your facial expressions.</p>
                        <button
                          onClick={stopVideoAnalysis}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl"
                        >
                          <Square className="w-5 h-5 inline mr-2" />
                          Stop Analysis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="relative group pt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (inputMode === 'text' && !inputText.trim())}
                className="relative w-full flex items-center justify-center space-x-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 text-xl shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-8 h-8 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-7 h-7" />
                    <span>Analyze Emotions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This would be your main App component
const App = () => {
    const [emotions, setEmotions] = useState<EmotionData[]>([]);

    const handleNewEmotion = (emotionData: EmotionData) => {
        console.log("New emotion analyzed:", emotionData);
        setEmotions(prev => [emotionData, ...prev]);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-2xl">
                <EmotionInput onEmotionAnalyzed={handleNewEmotion} />
                {/* You can render the list of analyzed emotions here */}
            </div>
        </div>
    );
};

export default App;
