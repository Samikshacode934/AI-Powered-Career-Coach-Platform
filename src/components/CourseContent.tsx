import React, { useState } from 'react';
import { Play, BookOpen, CheckCircle, Clock, Award, Video, FileText, Code, Users, Star, ChevronRight, Lock, Trophy, ExternalLink, Youtube } from 'lucide-react';
import YouTubePlayer from './YouTubePlayer';
import InteractiveQuiz from './InteractiveQuiz';
import ProjectWorkspace from './ProjectWorkspace';
import BlockchainBadges from './BlockchainBadges';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'project' | 'reading' | 'colab' | 'external';
  duration: string;
  completed: boolean;
  locked: boolean;
  description: string;
  videoId?: string; // YouTube video ID
  thumbnail?: string;
  content?: any;
  passingScore?: number;
  questions?: number;
  externalUrl?: string;
  platform?: 'youtube' | 'colab' | 'kaggle' | 'github' | 'fastai';
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: Lesson[];
  progress: number;
  instructor: string;
  rating: number;
  students: number;
  badge?: string;
  color: string;
  certificateNFT?: string;
}

const CourseContent: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});

  const courses: Course[] = [
    {
      id: 'ml-certification',
      title: 'AI-Powered Machine Learning Certification',
      subtitle: 'Learn ML, earn blockchain badges, and get career-ready',
      description: 'Complete machine learning course with hands-on projects, real-world applications, and blockchain-verified credentials',
      category: 'Data Science',
      level: 'Beginner',
      duration: '40 hours',
      progress: 0,
      instructor: 'AI Mentor Sarah',
      rating: 4.9,
      students: 15420,
      badge: 'ML Certified Professional',
      certificateNFT: 'algorand-ml-cert-nft',
      color: 'from-indigo-500 to-purple-500',
      lessons: [
        {
          id: 'ml-intro',
          title: 'Introduction to Machine Learning',
          type: 'video',
          duration: '15 min',
          completed: false,
          locked: false,
          description: 'Understanding what machine learning is and its real-world applications',
          videoId: 'nKW8Ndu7Mjw',
          thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'ml-types',
          title: 'Types of Machine Learning',
          type: 'video',
          duration: '20 min',
          completed: false,
          locked: true,
          description: 'Supervised, unsupervised, and reinforcement learning explained with examples',
          videoId: 'f_uwKZIAeM0',
          thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'ml-quiz-1',
          title: 'Knowledge Check: ML Fundamentals',
          type: 'quiz',
          duration: '10 min',
          completed: false,
          locked: true,
          description: 'Test your understanding of machine learning basics',
          questions: 5,
          passingScore: 80
        },
        {
          id: 'linear-regression',
          title: 'Linear Regression Deep Dive',
          type: 'video',
          duration: '25 min',
          completed: false,
          locked: true,
          description: 'Mathematical foundations and practical implementation of linear regression',
          videoId: 'nk2CQITm_eo',
          thumbnail: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'decision-trees',
          title: 'Decision Trees & Random Forests',
          type: 'video',
          duration: '30 min',
          completed: false,
          locked: true,
          description: 'Understanding tree-based algorithms and ensemble methods',
          videoId: 'LDRbO9a6XPU',
          thumbnail: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'ml-project-overview',
          title: 'ML Project Walkthrough',
          type: 'video',
          duration: '35 min',
          completed: false,
          locked: true,
          description: 'End-to-end machine learning project demonstration',
          videoId: '5lu9KqkC-5U',
          thumbnail: 'https://images.pexels.com/photos/8386430/pexels-photo-8386430.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'pandas-tutorial',
          title: 'Pandas DataFrame Tutorial',
          type: 'colab',
          duration: '45 min',
          completed: false,
          locked: true,
          description: 'Learn data manipulation with Pandas in Google Colab',
          externalUrl: 'https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/pandas_dataframe_ultraquick_tutorial.ipynb',
          platform: 'colab'
        },
        {
          id: 'house-price-project',
          title: 'House Price Prediction Project',
          type: 'project',
          duration: '2 hours',
          completed: false,
          locked: true,
          description: 'Build your first ML model using real estate data with Google Colab'
        },
        {
          id: 'intro-pandas',
          title: 'Introduction to Pandas',
          type: 'colab',
          duration: '60 min',
          completed: false,
          locked: true,
          description: 'Deep dive into Pandas for data analysis',
          externalUrl: 'https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/intro_to_pandas.ipynb',
          platform: 'colab'
        },
        {
          id: 'diabetes-prediction',
          title: 'Diabetes Prediction Project',
          type: 'colab',
          duration: '90 min',
          completed: false,
          locked: true,
          description: 'Healthcare ML project with real medical data',
          externalUrl: 'https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/intro_to_pandas.ipynb',
          platform: 'colab'
        },
        {
          id: 'titanic-tutorial',
          title: 'Titanic Survival Prediction',
          type: 'external',
          duration: '2 hours',
          completed: false,
          locked: true,
          description: 'Classic ML competition tutorial on Kaggle',
          externalUrl: 'https://www.kaggle.com/code/alexisbcook/titanic-tutorial?kernelSessionId=99170538',
          platform: 'kaggle'
        },
        {
          id: 'fastai-course',
          title: 'Fast.ai Practical Deep Learning',
          type: 'external',
          duration: '10 hours',
          completed: false,
          locked: true,
          description: 'World-class deep learning course from fast.ai',
          externalUrl: 'https://course.fast.ai/',
          platform: 'fastai'
        },
        {
          id: 'fastai-github',
          title: 'Fast.ai Course Materials',
          type: 'external',
          duration: '5 hours',
          completed: false,
          locked: true,
          description: 'Access course notebooks and materials on GitHub',
          externalUrl: 'https://github.com/fastai/course22',
          platform: 'github'
        },
        {
          id: 'huggingface-transformers',
          title: 'Hugging Face Transformers Tutorial',
          type: 'colab',
          duration: '75 min',
          completed: false,
          locked: true,
          description: 'Learn modern NLP with transformers and Hugging Face',
          externalUrl: 'https://colab.research.google.com/github/huggingface/notebooks/blob/main/course/en/chapter1/section3.ipynb#scrollTo=jnzLz5gdF7xZ',
          platform: 'colab'
        }
      ]
    },
    {
      id: 'devops-mastery',
      title: 'DevOps Engineering Mastery',
      subtitle: 'Master CI/CD, Docker, Kubernetes, and cloud deployment',
      description: 'Complete DevOps pipeline from development to production deployment',
      category: 'DevOps',
      level: 'Intermediate',
      duration: '60 hours',
      progress: 0,
      instructor: 'AI Mentor Marcus',
      rating: 4.8,
      students: 9850,
      badge: 'DevOps Engineer Certified',
      certificateNFT: 'algorand-devops-cert-nft',
      color: 'from-green-500 to-blue-500',
      lessons: [
        {
          id: 'devops-intro',
          title: 'DevOps Culture and Principles',
          type: 'video',
          duration: '18 min',
          completed: false,
          locked: false,
          description: 'Understanding DevOps philosophy and industry best practices',
          videoId: 'UbtB4sMaaNM',
          thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'git-advanced',
          title: 'Advanced Git Workflows',
          type: 'video',
          duration: '22 min',
          completed: false,
          locked: true,
          description: 'Git branching strategies, merge conflicts, and collaboration workflows',
          videoId: 'Uszj_k0DGsg',
          thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 'devops-quiz-1',
          title: 'Git Workflow Assessment',
          type: 'quiz',
          duration: '8 min',
          completed: false,
          locked: true,
          description: 'Test your Git knowledge with practical scenarios',
          questions: 6,
          passingScore: 75
        }
      ]
    }
  ];

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.locked) return;
    
    if (lesson.type === 'external' || lesson.type === 'colab') {
      // Open external links in new tab
      window.open(lesson.externalUrl, '_blank');
      // Mark as completed after opening
      handleLessonComplete(lesson.id);
      return;
    }
    
    setActiveLesson(lesson);
    setShowQuiz(lesson.type === 'quiz');
    setShowProject(lesson.type === 'project');
  };

  const handleLessonComplete = (lessonId: string) => {
    setUserProgress(prev => ({ ...prev, [lessonId]: true }));
    
    // Update course progress and unlock next lesson
    if (selectedCourse) {
      const currentIndex = selectedCourse.lessons.findIndex(l => l.id === lessonId);
      if (currentIndex < selectedCourse.lessons.length - 1) {
        selectedCourse.lessons[currentIndex + 1].locked = false;
      }
      selectedCourse.lessons[currentIndex].completed = true;
      
      // Update overall progress
      const completedLessons = selectedCourse.lessons.filter(l => l.completed).length;
      selectedCourse.progress = Math.round((completedLessons / selectedCourse.lessons.length) * 100);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed && activeLesson) {
      handleLessonComplete(activeLesson.id);
    }
  };

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'colab': return <Code className="w-4 h-4" />;
      case 'kaggle': return <FileText className="w-4 h-4" />;
      case 'github': return <Code className="w-4 h-4" />;
      case 'fastai': return <BookOpen className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-100 text-red-700';
      case 'colab': return 'bg-orange-100 text-orange-700';
      case 'kaggle': return 'bg-blue-100 text-blue-700';
      case 'github': return 'bg-gray-100 text-gray-700';
      case 'fastai': return 'bg-purple-100 text-purple-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  if (selectedCourse && activeLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        {/* Back Navigation */}
        <button
          onClick={() => {
            setSelectedCourse(null);
            setActiveLesson(null);
            setShowQuiz(false);
            setShowProject(false);
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          ← Back to Course Overview
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${selectedCourse.color} rounded-2xl flex items-center justify-center`}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedCourse.title}</h1>
              <p className="text-gray-600 mt-1">{activeLesson.title}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Progress</div>
              <div className="text-2xl font-bold text-gray-900">{selectedCourse.progress}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${selectedCourse.color} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${selectedCourse.progress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Lesson */}
            {activeLesson.type === 'video' && !showQuiz && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <YouTubePlayer
                  videoId={activeLesson.videoId!}
                  title={activeLesson.title}
                  onVideoEnd={() => handleLessonComplete(activeLesson.id)}
                />
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeLesson.title}</h2>
                  <p className="text-gray-600 mb-6">{activeLesson.description}</p>
                  
                  {/* Lesson Notes */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">📝 Key Takeaways</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                        Understanding the fundamentals is crucial for advanced topics
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                        Practice with real-world examples to solidify concepts
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                        Apply learned concepts in the upcoming project
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Quiz */}
            {activeLesson.type === 'quiz' && showQuiz && (
              <InteractiveQuiz
                lessonId={activeLesson.id}
                title={activeLesson.title}
                description={activeLesson.description}
                passingScore={activeLesson.passingScore || 80}
                onComplete={handleQuizComplete}
              />
            )}

            {/* Project Workspace */}
            {activeLesson.type === 'project' && showProject && (
              <ProjectWorkspace
                projectId={activeLesson.id}
                title={activeLesson.title}
                description={activeLesson.description}
                onComplete={() => handleLessonComplete(activeLesson.id)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Course Progress</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{selectedCourse.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r ${selectedCourse.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${selectedCourse.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>{selectedCourse.lessons.filter(l => l.completed).length} of {selectedCourse.lessons.length} lessons completed</p>
              </div>
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Course Modules</h4>
              <div className="space-y-3">
                {selectedCourse.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    disabled={lesson.locked}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      activeLesson?.id === lesson.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : lesson.locked
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        lesson.completed
                          ? 'bg-green-500 text-white'
                          : lesson.locked
                          ? 'bg-gray-300 text-gray-500'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : lesson.locked ? (
                          <Lock className="w-5 h-5" />
                        ) : lesson.type === 'video' ? (
                          <Youtube className="w-5 h-5" />
                        ) : lesson.type === 'quiz' ? (
                          <FileText className="w-5 h-5" />
                        ) : lesson.type === 'external' || lesson.type === 'colab' ? (
                          getPlatformIcon(lesson.platform)
                        ) : (
                          <Code className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lesson.type === 'video' ? 'bg-red-100 text-red-700' :
                            lesson.type === 'quiz' ? 'bg-orange-100 text-orange-700' :
                            lesson.type === 'external' || lesson.type === 'colab' ? getPlatformColor(lesson.platform) :
                            'bg-green-100 text-green-700'
                          }`}>
                            {lesson.platform ? lesson.platform.charAt(0).toUpperCase() + lesson.platform.slice(1) : 
                             lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Blockchain Badges */}
            <BlockchainBadges 
              courseId={selectedCourse.id}
              progress={selectedCourse.progress}
              badgeName={selectedCourse.badge}
              certificateNFT={selectedCourse.certificateNFT}
            />

            {/* Premium Upgrade */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Unlock 1:1 AI mentor sessions, exclusive content, and priority support
                </p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          ← Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className={`w-24 h-24 bg-gradient-to-r ${selectedCourse.color} rounded-3xl flex items-center justify-center flex-shrink-0`}>
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {selectedCourse.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {selectedCourse.level}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{selectedCourse.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h1>
              <p className="text-xl text-blue-600 font-medium mb-4">{selectedCourse.subtitle}</p>
              <p className="text-gray-600 mb-6">{selectedCourse.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedCourse.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedCourse.students.toLocaleString()} students
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Blockchain Certificate
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Your Progress</span>
                  <span className="font-medium">{selectedCourse.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r ${selectedCourse.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${selectedCourse.progress}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleLessonClick(selectedCourse.lessons[0])}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              {selectedCourse.progress > 0 ? 'Continue Learning' : 'Start Course'}
            </button>
          </div>
        </div>

        {/* Course Modules */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
            <div className="grid gap-6">
              {selectedCourse.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className="w-48 h-32 flex-shrink-0 relative">
                      {lesson.thumbnail ? (
                        <img 
                          src={lesson.thumbnail} 
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-r ${selectedCourse.color} flex items-center justify-center`}>
                          {lesson.type === 'video' ? (
                            <Youtube className="w-8 h-8 text-white" />
                          ) : lesson.type === 'quiz' ? (
                            <FileText className="w-8 h-8 text-white" />
                          ) : lesson.type === 'external' || lesson.type === 'colab' ? (
                            getPlatformIcon(lesson.platform)
                          ) : (
                            <Code className="w-8 h-8 text-white" />
                          )}
                        </div>
                      )}
                      {lesson.locked && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{lesson.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              lesson.type === 'video' ? 'bg-red-100 text-red-700' :
                              lesson.type === 'quiz' ? 'bg-orange-100 text-orange-700' :
                              lesson.type === 'external' || lesson.type === 'colab' ? getPlatformColor(lesson.platform) :
                              'bg-green-100 text-green-700'
                            }`}>
                              {lesson.platform ? lesson.platform.charAt(0).toUpperCase() + lesson.platform.slice(1) : 
                               lesson.type === 'quiz' ? `${lesson.questions} Questions` : 
                               lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                            </span>
                            {lesson.passingScore && (
                              <span className="text-xs text-gray-500">
                                Pass: {lesson.passingScore}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {lesson.completed && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <button
                            onClick={() => handleLessonClick(lesson)}
                            disabled={lesson.locked}
                            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                              lesson.locked
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {lesson.completed ? 'Review' : lesson.locked ? 'Locked' : 
                             lesson.type === 'external' || lesson.type === 'colab' ? 'Open' : 'Start'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{selectedCourse.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium">{selectedCourse.lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedCourse.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{selectedCourse.students.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Learning Platforms */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Learning Platforms</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">YouTube Videos</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <Code className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Google Colab</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Kaggle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Fast.ai</span>
                </div>
              </div>
            </div>

            {/* Certificate Preview */}
            {selectedCourse.badge && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                <div className="text-center">
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Earn Your Certificate</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete this course to earn "{selectedCourse.badge}" blockchain-verified credential
                  </p>
                  <div className="w-full bg-yellow-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedCourse.progress}% Complete
                  </p>
                </div>
              </div>
            )}

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Premium Features</h3>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• 1:1 AI Mentor Sessions</li>
                  <li>• Exclusive Project Templates</li>
                  <li>• Priority Support</li>
                  <li>• Advanced Certificates</li>
                </ul>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Course Library</h1>
        <p className="text-gray-600">Learn with YouTube videos, interactive quizzes, and hands-on projects</p>
      </div>

      {/* Featured Courses */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className={`h-48 bg-gradient-to-r ${course.color} flex items-center justify-center relative`}>
              <BookOpen className="w-16 h-16 text-white opacity-80" />
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">{course.level}</span>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-blue-600 font-medium mb-3">{course.subtitle}</p>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.students.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  NFT Certificate
                </div>
              </div>

              {course.progress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedCourse(course)}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  course.progress > 0
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                }`}
              >
                {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Real Learning Experience
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Learn with curated content from YouTube, Google Colab, Kaggle, Fast.ai, and more. Earn blockchain certificates and get personalized AI mentoring.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/50 rounded-2xl">
            <Youtube className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">YouTube</h3>
            <p className="text-gray-600 text-sm">Best educational videos</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-2xl">
            <Code className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Google Colab</h3>
            <p className="text-gray-600 text-sm">Interactive coding</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-2xl">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Kaggle</h3>
            <p className="text-gray-600 text-sm">Real competitions</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-2xl">
            <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">NFT Certificates</h3>
            <p className="text-gray-600 text-sm">Blockchain verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;