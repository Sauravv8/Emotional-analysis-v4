/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        spiritual: {
          // Deep Ocean Blues
          deep: '#0B1426',
          navy: '#1E293B',
          slate: '#334155',
          
          // Golden Divine
          gold: '#F59E0B',
          amber: '#D97706',
          yellow: '#EAB308',
          
          // Sacred Greens
          sage: '#059669',
          emerald: '#10B981',
          forest: '#065F46',
          
          // Mystical Purples
          purple: '#7C3AED',
          violet: '#8B5CF6',
          indigo: '#6366F1',
          
          // Divine Whites
          light: '#F8FAFC',
          pearl: '#E2E8F0',
          silver: '#CBD5E1',
          
          // Sacred Oranges
          orange: '#EA580C',
          coral: '#F97316',
          sunset: '#FB923C',
          
          // Lotus Pink
          rose: '#E11D48',
          pink: '#EC4899',
          cherry: '#BE185D'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Crimson Text', 'Georgia', 'serif'],
        'sanskrit': ['Noto Sans Devanagari', 'serif'],
        'display': ['Playfair Display', 'serif']
      },
      backgroundImage: {
        'spiritual-gradient': 'linear-gradient(135deg, #0B1426 0%, #1E293B 25%, #059669 50%, #F59E0B 75%, #EA580C 100%)',
        'divine-radial': 'radial-gradient(circle at center, rgba(245, 158, 11, 0.2) 0%, rgba(5, 150, 105, 0.15) 50%, rgba(11, 20, 38, 0.95) 100%)',
        'ocean-waves': 'linear-gradient(45deg, #0B1426 0%, #1E293B 50%, #334155 100%)',
        'golden-sunrise': 'linear-gradient(to right, #F59E0B, #D97706, #EA580C)',
        'sage-mist': 'linear-gradient(to bottom, #059669, #10B981, #065F46)',
        'lotus-bloom': 'radial-gradient(ellipse at center, #EC4899 0%, #E11D48 50%, #BE185D 100%)',
        'mandala-pattern': "url('data:image/svg+xml,%3Csvg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23F59E0B\" fill-opacity=\"0.08\"%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"6\"/%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"16\"/%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"26\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'sacred-geometry': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23059669\" fill-opacity=\"0.06\"%3E%3Cpath d=\"M30 0l25.98 15v30L30 60 4.02 45V15z\"/%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.7s ease-out',
        'slide-down': 'slideDown 0.7s ease-out',
        'slide-left': 'slideLeft 0.7s ease-out',
        'slide-right': 'slideRight 0.7s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 3s infinite',
        'glow-divine': 'glowDivine 2s ease-in-out infinite alternate',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 25s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'lotus-spin': 'lotusSpin 20s linear infinite',
        'sacred-pulse': 'sacredPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        glowDivine: {
          '0%': { 
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(5, 150, 105, 0.2)',
            filter: 'brightness(1)'
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(5, 150, 105, 0.4)',
            filter: 'brightness(1.1)'
          },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.1)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        lotusSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        sacredPulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)'
          },
          '50%': { 
            transform: 'scale(1.02)',
            boxShadow: '0 0 0 10px rgba(245, 158, 11, 0)'
          },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};