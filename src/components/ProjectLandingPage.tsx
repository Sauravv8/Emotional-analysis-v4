import React from 'react';

interface ProjectLandingPageProps {
  onStart?: () => void;
}

const ProjectLandingPage: React.FC<ProjectLandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8">
            Discover Emotional Wisdom from the Bhagavad Gita
          </h1>
          <p className="text-xl mb-12">
            An AI-powered journey through ancient wisdom to help you understand and manage your emotions better.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              onClick={() => onStart && onStart()}
            >
              Start Your Journey
            </button>
            <button 
              className="border-2 border-purple-400 hover:border-purple-300 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              onClick={() => onStart && onStart()}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-opacity-10 bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Emotional Analysis"
              description="Advanced AI that understands your emotional state and provides relevant guidance from the Gita."
              icon="🔮"
            />
            <FeatureCard
              title="Ancient Wisdom"
              description="Access timeless teachings from the Bhagavad Gita, contextualized for modern life."
              icon="📚"
            />
            <FeatureCard
              title="Personal Growth"
              description="Track your emotional journey and gain insights for personal development."
              icon="🌱"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard
            number={1}
            title="Share Your Feelings"
            description="Express your current emotional state or situation"
          />
          <StepCard
            number={2}
            title="AI Analysis"
            description="Our AI analyzes your emotions and context"
          />
          <StepCard
            number={3}
            title="Gita's Wisdom"
            description="Receive relevant verses and teachings from the Bhagavad Gita"
          />
          <StepCard
            number={4}
            title="Practical Guidance"
            description="Get actionable advice for emotional well-being"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-opacity-10 bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Begin Your Journey to Emotional Wisdom
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of seekers who have found clarity and peace through the timeless wisdom of the Bhagavad Gita.
          </p>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            onClick={() => onStart && onStart()}
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="p-6 rounded-lg bg-white bg-opacity-5 backdrop-blur-lg hover:bg-opacity-10 transition duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  return (
    <div className="text-center p-6">
      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default ProjectLandingPage;