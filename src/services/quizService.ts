interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code-completion';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  lessonId: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  attempts: number;
  maxAttempts: number;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
  startTime: Date;
  endTime: Date;
  timeSpent: number; // in seconds
}

interface AIQuizGenerationRequest {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  questionTypes: QuizQuestion['type'][];
  learningObjectives: string[];
}

class QuizService {
  // Generate AI-powered quiz questions based on course content
  async generateAIQuiz(request: AIQuizGenerationRequest): Promise<QuizQuestion[]> {
    // This would integrate with an AI service (like OpenAI) to generate questions
    // For now, we'll return sample questions based on the topic
    
    const questions: QuizQuestion[] = [];
    
    for (let i = 0; i < request.questionCount; i++) {
      const questionType = request.questionTypes[i % request.questionTypes.length];
      const question = await this.generateQuestionByType(
        request.topic,
        questionType,
        request.difficulty,
        request.learningObjectives
      );
      questions.push(question);
    }
    
    return questions;
  }

  private async generateQuestionByType(
    topic: string,
    type: QuizQuestion['type'],
    difficulty: QuizQuestion['difficulty'],
    objectives: string[]
  ): Promise<QuizQuestion> {
    // AI-generated questions based on topic and type
    const baseQuestion: Omit<QuizQuestion, 'id' | 'question' | 'options' | 'correctAnswer'> = {
      type,
      explanation: '',
      difficulty,
      topic,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    };

    switch (type) {
      case 'multiple-choice':
        return this.generateMultipleChoiceQuestion(topic, difficulty, baseQuestion);
      case 'true-false':
        return this.generateTrueFalseQuestion(topic, difficulty, baseQuestion);
      case 'fill-blank':
        return this.generateFillBlankQuestion(topic, difficulty, baseQuestion);
      case 'code-completion':
        return this.generateCodeCompletionQuestion(topic, difficulty, baseQuestion);
      default:
        throw new Error(`Unsupported question type: ${type}`);
    }
  }

  private generateMultipleChoiceQuestion(
    topic: string,
    difficulty: QuizQuestion['difficulty'],
    base: Omit<QuizQuestion, 'id' | 'question' | 'options' | 'correctAnswer'>
  ): QuizQuestion {
    // Sample AI-generated questions for different topics
    const questionBank = {
      'machine learning': {
        easy: {
          question: "What is the main goal of supervised learning?",
          options: [
            "To learn from labeled training data to make predictions",
            "To find hidden patterns in unlabeled data",
            "To maximize rewards through trial and error",
            "To reduce the dimensionality of data"
          ],
          correctAnswer: 0,
          explanation: "Supervised learning uses labeled training data to learn a mapping function that can make predictions on new, unseen data."
        },
        medium: {
          question: "Which algorithm is best suited for handling non-linear relationships in data?",
          options: [
            "Linear Regression",
            "Logistic Regression", 
            "Random Forest",
            "K-Means Clustering"
          ],
          correctAnswer: 2,
          explanation: "Random Forest can capture non-linear relationships through its ensemble of decision trees, making it more flexible than linear models."
        }
      },
      'devops': {
        easy: {
          question: "What does CI/CD stand for?",
          options: [
            "Continuous Integration/Continuous Deployment",
            "Code Integration/Code Deployment",
            "Continuous Improvement/Continuous Development",
            "Central Integration/Central Deployment"
          ],
          correctAnswer: 0,
          explanation: "CI/CD stands for Continuous Integration and Continuous Deployment, key practices in modern software development."
        }
      }
    };

    const topicQuestions = questionBank[topic.toLowerCase() as keyof typeof questionBank];
    const questionData = topicQuestions?.[difficulty] || questionBank['machine learning'].easy;

    return {
      ...base,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation
    };
  }

  private generateTrueFalseQuestion(
    topic: string,
    difficulty: QuizQuestion['difficulty'],
    base: Omit<QuizQuestion, 'id' | 'question' | 'options' | 'correctAnswer'>
  ): QuizQuestion {
    const statements = {
      'machine learning': [
        {
          statement: "Overfitting occurs when a model performs well on training data but poorly on test data.",
          correct: true,
          explanation: "Overfitting happens when a model learns the training data too well, including noise, making it perform poorly on new data."
        },
        {
          statement: "Deep learning always outperforms traditional machine learning algorithms.",
          correct: false,
          explanation: "Deep learning excels with large datasets and complex patterns, but traditional ML can be better for smaller datasets or simpler problems."
        }
      ]
    };

    const topicStatements = statements[topic.toLowerCase() as keyof typeof statements] || statements['machine learning'];
    const randomStatement = topicStatements[Math.floor(Math.random() * topicStatements.length)];

    return {
      ...base,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: `True or False: ${randomStatement.statement}`,
      options: ['True', 'False'],
      correctAnswer: randomStatement.correct ? 0 : 1,
      explanation: randomStatement.explanation
    };
  }

  private generateFillBlankQuestion(
    topic: string,
    difficulty: QuizQuestion['difficulty'],
    base: Omit<QuizQuestion, 'id' | 'question' | 'options' | 'correctAnswer'>
  ): QuizQuestion {
    const fillBlanks = {
      'machine learning': [
        {
          question: "The process of splitting data into training and testing sets is called _____ validation.",
          answer: "cross",
          explanation: "Cross-validation is a technique used to assess how well a model will generalize to an independent dataset."
        }
      ]
    };

    const topicQuestions = fillBlanks[topic.toLowerCase() as keyof typeof fillBlanks] || fillBlanks['machine learning'];
    const randomQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];

    return {
      ...base,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: randomQuestion.question,
      correctAnswer: randomQuestion.answer,
      explanation: randomQuestion.explanation
    };
  }

  private generateCodeCompletionQuestion(
    topic: string,
    difficulty: QuizQuestion['difficulty'],
    base: Omit<QuizQuestion, 'id' | 'question' | 'options' | 'correctAnswer'>
  ): QuizQuestion {
    const codeQuestions = {
      'machine learning': [
        {
          question: "Complete the code to split data into training and testing sets:\n\n```python\nfrom sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, ___=0.2)\n```",
          options: ["test_size", "train_size", "split_ratio", "validation_size"],
          correctAnswer: 0,
          explanation: "The test_size parameter specifies the proportion of the dataset to include in the test split."
        }
      ]
    };

    const topicQuestions = codeQuestions[topic.toLowerCase() as keyof typeof codeQuestions] || codeQuestions['machine learning'];
    const randomQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];

    return {
      ...base,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: randomQuestion.question,
      options: randomQuestion.options,
      correctAnswer: randomQuestion.correctAnswer,
      explanation: randomQuestion.explanation
    };
  }

  // Evaluate quiz attempt
  async evaluateQuiz(quiz: Quiz, answers: Record<string, any>): Promise<{
    score: number;
    passed: boolean;
    results: Array<{
      questionId: string;
      correct: boolean;
      userAnswer: any;
      correctAnswer: any;
      explanation: string;
    }>;
  }> {
    const results = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      const correct = this.isAnswerCorrect(question, userAnswer);
      
      return {
        questionId: question.id,
        correct,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = results.reduce((sum, r, index) => {
      return sum + (r.correct ? quiz.questions[index].points : 0);
    }, 0);

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= quiz.passingScore;

    return { score, passed, results };
  }

  private isAnswerCorrect(question: QuizQuestion, userAnswer: any): boolean {
    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        return userAnswer === question.correctAnswer;
      case 'fill-blank':
        return userAnswer?.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim();
      case 'code-completion':
        return userAnswer === question.correctAnswer;
      default:
        return false;
    }
  }

  // Generate adaptive quiz based on user performance
  async generateAdaptiveQuiz(
    userId: string,
    courseId: string,
    previousAttempts: QuizAttempt[]
  ): Promise<Quiz> {
    // Analyze user's weak areas from previous attempts
    const weakTopics = this.analyzeWeakAreas(previousAttempts);
    
    // Generate questions focusing on weak areas
    const questions = await this.generateAIQuiz({
      topic: weakTopics[0] || 'general',
      difficulty: this.determineDifficulty(previousAttempts),
      questionCount: 10,
      questionTypes: ['multiple-choice', 'true-false', 'fill-blank'],
      learningObjectives: []
    });

    return {
      id: `adaptive_${Date.now()}`,
      title: 'Adaptive Assessment',
      description: 'Personalized quiz based on your learning progress',
      courseId,
      lessonId: 'adaptive',
      questions,
      timeLimit: 20,
      passingScore: 70,
      attempts: 0,
      maxAttempts: 3
    };
  }

  private analyzeWeakAreas(attempts: QuizAttempt[]): string[] {
    // Analyze previous attempts to identify topics where user struggled
    // This would involve more complex analysis in a real implementation
    return ['machine learning', 'algorithms'];
  }

  private determineDifficulty(attempts: QuizAttempt[]): 'easy' | 'medium' | 'hard' {
    if (attempts.length === 0) return 'easy';
    
    const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length;
    
    if (averageScore >= 80) return 'hard';
    if (averageScore >= 60) return 'medium';
    return 'easy';
  }
}

export const quizService = new QuizService();
export type { Quiz, QuizQuestion, QuizAttempt, AIQuizGenerationRequest };