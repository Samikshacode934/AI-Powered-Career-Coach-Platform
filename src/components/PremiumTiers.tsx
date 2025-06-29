import React, { useState, useEffect } from 'react';
import { Crown, Check, Star, Zap, MessageCircle, Video, Award, BookOpen, Users, Infinity, CreditCard, Shield, ArrowRight } from 'lucide-react';
import { stripeService, SubscriptionPlan } from '../services/stripeService';

const PremiumTiers: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const subscriptionPlans = stripeService.getSubscriptionPlans();
    setPlans(subscriptionPlans);
  }, []);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      // Handle free plan signup
      alert('Free plan activated! You can now access basic features.');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(plan.id);

    try {
      const successUrl = `${window.location.origin}/success?plan=${plan.id}`;
      const cancelUrl = `${window.location.origin}/premium`;

      const session = await stripeService.createCheckoutSession(
        plan.stripePriceId,
        successUrl,
        cancelUrl,
        'user@example.com' // In real app, get from user context
      );

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const getDisplayPlans = () => {
    return plans.filter(plan => {
      if (billingCycle === 'monthly') {
        return plan.interval === 'month';
      } else {
        // For yearly, show yearly plans if available, otherwise monthly
        const yearlyVersion = plans.find(p => 
          p.name === plan.name && p.interval === 'year'
        );
        return yearlyVersion ? plan.interval === 'year' : plan.interval === 'month';
      }
    });
  };

  const getSavingsText = (plan: SubscriptionPlan) => {
    if (plan.interval === 'year') {
      const monthlyEquivalent = (plan.price / 12);
      const monthlyPlan = plans.find(p => 
        p.name === plan.name && p.interval === 'month'
      );
      if (monthlyPlan) {
        const savings = Math.round(((monthlyPlan.price * 12 - plan.price) / (monthlyPlan.price * 12)) * 100);
        return `Save ${savings}% (${stripeService.formatPrice(monthlyPlan.price * 12 - plan.price)} per year)`;
      }
    }
    return null;
  };

  const premiumFeatures = [
    {
      icon: MessageCircle,
      title: 'Advanced AI Conversations',
      description: 'Deep, contextual discussions with industry-specific AI mentors',
      plans: ['professional', 'enterprise']
    },
    {
      icon: Video,
      title: 'Personalized Video Responses',
      description: 'Custom video advice from real industry experts and AI avatars',
      plans: ['professional', 'enterprise']
    },
    {
      icon: Award,
      title: 'Blockchain Credentials',
      description: 'Verifiable skill badges and NFTs for your professional portfolio',
      plans: ['professional', 'enterprise']
    },
    {
      icon: BookOpen,
      title: 'Exclusive Content Library',
      description: 'Access to premium courses, templates, and industry insights',
      plans: ['professional', 'enterprise']
    },
    {
      icon: Users,
      title: 'Expert Network Access',
      description: 'Connect with senior professionals and industry leaders',
      plans: ['enterprise']
    },
    {
      icon: Zap,
      title: 'Priority Processing',
      description: 'Faster responses and premium AI model access',
      plans: ['professional', 'enterprise']
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Wong',
      role: 'Senior Product Manager',
      company: 'Meta',
      content: 'The Professional tier helped me land my dream job at Meta. The AI coaching was incredibly insightful.',
      rating: 5,
      plan: 'Professional'
    },
    {
      name: 'David Kim',
      role: 'Engineering Director',
      company: 'Netflix',
      content: 'Enterprise tier gave me the strategic guidance I needed to transition into leadership.',
      rating: 5,
      plan: 'Enterprise'
    },
    {
      name: 'Sarah Chen',
      role: 'Data Scientist',
      company: 'Google',
      content: 'The blockchain certificates opened doors I never thought possible. ROI was immediate.',
      rating: 5,
      plan: 'Professional'
    }
  ];

  const displayPlans = getDisplayPlans();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unlock Your Career Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan to accelerate your professional growth with AI-powered mentoring,
            blockchain credentials, and exclusive expert content.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure payments with Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Blockchain verified certificates</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>15,000+ professionals trust us</span>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 p-1 bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {displayPlans.map((plan, index) => {
            const isPopular = plan.popular;
            const savings = getSavingsText(plan);
            const isLoading_plan = isLoading && selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
                  isPopular 
                    ? 'border-blue-500 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${
                    plan.name === 'Basic' ? 'from-gray-500 to-gray-600' :
                    plan.name === 'Professional' ? 'from-blue-500 to-purple-500' :
                    'from-orange-500 to-red-500'
                  } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : stripeService.formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 ml-2">
                        /{plan.interval === 'month' ? 'month' : 'year'}
                      </span>
                    )}
                    {savings && (
                      <div className="text-green-600 text-sm font-medium mt-2">
                        {savings}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isLoading_plan}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLoading_plan
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isPopular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                      : plan.price === 0
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isLoading_plan ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {plan.price === 0 ? 'Get Started Free' : 'Upgrade Now'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Usage Limits */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">AI Sessions</span>
                      <p className="font-medium">
                        {plan.name === 'Basic' ? '5/month' : 'Unlimited'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Video Minutes</span>
                      <p className="font-medium">
                        {plan.name === 'Basic' ? '0' : 
                         plan.name === 'Professional' ? '60/month' : 'Unlimited'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Features
            </h2>
            <p className="text-xl text-gray-600">
              Unlock advanced capabilities designed for serious professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {feature.plans.map(planName => (
                    <span
                      key={planName}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {planName.charAt(0).toUpperCase() + planName.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how professionals are transforming their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {testimonial.plan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Trust */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Secure & Trusted
            </h2>
            <p className="text-xl text-gray-600">
              Your payments and data are protected with industry-leading security
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Stripe Security</h4>
              <p className="text-gray-600 text-sm">Bank-level encryption</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Blockchain Verified</h4>
              <p className="text-gray-600 text-sm">Tamper-proof certificates</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">15K+ Users</h4>
              <p className="text-gray-600 text-sm">Trusted by professionals</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Instant Access</h4>
              <p className="text-gray-600 text-sm">Immediate activation</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3">Are the certificates really blockchain verified?</h4>
              <p className="text-gray-600">Yes, all certificates are minted as NFTs on the Algorand blockchain, making them permanently verifiable and tamper-proof.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, debit cards, and digital wallets through our secure Stripe integration.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3">Is there a free trial?</h4>
              <p className="text-gray-600">Yes! Our Basic plan is completely free forever. You can also try Premium features with our 7-day free trial.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who are already accelerating their growth
          </p>
          <button 
            onClick={() => handleUpgrade(displayPlans.find(p => p.popular) || displayPlans[1])}
            className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-3xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <CreditCard className="w-6 h-6" />
            Start Your 7-Day Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required for free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumTiers;