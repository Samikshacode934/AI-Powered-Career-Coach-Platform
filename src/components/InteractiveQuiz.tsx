import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, AlertCircle, Clock, Target } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InteractiveQuizProps {
  lessonId: string;
  title: string;
  description: string;
  passingScore: number;
  onComplete: (score: number, passed: boolean) => void;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  lessonId,
  title,
  description,
  passingScore,
  onComplete
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  // Sample quiz questions based on lesson
  const quizData: Record<string, QuizQuestion[]> = {
    'ml-quiz-1': [
      {
        id: 'q1',
        question: 'What is the main goal of supervised learning?',
        options: [
          'To learn from labeled training data to make predictions',
          'To find hidden patterns in unlabeled data',
          'To maximize rewards through trial and error',
          'To reduce the dimensionality of data'
        ],
        correctAnswer: 0,
        explanation: 'Supervised learning uses labeled training data to learn a mapping function that can make predictions on new, unseen data.',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'Which of the following is an example of unsupervised learning?',
        options: [
          'Email spam detection',
          'Customer segmentation',
          'House price prediction',
          'Image classification'
        ],
        correctAnswer: 1,
        explanation: 'Customer segmentation is unsupervised learning because it finds patterns in customer data without predefined labels.',
        difficulty: 'medium'
      },
      {
        id: 'q3',
        question: 'What does overfitting mean in machine learning?',
        options: [
          'The model is too simple to capture patterns',
          'The model performs well on training data but poorly on test data',
          'The model has too few parameters',
          'The model trains too quickly'
        ],
        correctAnswer: 1,
        explanation: 'Overfitting occurs when a model learns the training data too well, including noise, making it perform poorly on new data.',
        difficulty: 'medium'
      },
      {
        id: 'q4',
        question: 'Which algorithm is best for linear relationships?',
        options: [
          'Decision Tree',
          'K-Means Clustering',
          'Linear Regression',
          'Neural Networks'
        ],
        correctAnswer: 2,
        explanation: 'Linear Regression is specifically designed to model linear relationships between variables.',
        difficulty: 'easy'
      },
      {
        id: 'q5',
        question: 'What is cross-validation used for?',
        options: [
          'To increase training speed',
          'To assess model performance and prevent overfitting',
          'To reduce data size',
          'To visualize data'
        ],
        correctAnswer: 1,
        explanation: 'Cross-validation helps assess how well a model will generalize to independent data and helps detect overfitting.',
        difficulty: 'hard'
      }
    ],
    'devops-quiz-1': [
      {
        id: 'q1',
        question: 'What does CI/CD stand for?',
        options: [
          'Continuous Integration/Continuous Deployment',
          'Code Integration/Code Deployment',
          'Continuous Improvement/Continuous Development',
          'Central Integration/Central Deployment'
        ],
        correctAnswer: 0,
        explanation: 'CI/CD stands for Continuous Integration and Continuous Deployment, key practices in modern software development.',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'Which Git command is used to merge branches?',
        options: [
          'git combine',
          'git merge',
          'git join',
          'git unite'
        ],
        correctAnswer: 1,
        explanation: 'The git merge command is used to integrate changes from one branch into another.',
        difficulty: 'easy'
      },
      {
        id: 'q3',
        question: 'What is the purpose of a staging environment?',
        options: [
          'To store code permanently',
          'To test applications before production deployment',
          'To backup production data',
          'To develop new features'
        ],
        correctAnswer: 1,
        explanation: 'A staging environment mimics production to test applications before they go live.',
        difficulty: 'medium'
      }
    ]
  };

  useEffect(() => {
    const lessonQuestions = quizData[lessonId] || quizData['ml-quiz-1'];
    setQuestions(lessonQuestions);
  }, [lessonId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [quizStarted, timeLeft, quizCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    const passed = finalScore >= passingScore;
    
    setScore(finalScore);
    setQuizCompleted(true);
    setShowResults(true);
    
    onComplete(finalScore, passed);
  };

  const handleRetakeQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(600);
  };

  if (!quizStarted) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Questions</h3>
              <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="font-semibold text-green-900 mb-2">Passing Score</h3>
              <p className="text-2xl font-bold text-green-600">{passingScore}%</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-purple-900 mb-2">Time Limit</h3>
              <p className="text-2xl font-bold text-purple-600">10 min</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-yellow-900 mb-3">📋 Quiz Instructions</h4>
            <ul className="text-left text-yellow-800 space-y-2">
              <li>• Read each question carefully before selecting your answer</li>
              <li>• You can navigate between questions using the Previous/Next buttons</li>
              <li>• You must score at least {passingScore}% to pass</li>
              <li>• You can retake the quiz if you don't pass</li>
              <li>• The timer starts when you begin the quiz</li>
            </ul>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= passingScore;
    const correctAnswers = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            {passed 
              ? 'You passed the quiz! Great job on mastering this topic.'
              : `You scored ${score}%. You need ${passingScore}% to pass. Don't worry, you can try again!`
            }
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Your Score</h3>
              <p className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {score}%
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="font-semibold text-green-900 mb-2">Correct Answers</h3>
              <p className="text-3xl font-bold text-green-600">
                {correctAnswers}/{questions.length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-purple-900 mb-2">Time Used</h3>
              <p className="text-3xl font-bold text-purple-600">
                {formatTime(600 - timeLeft)}
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Question Review</h3>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="text-left">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Your answer:</span> {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mb-2">
                            <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 italic">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {!passed && (
              <button
                onClick={handleRetakeQuiz}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-6">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestion.id] === index
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion.id] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="font-medium text-gray-700">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        <div className="text-sm text-gray-500">
          {Object.keys(selectedAnswers).length} of {questions.length} answered
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswers[currentQuestion.id] === undefined}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedAnswers[currentQuestion.id] === undefined
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : currentQuestionIndex === questions.length - 1
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
          }`}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default InteractiveQuiz;