import React, { useState } from 'react';
import { Mic, Video, Award, Crown, MessageCircle, BookOpen, TrendingUp, User, Settings, LogOut, CreditCard } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import MentorChat from './components/MentorChat';
import SkillsBadges from './components/SkillsBadges';
import PremiumTiers from './components/PremiumTiers';
import CourseContent from './components/CourseContent';
import PaymentSuccess from './components/PaymentSuccess';
import SubscriptionManager from './components/SubscriptionManager';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'chat' | 'skills' | 'premium' | 'courses' | 'success' | 'billing'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState<'basic' | 'professional' | 'enterprise'>('basic');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const navigation = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard', view: 'dashboard' },
    { id: 'chat', icon: MessageCircle, label: 'AI Mentor', view: 'chat' },
    { id: 'courses', icon: BookOpen, label: 'Courses', view: 'courses' },
    { id: 'skills', icon: Award, label: 'Credentials', view: 'skills' },
    { id: 'premium', icon: Crown, label: 'Premium', view: 'premium' },
    { id: 'billing', icon: CreditCard, label: 'Billing', view: 'billing' },
  ];

  // Check URL for payment success
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const planId = urlParams.get('plan');
    
    if (sessionId && planId) {
      setCurrentView('success');
      setIsLoggedIn(true);
      // Update user plan based on successful payment
      if (planId.includes('professional')) {
        setUserPlan('professional');
      } else if (planId.includes('enterprise')) {
        setUserPlan('enterprise');
      }
    }
  }, []);

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (currentView === 'success') {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      <PaymentSuccess 
        sessionId={urlParams.get('session_id') || undefined}
        planId={urlParams.get('plan') || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pocket Mentor
            </h1>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.view as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  currentView === item.view
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.id === 'premium' && userPlan !== 'basic' && (
                  <Crown className="w-4 h-4 text-yellow-500 ml-auto" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Alex Johnson</p>
              <p className="text-xs text-gray-500 capitalize">
                {userPlan} {userPlan !== 'basic' ? 'Member' : 'Plan'}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'chat' && <MentorChat />}
        {currentView === 'courses' && <CourseContent />}
        {currentView === 'skills' && <SkillsBadges />}
        {currentView === 'premium' && <PremiumTiers />}
        {currentView === 'billing' && <SubscriptionManager userId="user_123" />}
      </div>
    </div>
  );
}

export default App;