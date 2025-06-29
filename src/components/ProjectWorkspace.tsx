import React, { useState } from 'react';
import { Code, ExternalLink, Download, Play, CheckCircle, BookOpen, Lightbulb, Target } from 'lucide-react';

interface ProjectWorkspaceProps {
  projectId: string;
  title: string;
  description: string;
  onComplete: () => void;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  projectId,
  title,
  description,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'colab' | 'resources'>('overview');
  const [projectCompleted, setProjectCompleted] = useState(false);

  // Project data based on projectId
  const projectData: Record<string, any> = {
    'ml-project-1': {
      title: 'House Price Prediction with Linear Regression',
      description: 'Build your first machine learning model to predict house prices using real estate data',
      colabUrl: 'https://colab.research.google.com/drive/1example-house-prices',
      objectives: [
        'Load and explore real estate dataset',
        'Perform data preprocessing and feature engineering',
        'Implement linear regression from scratch',
        'Train and evaluate your model',
        'Make predictions on new data'
      ],
      skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Visualization'],
      estimatedTime: '2-3 hours',
      difficulty: 'Beginner',
      dataset: 'Boston Housing Dataset (1000+ samples)',
      deliverables: [
        'Jupyter notebook with complete analysis',
        'Trained linear regression model',
        'Model evaluation report',
        'Predictions on test data'
      ]
    },
    'devops-project-1': {
      title: 'CI/CD Pipeline with GitHub Actions',
      description: 'Set up automated deployment pipeline for a web application',
      colabUrl: 'https://github.com/example/cicd-template',
      objectives: [
        'Set up GitHub repository with sample app',
        'Create GitHub Actions workflow',
        'Implement automated testing',
        'Deploy to staging environment',
        'Set up production deployment'
      ],
      skills: ['Git', 'GitHub Actions', 'Docker', 'YAML', 'Deployment'],
      estimatedTime: '3-4 hours',
      difficulty: 'Intermediate',
      dataset: 'Sample Node.js web application',
      deliverables: [
        'Working CI/CD pipeline',
        'Automated test suite',
        'Deployed application',
        'Documentation'
      ]
    }
  };

  const project = projectData[projectId] || projectData['ml-project-1'];

  const handleStartProject = () => {
    // Open Colab notebook in new tab
    window.open(project.colabUrl, '_blank');
  };

  const handleCompleteProject = () => {
    setProjectCompleted(true);
    onComplete();
  };

  const sampleCode = `# House Price Prediction - Starter Code
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Step 1: Load the dataset
def load_data():
    """
    Load the Boston Housing dataset
    Returns: X (features), y (target)
    """
    # TODO: Load your dataset here
    # Hint: You can use sklearn.datasets.load_boston() or pandas.read_csv()
    pass

# Step 2: Explore the data
def explore_data(X, y):
    """
    Perform exploratory data analysis
    """
    print("Dataset shape:", X.shape)
    print("Target shape:", y.shape)
    
    # TODO: Add your data exploration code
    # - Check for missing values
    # - Visualize feature distributions
    # - Analyze correlations
    pass

# Step 3: Preprocess the data
def preprocess_data(X, y):
    """
    Clean and prepare data for modeling
    """
    # TODO: Handle missing values, outliers, feature scaling
    pass

# Step 4: Train the model
def train_model(X_train, y_train):
    """
    Train a linear regression model
    """
    model = LinearRegression()
    # TODO: Fit the model
    return model

# Step 5: Evaluate the model
def evaluate_model(model, X_test, y_test):
    """
    Evaluate model performance
    """
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"Mean Squared Error: {mse:.2f}")
    print(f"R² Score: {r2:.2f}")
    
    return predictions

# Main execution
if __name__ == "__main__":
    # Load data
    X, y = load_data()
    
    # Explore data
    explore_data(X, y)
    
    # Preprocess data
    X_processed, y_processed = preprocess_data(X, y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_processed, y_processed, test_size=0.2, random_state=42
    )
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Evaluate model
    predictions = evaluate_model(model, X_test, y_test)
    
    print("🎉 Congratulations! You've built your first ML model!")`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {project.difficulty} Project
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3">{project.title}</h2>
            <p className="text-blue-100 mb-6 text-lg">{project.description}</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-1">Duration</h4>
                <p className="text-blue-100">{project.estimatedTime}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-1">Difficulty</h4>
                <p className="text-blue-100">{project.difficulty}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-1">Dataset</h4>
                <p className="text-blue-100">{project.dataset}</p>
              </div>
            </div>
          </div>
          
          {!projectCompleted && (
            <button
              onClick={handleStartProject}
              className="flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ExternalLink className="w-5 h-5" />
              Open in Colab
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'overview', label: 'Project Overview', icon: Target },
            { id: 'colab', label: 'Code Workspace', icon: Code },
            { id: 'resources', label: 'Resources', icon: BookOpen }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Learning Objectives */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Learning Objectives
              </h3>
              <div className="grid gap-3">
                {project.objectives.map((objective: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{objective}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills You'll Learn */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills You'll Learn</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Deliverables</h3>
              <div className="grid gap-3">
                {project.deliverables.map((deliverable: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-gray-700">{deliverable}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Getting Started
              </h4>
              <ol className="space-y-2 text-blue-800">
                <li>1. Click "Open in Colab" to access the project notebook</li>
                <li>2. Make a copy of the notebook to your Google Drive</li>
                <li>3. Follow the step-by-step instructions in the notebook</li>
                <li>4. Complete all the TODO sections with your code</li>
                <li>5. Run all cells and verify your results</li>
                <li>6. Come back here to mark the project as complete</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'colab' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Code Workspace</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleStartProject}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Colab
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  Download Starter
                </button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm">house_price_prediction.py</span>
              </div>
              <pre className="p-6 text-green-400 text-sm overflow-x-auto">
                <code>{sampleCode}</code>
              </pre>
            </div>

            {/* Colab Embed Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Google Colab Integration</h4>
              <p className="text-gray-600 mb-6">
                Click the button above to open this project in Google Colab where you can run the code interactively.
              </p>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Colab Notebook Preview:</p>
                <div className="text-left text-xs text-gray-400 font-mono">
                  📊 Data Loading and Exploration<br/>
                  🔧 Data Preprocessing<br/>
                  🤖 Model Training<br/>
                  📈 Model Evaluation<br/>
                  🎯 Making Predictions
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Additional Resources</h3>
            
            {/* Documentation Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-bold text-blue-900 mb-4">📚 Documentation</h4>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                    <ExternalLink className="w-4 h-4" />
                    Pandas Documentation
                  </a>
                  <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                    <ExternalLink className="w-4 h-4" />
                    Scikit-learn User Guide
                  </a>
                  <a href="#" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                    <ExternalLink className="w-4 h-4" />
                    Matplotlib Tutorials
                  </a>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-bold text-green-900 mb-4">🎥 Video Tutorials</h4>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-2 text-green-700 hover:text-green-900">
                    <Play className="w-4 h-4" />
                    Linear Regression Explained
                  </a>
                  <a href="#" className="flex items-center gap-2 text-green-700 hover:text-green-900">
                    <Play className="w-4 h-4" />
                    Data Preprocessing Tips
                  </a>
                  <a href="#" className="flex items-center gap-2 text-green-700 hover:text-green-900">
                    <Play className="w-4 h-4" />
                    Model Evaluation Metrics
                  </a>
                </div>
              </div>
            </div>

            {/* Helpful Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h4 className="font-bold text-yellow-900 mb-4">💡 Helpful Tips</h4>
              <ul className="space-y-2 text-yellow-800">
                <li>• Start by exploring the data thoroughly before building your model</li>
                <li>• Handle missing values and outliers appropriately</li>
                <li>• Use train-validation-test splits to avoid overfitting</li>
                <li>• Visualize your results to better understand model performance</li>
                <li>• Don't hesitate to ask for help in the community forum</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Project Completion */}
      {!projectCompleted && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900">Ready to submit your project?</h4>
              <p className="text-gray-600 text-sm">Mark as complete once you've finished all deliverables</p>
            </div>
            <button
              onClick={handleCompleteProject}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Mark as Complete
            </button>
          </div>
        </div>
      )}

      {projectCompleted && (
        <div className="border-t border-green-200 p-6 bg-green-50">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-bold text-green-900">Project Completed! 🎉</h4>
              <p className="text-green-700 text-sm">Great job! You've successfully completed this project.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkspace;