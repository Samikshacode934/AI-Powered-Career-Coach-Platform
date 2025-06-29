import React, { useState } from 'react';
import { Award, Check, Lock, Star, ExternalLink, Download, Share2, Calendar } from 'lucide-react';

const SkillsBadges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'earned' | 'available' | 'blockchain'>('earned');

  const earnedBadges = [
    {
      id: 1,
      name: 'React Mastery',
      description: 'Advanced React development skills',
      issuer: 'Pocket Mentor Academy',
      earnedDate: '2024-01-15',
      blockchainId: '0x1a2b3c4d',
      verified: true,
      category: 'Frontend Development',
      level: 'Advanced',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Leadership Fundamentals',
      description: 'Core leadership and management principles',
      issuer: 'Industry Expert Panel',
      earnedDate: '2024-01-10',
      blockchainId: '0x2b3c4d5e',
      verified: true,
      category: 'Leadership',
      level: 'Intermediate',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      name: 'System Design Expert',
      description: 'Scalable system architecture design',
      issuer: 'Tech Leaders Collective',
      earnedDate: '2024-01-05',
      blockchainId: '0x3c4d5e6f',
      verified: true,
      category: 'Architecture',
      level: 'Expert',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      name: 'Product Strategy',
      description: 'Product roadmap and strategy development',
      issuer: 'Product Management Institute',
      earnedDate: '2023-12-20',
      blockchainId: '0x4d5e6f7g',
      verified: true,
      category: 'Product Management',
      level: 'Advanced',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const availableBadges = [
    {
      id: 5,
      name: 'Machine Learning Basics',
      description: 'Fundamentals of ML and AI',
      requirements: ['Complete 5 ML courses', 'Pass final assessment'],
      estimatedTime: '40 hours',
      category: 'Data Science',
      level: 'Beginner',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 6,
      name: 'DevOps Engineering',
      description: 'CI/CD and infrastructure automation',
      requirements: ['Deploy 3 applications', 'Set up monitoring'],
      estimatedTime: '60 hours',
      category: 'DevOps',
      level: 'Intermediate',
      color: 'from-green-500 to-blue-500'
    }
  ];

  const blockchainStats = {
    totalCredentials: 24,
    verifiedSkills: 18,
    networkValue: '$2,840',
    trustScore: 94
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills & Credentials</h1>
        <p className="text-gray-600">Your blockchain-verified professional achievements</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl max-w-md">
        {[
          { id: 'earned', label: 'Earned Badges' },
          { id: 'available', label: 'Available' },
          { id: 'blockchain', label: 'Blockchain' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Earned Badges */}
      {activeTab === 'earned' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${badge.color} rounded-2xl flex items-center justify-center`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  {badge.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <Check className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                <p className="text-gray-600 mb-4">{badge.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">{badge.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Level</span>
                    <span className="font-medium">{badge.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Earned</span>
                    <span className="font-medium">{new Date(badge.earnedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <ExternalLink className="w-4 h-4" />
                    View on Chain
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {availableBadges.map((badge) => (
              <div key={badge.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${badge.color} rounded-2xl flex items-center justify-center opacity-60`}>
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    <Calendar className="w-3 h-3" />
                    {badge.estimatedTime}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                <p className="text-gray-600 mb-4">{badge.description}</p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {badge.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Start Learning Path
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockchain Tab */}
      {activeTab === 'blockchain' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{blockchainStats.totalCredentials}</h3>
              <p className="text-gray-600 text-sm">Total Credentials</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{blockchainStats.verifiedSkills}</h3>
              <p className="text-gray-600 text-sm">Verified Skills</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{blockchainStats.networkValue}</h3>
              <p className="text-gray-600 text-sm">Network Value</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{blockchainStats.trustScore}%</h3>
              <p className="text-gray-600 text-sm">Trust Score</p>
            </div>
          </div>

          {/* Blockchain Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Blockchain Credentials</h2>
            <div className="space-y-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{badge.name}</h3>
                      <p className="text-sm text-gray-600">ID: {badge.blockchainId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <Check className="w-3 h-3" />
                      Verified
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200">
                      View Transaction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsBadges;