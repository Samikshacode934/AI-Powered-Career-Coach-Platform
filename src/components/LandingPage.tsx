import React from 'react';
import { Mic, Video, Award, Crown, MessageCircle, BookOpen, TrendingUp, Play, CheckCircle, Star } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Voice Mentoring',
      description: 'Natural conversations with AI mentors powered by advanced voice technology',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Video,
      title: 'Personalized Video Responses',
      description: 'Get custom video advice from industry experts on your specific challenges',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Blockchain Credentials',
      description: 'Earn verifiable skill badges and NFTs stored securely on the blockchain',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Crown,
      title: 'Premium Mentorship',
      description: 'Access exclusive 1:1 AI sessions and premium content libraries',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'Pocket Mentor helped me negotiate a 40% salary increase. The AI guidance was spot-on!',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager at Microsoft',
      content: 'The blockchain credentials opened doors I never thought possible. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'UX Designer at Apple',
      content: 'The personalized video responses feel like having a real mentor. Game-changing platform!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Career Coach
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Get personalized career guidance through conversational AI, earn blockchain-verified credentials, 
              and unlock your professional potential with premium mentorship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onLogin}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
              </button>
              <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Revolutionary Career Mentoring
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Combining cutting-edge AI technology with blockchain verification to deliver 
              the most advanced career coaching platform ever created.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of professionals who've transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-blue-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Join the future of professional development with AI-powered mentoring
          </p>
          <button
            onClick={onLogin}
            className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;