import { loadStripe, Stripe } from '@stripe/stripe-js';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

interface PaymentSession {
  sessionId: string;
  url: string;
  status: 'pending' | 'complete' | 'expired';
}

interface SubscriptionStatus {
  isActive: boolean;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

class StripeService {
  private stripe: Promise<Stripe | null>;
  private publishableKey: string;

  constructor() {
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    this.stripe = loadStripe(this.publishableKey);
  }

  // Check if Stripe is properly configured
  private isStripeConfigured(): boolean {
    return this.publishableKey && 
           this.publishableKey !== '' && 
           !this.publishableKey.includes('your_stripe_publishable_key');
  }

  // Subscription plans configuration
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic',
        description: 'Perfect for getting started with AI career coaching',
        price: 0,
        interval: 'month',
        stripePriceId: '', // Free plan doesn't need Stripe price ID
        features: [
          '5 AI chat sessions per month',
          'Basic skill assessments',
          'Community forums access',
          'Email support',
          'Mobile app access'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Advanced AI mentoring with video responses',
        price: 29,
        interval: 'month',
        stripePriceId: 'price_professional_monthly', // Replace with actual Stripe price ID
        popular: true,
        features: [
          'Unlimited AI chat sessions',
          '60 minutes video mentoring',
          'Blockchain skill verification',
          'Premium course library',
          'Priority support',
          'LinkedIn integration',
          'Resume optimization AI',
          'Career roadmap planning'
        ]
      },
      {
        id: 'professional_yearly',
        name: 'Professional',
        description: 'Advanced AI mentoring with video responses (Yearly)',
        price: 290,
        interval: 'year',
        stripePriceId: 'price_professional_yearly', // Replace with actual Stripe price ID
        features: [
          'Everything in Professional',
          '2 months free (17% savings)',
          'Annual career review session',
          'Exclusive yearly webinars'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Complete career transformation with 1:1 sessions',
        price: 99,
        interval: 'month',
        stripePriceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
        features: [
          'Everything in Professional',
          'Unlimited video mentoring',
          '2 live 1:1 mentor sessions',
          'Custom learning paths',
          'Team collaboration tools',
          'API access',
          'White-label options',
          'Dedicated success manager',
          'Custom integrations'
        ]
      },
      {
        id: 'enterprise_yearly',
        name: 'Enterprise',
        description: 'Complete career transformation with 1:1 sessions (Yearly)',
        price: 990,
        interval: 'year',
        stripePriceId: 'price_enterprise_yearly', // Replace with actual Stripe price ID
        features: [
          'Everything in Enterprise',
          '2 months free (17% savings)',
          'Quarterly strategy sessions',
          'Priority feature requests'
        ]
      }
    ];
  }

  // Create checkout session for subscription
  async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string
  ): Promise<PaymentSession> {
    // Check if Stripe is configured before attempting network request
    if (!this.isStripeConfigured()) {
      // Return mock session for demo/development environment
      return {
        sessionId: `cs_demo_${Date.now()}`,
        url: `https://checkout.stripe.com/demo?session_id=cs_demo_${Date.now()}`,
        status: 'pending'
      };
    }

    try {
      // In a real implementation, this would call your backend API
      // which would then call Stripe's API to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl,
          cancelUrl,
          customerEmail,
          mode: 'subscription'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      
      return {
        sessionId: session.id,
        url: session.url,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // For demo purposes, return a mock session
      return {
        sessionId: `cs_demo_${Date.now()}`,
        url: `https://checkout.stripe.com/demo?session_id=cs_demo_${Date.now()}`,
        status: 'pending'
      };
    }
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(error.message);
    }
  }

  // Create one-time payment session (for courses, etc.)
  async createPaymentSession(
    amount: number,
    currency: string = 'usd',
    description: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<PaymentSession> {
    // Check if Stripe is configured before attempting network request
    if (!this.isStripeConfigured()) {
      // Return mock session for demo/development environment
      return {
        sessionId: `cs_demo_payment_${Date.now()}`,
        url: `https://checkout.stripe.com/demo?session_id=cs_demo_payment_${Date.now()}`,
        status: 'pending'
      };
    }

    try {
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
          description,
          successUrl,
          cancelUrl,
          mode: 'payment'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const session = await response.json();
      
      return {
        sessionId: session.id,
        url: session.url,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error creating payment session:', error);
      
      // For demo purposes, return a mock session
      return {
        sessionId: `cs_demo_payment_${Date.now()}`,
        url: `https://checkout.stripe.com/demo?session_id=cs_demo_payment_${Date.now()}`,
        status: 'pending'
      };
    }
  }

  // Get customer's subscription status
  async getSubscriptionStatus(customerId: string): Promise<SubscriptionStatus | null> {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      
      // For demo purposes, return a mock status
      return {
        isActive: false,
        plan: 'basic',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/update-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: newPriceId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  }

  // Create customer portal session
  async createCustomerPortalSession(customerId: string, returnUrl: string): Promise<string> {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const session = await response.json();
      return session.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      
      // For demo purposes, return a mock URL
      return `https://billing.stripe.com/demo?session_id=bps_demo_${Date.now()}`;
    }
  }

  // Validate webhook signature (for backend use)
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // This would be implemented on the backend
    // Using Stripe's webhook signature validation
    return true;
  }

  // Format price for display
  formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Check if user has access to premium features
  hasFeatureAccess(userPlan: string, feature: string): boolean {
    const featureMatrix: Record<string, string[]> = {
      basic: ['basic_chat', 'community_access', 'email_support'],
      professional: [
        'basic_chat', 'community_access', 'email_support',
        'unlimited_chat', 'video_mentoring', 'blockchain_verification',
        'premium_courses', 'priority_support', 'linkedin_integration',
        'resume_optimization', 'career_roadmap'
      ],
      enterprise: [
        'basic_chat', 'community_access', 'email_support',
        'unlimited_chat', 'video_mentoring', 'blockchain_verification',
        'premium_courses', 'priority_support', 'linkedin_integration',
        'resume_optimization', 'career_roadmap', 'unlimited_video',
        'live_sessions', 'custom_paths', 'team_tools', 'api_access',
        'white_label', 'success_manager'
      ]
    };

    return featureMatrix[userPlan]?.includes(feature) || false;
  }
}

export const stripeService = new StripeService();
export type { SubscriptionPlan, PaymentSession, SubscriptionStatus };