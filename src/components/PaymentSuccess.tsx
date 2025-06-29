import React, { useEffect, useState } from 'react';
import { CheckCircle, Award, ArrowRight, Download, Share2, Crown } from 'lucide-react';
import { stripeService } from '../services/stripeService';

interface PaymentSuccessProps {
  sessionId?: string;
  planId?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ sessionId, planId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching subscription details
    const fetchSubscriptionDetails = async () => {
      setIsLoading(true);
      
      // In a real app, you'd verify the session and get subscription details
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plans = stripeService.getSubscriptionPlans();
      const plan = plans.find(p => p.id === planId) || plans[1];
      
      setSubscriptionDetails({
        plan: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: plan.features,
        activatedAt: new Date(),
        nextBilling: new Date(Date.now() + (plan.interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000)
      });
      
      setIsLoading(false);
    };

    fetchSubscriptionDetails();
  }, [sessionId, planId]);

  const handleDownloadReceipt = () => {
    // In a real app, this would download the actual receipt
    alert('Receipt download would start here');
  };

  const handleShareSuccess = () => {
    const shareText = `I just upgraded my career coaching with Pocket Mentor! 🚀 #CareerGrowth #PocketMentor`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Subscription</h2>
          <p className="text-gray-600">Please wait while we set up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to {subscriptionDetails.plan}! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your subscription has been activated successfully. You now have access to all premium features.
          </p>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                Subscription Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">{subscriptionDetails.plan}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">
                    {stripeService.formatPrice(subscriptionDetails.price)}/{subscriptionDetails.interval}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Activated</span>
                  <span className="font-semibold text-gray-900">
                    {subscriptionDetails.activatedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Next Billing</span>
                  <span className="font-semibold text-gray-900">
                    {subscriptionDetails.nextBilling.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-500" />
                Your New Features
              </h3>
              
              <div className="space-y-3">
                {subscriptionDetails.features.slice(0, 6).map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {subscriptionDetails.features.length > 6 && (
                  <div className="text-blue-600 font-medium">
                    +{subscriptionDetails.features.length - 6} more features
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Start Learning</h4>
            <p className="text-gray-600 text-sm mb-4">
              Jump into your first AI mentoring session
            </p>
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200">
              Go to Dashboard
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Download Receipt</h4>
            <p className="text-gray-600 text-sm mb-4">
              Get your payment receipt for records
            </p>
            <button 
              onClick={handleDownloadReceipt}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors duration-200"
            >
              Download PDF
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Share Success</h4>
            <p className="text-gray-600 text-sm mb-4">
              Tell others about your career upgrade
            </p>
            <button 
              onClick={handleShareSuccess}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors duration-200"
            >
              Share on Twitter
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">What's Next?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Your premium features are now active! Here are some recommended next steps to maximize your career growth.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="font-bold mb-2">1. Complete Your Profile</h4>
              <p className="text-blue-100 text-sm">
                Set up your career goals and preferences for personalized AI mentoring
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="font-bold mb-2">2. Start a Course</h4>
              <p className="text-blue-100 text-sm">
                Access premium courses and earn blockchain-verified certificates
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="font-bold mb-2">3. Book AI Session</h4>
              <p className="text-blue-100 text-sm">
                Schedule your first 1:1 AI mentoring session for personalized guidance
              </p>
            </div>
          </div>
          
          <button className="mt-8 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Get Started Now
          </button>
        </div>

        {/* Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need help getting started? Our support team is here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              Contact Support
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              View Documentation
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;