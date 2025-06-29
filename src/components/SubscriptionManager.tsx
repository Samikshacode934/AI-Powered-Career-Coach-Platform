import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle, Settings, ExternalLink, Crown, Shield } from 'lucide-react';
import { stripeService, SubscriptionStatus } from '../services/stripeService';

interface SubscriptionManagerProps {
  userId: string;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ userId }) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [userId]);

  const fetchSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await stripeService.getSubscriptionStatus(userId);
      setSubscription(status);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsUpdating(true);
    try {
      const portalUrl = await stripeService.createCustomerPortalSession(
        userId,
        window.location.href
      );
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Unable to open billing portal. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      case 'incomplete': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'canceled': return <AlertCircle className="w-4 h-4" />;
      case 'past_due': return <AlertCircle className="w-4 h-4" />;
      case 'incomplete': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscription Found</h3>
          <p className="text-gray-600 mb-4">You're currently on the free plan.</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Current Subscription
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
            {getStatusIcon(subscription.status)}
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Plan Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900 capitalize">{subscription.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium capitalize ${
                  subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscription.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Billing</span>
                <span className="font-medium text-gray-900">
                  {subscription.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancels On</span>
                  <span className="font-medium text-red-600">
                    {subscription.currentPeriodEnd.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button
                onClick={handleManageBilling}
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    Manage Billing
                  </>
                )}
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200">
                <ExternalLink className="w-4 h-4" />
                View Invoices
              </button>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {subscription.status === 'past_due' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-900">Payment Past Due</h5>
                <p className="text-yellow-800 text-sm mt-1">
                  Your payment is overdue. Please update your payment method to continue using premium features.
                </p>
              </div>
            </div>
          </div>
        )}

        {subscription.cancelAtPeriodEnd && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-red-900">Subscription Ending</h5>
                <p className="text-red-800 text-sm mt-1">
                  Your subscription will end on {subscription.currentPeriodEnd.toLocaleDateString()}. 
                  You'll lose access to premium features unless you reactivate.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage & Features */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          Your Features
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Current Usage</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">AI Chat Sessions</span>
                  <span className="font-medium">
                    {subscription.plan === 'basic' ? '3/5 this month' : 'Unlimited'}
                  </span>
                </div>
                {subscription.plan === 'basic' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Video Minutes</span>
                  <span className="font-medium">
                    {subscription.plan === 'basic' ? '0/0' : 
                     subscription.plan === 'professional' ? '45/60 this month' : 'Unlimited'}
                  </span>
                </div>
                {subscription.plan === 'professional' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Available Features</h4>
            <div className="space-y-2">
              {[
                { feature: 'AI Chat Sessions', available: true },
                { feature: 'Video Mentoring', available: subscription.plan !== 'basic' },
                { feature: 'Blockchain Certificates', available: subscription.plan !== 'basic' },
                { feature: 'Premium Courses', available: subscription.plan !== 'basic' },
                { feature: 'Priority Support', available: subscription.plan !== 'basic' },
                { feature: 'Live 1:1 Sessions', available: subscription.plan === 'enterprise' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${item.available ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-sm ${item.available ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            Recent Billing
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {[
            { date: '2024-01-15', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
            { date: '2023-12-15', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
            { date: '2023-11-15', amount: '$29.00', status: 'Paid', invoice: 'INV-003' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{bill.amount}</p>
                  <p className="text-sm text-gray-500">{bill.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {bill.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;