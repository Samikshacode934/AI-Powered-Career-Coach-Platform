import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings, Users, MessageCircle, Crown } from 'lucide-react';
import { tavusService, TavusPersona, TavusConversationResponse } from '../services/tavusService';

interface TavusVideoChatProps {
  userProfile?: {
    name: string;
    role: string;
    experience: string;
    goals: string[];
  };
  onSessionEnd?: (sessionData: any) => void;
}

const TavusVideoChat: React.FC<TavusVideoChatProps> = ({ userProfile, onSessionEnd }) => {
  const [personas, setPersonas] = useState<TavusPersona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<TavusPersona | null>(null);
  const [conversation, setConversation] = useState<TavusConversationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTopic, setSessionTopic] = useState('');

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const availablePersonas = await tavusService.getPersonas();
      setPersonas(availablePersonas);
      if (availablePersonas.length > 0) {
        setSelectedPersona(availablePersonas[0]);
      }
    } catch (error) {
      console.error('Error loading personas:', error);
      setError('Failed to load AI mentors. Please try again.');
    }
  };

  const startSession = async () => {
    if (!selectedPersona || !sessionTopic.trim()) {
      setError('Please select a mentor and enter a topic for discussion.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const conversationResponse = await tavusService.createCareerMentorSession(
        userProfile || {
          name: 'User',
          role: 'Professional',
          experience: 'Mid-level',
          goals: ['Career Growth']
        },
        sessionTopic
      );

      setConversation(conversationResponse);
      setIsInCall(true);
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start mentoring session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (conversation) {
      try {
        await tavusService.endConversation(conversation.conversation_id);
        onSessionEnd?.(conversation);
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    
    setIsInCall(false);
    setConversation(null);
    setSessionTopic('');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const openTavusSession = () => {
    if (conversation?.conversation_url) {
      window.open(conversation.conversation_url, '_blank', 'width=1200,height=800');
    }
  };

  if (!tavusService.isConfigured()) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tavus Integration</h3>
          <p className="text-gray-600 mb-4">
            To enable AI video mentoring, please configure your Tavus API key in the environment variables.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-sm">
              Add <code className="bg-blue-100 px-2 py-1 rounded">VITE_TAVUS_API_KEY</code> to your .env file
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Setup */}
      {!isInCall && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Video Mentoring</h3>
              <p className="text-gray-600">Start a personalized 1:1 session with an AI mentor</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Mentor Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Your AI Mentor
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {personas.map((persona) => (
                <button
                  key={persona.persona_id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedPersona?.persona_id === persona.persona_id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{persona.persona_name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{persona.system_prompt}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to discuss?
            </label>
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="e.g., Salary negotiation, Career transition, Leadership skills..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Start Session Button */}
          <button
            onClick={startSession}
            disabled={isLoading || !selectedPersona || !sessionTopic.trim()}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading || !selectedPersona || !sessionTopic.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting Session...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Start AI Mentoring Session
              </>
            )}
          </button>
        </div>
      )}

      {/* Active Session */}
      {isInCall && conversation && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Session Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Session with {selectedPersona?.persona_name}
                </h3>
                <p className="text-purple-100">Topic: {sessionTopic}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
            </div>
          </div>

          {/* Video Area */}
          <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12" />
              </div>
              <h4 className="text-xl font-bold mb-2">AI Video Session Active</h4>
              <p className="text-gray-300 mb-6">
                Your Tavus AI mentor session is running in a separate window
              </p>
              <button
                onClick={openTavusSession}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors duration-200"
              >
                Open Session Window
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  !isVideoEnabled ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={endSession}
                className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
              >
                <PhoneOff className="w-5 h-5" />
              </button>

              <button className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Session ID: {conversation.conversation_id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Upgrade CTA */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">Unlock Unlimited AI Video Sessions</h4>
            <p className="text-gray-600 text-sm">
              Upgrade to Professional or Enterprise for unlimited access to AI video mentoring
            </p>
          </div>
          <button className="px-6 py-2 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors duration-200">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TavusVideoChat;