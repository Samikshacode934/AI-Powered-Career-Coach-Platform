import React, { useState } from 'react';
import { Send, Mic, Video, Phone, MessageCircle, Bot, User, Crown } from 'lucide-react';
import VoiceChat from './VoiceChat';
import TavusVideoChat from './TavusVideoChat';

const MentorChat: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi Alex! I'm your AI career mentor. I'm here to help you with career advice, skill development, and professional growth. What would you like to discuss today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      avatar: '🤖'
    },
    {
      id: 2,
      type: 'user',
      content: "I'm preparing for a senior software engineer interview. Can you help me with some technical questions?",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      avatar: '👨‍💻'
    },
    {
      id: 3,
      type: 'ai',
      content: "Absolutely! I'd be happy to help you prepare for your senior software engineer interview. Let's start with system design questions - they're crucial for senior roles. Can you walk me through how you'd design a scalable chat application?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      avatar: '🤖'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'video'>('chat');

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || newMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: textToSend,
      timestamp: new Date(),
      avatar: '👨‍💻'
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai' as const,
        content: "That's a great question! Let me provide you with a comprehensive approach to tackle this...",
        timestamp: new Date(),
        avatar: '🤖'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const mentorProfiles = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineering Manager at Google',
      specialty: 'Technical Leadership',
      avatar: '👩‍💼',
      status: 'online'
    },
    {
      name: 'Marcus Johnson',
      role: 'VP Product at Microsoft',
      specialty: 'Product Strategy',
      avatar: '👨‍💼',
      status: 'offline'
    },
    {
      name: 'AI Mentor Pro',
      role: 'Advanced AI Career Coach',
      specialty: 'All Topics',
      avatar: '🤖',
      status: 'online'
    }
  ];

  const userProfile = {
    name: 'Alex Johnson',
    role: 'Software Engineer',
    experience: '5 years',
    goals: ['Senior Engineer Promotion', 'Technical Leadership', 'System Design Mastery']
  };

  return (
    <div className="p-8 h-screen flex gap-6">
      {/* Mentor Sidebar */}
      <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Available Mentors</h2>
        <div className="space-y-4">
          {mentorProfiles.map((mentor, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{mentor.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.role}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${mentor.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <p className="text-sm text-blue-600 font-medium">{mentor.specialty}</p>
            </div>
          ))}
        </div>

        {/* Communication Mode Tabs */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Communication Mode</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                activeTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Text Chat
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                activeTab === 'voice' ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mic className="w-5 h-5" />
              Voice Chat
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                activeTab === 'video' ? 'bg-pink-100 text-pink-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Video className="w-5 h-5" />
              Video Session
              <Crown className="w-4 h-4 text-yellow-500 ml-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Mentor Pro</h2>
                <p className="text-green-600 text-sm">● Online - Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeTab === 'chat' ? 'bg-blue-100 text-blue-700' :
                activeTab === 'voice' ? 'bg-purple-100 text-purple-700' :
                'bg-pink-100 text-pink-700'
              }`}>
                {activeTab === 'chat' && <><MessageCircle className="w-4 h-4 inline mr-1" />Text Chat</>}
                {activeTab === 'voice' && <><Mic className="w-4 h-4 inline mr-1" />Voice Active</>}
                {activeTab === 'video' && <><Video className="w-4 h-4 inline mr-1" />Video Session</>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-md p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask your mentor anything..."
                      className="w-full p-4 pr-12 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'voice' && (
            <div className="p-6">
              <VoiceChat 
                onTranscriptReceived={handleVoiceTranscript}
                onSpeakingStateChange={(isSpeaking) => {
                  // Handle speaking state changes if needed
                }}
              />
            </div>
          )}

          {activeTab === 'video' && (
            <div className="p-6">
              <TavusVideoChat 
                userProfile={userProfile}
                onSessionEnd={(sessionData) => {
                  console.log('Video session ended:', sessionData);
                  // Handle session end
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorChat;