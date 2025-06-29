import React from 'react';
import { TrendingUp, Target, Award, Clock, MessageCircle, Video, Mic, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Career Score', value: '87/100', change: '+12', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Skills Earned', value: '24', change: '+3', icon: Award, color: 'from-blue-500 to-cyan-500' },
    { label: 'Mentor Sessions', value: '18', change: '+5', icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
    { label: 'Learning Hours', value: '156', change: '+24', icon: Clock, color: 'from-orange-500 to-red-500' },
  ];

  const recentActivities = [
    {
      type: 'video',
      title: 'Completed "Salary Negotiation Masterclass"',
      time: '2 hours ago',
      icon: Video,
      color: 'bg-purple-500'
    },
    {
      type: 'badge',
      title: 'Earned "Leadership Fundamentals" Badge',
      time: '1 day ago',
      icon: Award,
      color: 'bg-green-500'
    },
    {
      type: 'chat',
      title: 'AI Mentor Session: Career Planning',
      time: '2 days ago',
      icon: MessageCircle,
      color: 'bg-blue-500'
    },
    {
      type: 'voice',
      title: 'Voice Session: Interview Preparation',
      time: '3 days ago',
      icon: Mic,
      color: 'bg-orange-500'
    }
  ];

  const upcomingGoals = [
    { title: 'Complete React Advanced Course', progress: 75, deadline: '3 days' },
    { title: 'Earn Product Management Certificate', progress: 45, deadline: '1 week' },
    { title: 'Practice Technical Interviews', progress: 60, deadline: '5 days' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Alex!</h1>
        <p className="text-gray-600">Here's your career development progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals & Progress */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Goals</h2>
            <div className="space-y-6">
              {upcomingGoals.map((goal, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{goal.title}</h3>
                    <span className="text-xs text-gray-500">{goal.deadline}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <MessageCircle className="w-8 h-8 mb-3 mx-auto" />
            <p className="font-medium">Start AI Chat</p>
          </button>
          <button className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Video className="w-8 h-8 mb-3 mx-auto" />
            <p className="font-medium">Watch Mentor</p>
          </button>
          <button className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Award className="w-8 h-8 mb-3 mx-auto" />
            <p className="font-medium">View Badges</p>
          </button>
          <button className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <BookOpen className="w-8 h-8 mb-3 mx-auto" />
            <p className="font-medium">Browse Courses</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;