import React from 'react';

interface ProjectLandingPageProps {
  onStart?: () => void;
}

const ProjectLandingPage: React.FC<ProjectLandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float-slow top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float-slow-reverse top-40 -right-20"></div>
        <div className="absolute w-[800px] h-[800px] border border-purple-500/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-very-slow"></div>
        <div className="absolute w-[600px] h-[600px] border border-indigo-500/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Om Symbol */}
          <div className="text-6xl mb-8 animate-float-gentle opacity-80">
            <span className="bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent">
              ॐ
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-8 animate-fade-in-up">
            <span className="bg-gradient-to-r from-amber-200 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Discover Emotional Wisdom
            </span>
            <br />
            <span className="text-4xl md:text-5xl mt-2 block">
              from the Bhagavad Gita
            </span>
          </h1>

          <p className="text-xl mb-12 text-gray-300 animate-fade-in-up animation-delay-200">
            An AI-powered journey through ancient wisdom to help you 
            <span className="text-amber-300"> understand</span> and
            <span className="text-purple-300"> manage</span> your emotions better.
          </p>

          <div className="flex justify-center gap-4 animate-fade-in-up animation-delay-400">
            <button 
              className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
              onClick={() => onStart && onStart()}
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-purple-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            <button 
              className="group border-2 border-purple-400/50 hover:border-purple-300 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
              onClick={() => onStart && onStart()}
            >
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>

          {/* Decorative Line */}
          <div className="mt-16 flex items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400/50"></div>
            <div className="text-purple-400/80">✧</div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400/50"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-purple-900/50 backdrop-blur-sm"></div>
        <div className="absolute w-full h-full">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent animate-fade-in-up">
              Enlightened Features
            </h2>
            <div className="flex items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/50"></div>
              <span className="text-purple-400">✧</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-400/50"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="AI-Powered Emotional Analysis"
              description="Experience advanced emotional recognition that understands your state of mind and connects you with relevant Gita wisdom."
              icon="�️"
              delay={0}
            />
            <FeatureCard
              title="Timeless Sacred Wisdom"
              description="Access the profound teachings of the Bhagavad Gita, thoughtfully interpreted for your modern life challenges."
              icon="�"
              delay={200}
            />
            <FeatureCard
              title="Personal Transformation"
              description="Embark on a guided journey of self-discovery, tracking your emotional growth and spiritual progress."
              icon="✨"
              delay={400}
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 bg-mandala-pattern opacity-5"></div>
        
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent animate-fade-in-up">
            Your Journey to Inner Peace
          </h2>
          <div className="flex items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/50"></div>
            <span className="text-purple-400">✧</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-400/50"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
          
          <StepCard
            number={1}
            title="Share Your Heart"
            description="Express your emotions and inner thoughts in a safe, sacred space"
            delay={0}
          />
          <StepCard
            number={2}
            title="Divine Analysis"
            description="Our AI interprets your emotional state through the lens of ancient wisdom"
            delay={200}
          />
          <StepCard
            number={3}
            title="Gita's Light"
            description="Receive personalized verses and teachings that resonate with your journey"
            delay={400}
          />
          <StepCard
            number={4}
            title="Sacred Guidance"
            description="Transform wisdom into practical steps for emotional mastery"
            delay={600}
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-indigo-950/50 backdrop-blur-sm"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] border border-purple-500/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-very-slow"></div>
          <div className="absolute w-[400px] h-[400px] border border-indigo-500/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow-reverse"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Begin Your Spiritual Journey
              </span>
            </h2>
            
            <p className="text-xl mb-10 text-gray-300 leading-relaxed animate-fade-in-up animation-delay-200">
              Join thousands of seekers who have discovered inner peace and emotional mastery through the timeless wisdom of the Bhagavad Gita.
            </p>

            <div className="animate-fade-in-up animation-delay-400">
              <button 
                className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl relative overflow-hidden"
                onClick={() => onStart && onStart()}
              >
                <span className="relative z-10">Begin Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-purple-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>

              {/* Decorative Elements */}
              <div className="mt-12 flex items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400/30"></div>
                <span className="text-purple-400/80">✧</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <div 
      className={`group p-8 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 hover:border-purple-500/30 transition-all duration-500 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
        <span className="bg-gradient-to-r from-amber-200 to-purple-300 bg-clip-text text-transparent">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-purple-50 group-hover:text-purple-200 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description, delay = 0 }) => {
  return (
    <div 
      className="group text-center p-8 animate-fade-in-up relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
          <span className="text-xl font-bold text-white">{number}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-purple-50 group-hover:text-purple-200 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {description}
      </p>
      
      {/* Decorative Elements */}
      <div className="absolute -z-10 w-full h-full top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default ProjectLandingPage;