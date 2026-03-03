import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BaseCrudService, useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { SubscriptionPlans } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function StorePage() {
  const [plans, setPlans] = useState<SubscriptionPlans[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<SubscriptionPlans>('subscriptionplans');
      setPlans(result.items);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const planFeatures: Record<string, string[]> = {
    'Lite': [
      'Foundation level content',
      'Basic notes and syllabus',
      'More than free content',
      'Email support',
      'Access to community forum'
    ],
    'Medium': [
      'All Lite features',
      'Intermediate level content',
      'Video tutorials',
      'Practice problems',
      'Priority email support',
      'Monthly webinars'
    ],
    'Premium': [
      'All Medium features',
      'Advanced topics coverage',
      'Complete engineering notes',
      'Live doubt sessions',
      'Project guidance',
      '24/7 priority support',
      'Career counseling',
      'Internship opportunities'
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-6xl text-foreground mb-6">
            UniOne <span className="text-secondary">Store</span>
          </h1>
          <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
            Choose the perfect plan to unlock premium study materials and advance your engineering journey
          </p>
        </motion.div>

        <div className="min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
              <p className="font-paragraph text-foreground/60">No plans available at the moment</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {plans.map((plan, index) => {
                const isAdding = addingItemId === plan._id;
                const planName = plan.itemName || '';
                const features = planFeatures[planName] || [];
                const isPremium = planName === 'Premium';

                return (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative bg-glassmorphism-overlay backdrop-blur-sm border ${
                      isPremium ? 'border-secondary/50 shadow-lg shadow-secondary/20' : 'border-foreground/10'
                    } rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300`}
                  >
                    {isPremium && (
                      <div className="absolute top-6 right-6 px-4 py-2 bg-secondary text-secondary-foreground text-xs font-paragraph rounded-full">
                        Most Popular
                      </div>
                    )}

                    {plan.itemImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={plan.itemImage}
                          alt={planName}
                          width={400}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      </div>
                    )}

                    <div className="p-8">
                      <h3 className="font-heading text-3xl text-foreground mb-2">{planName}</h3>
                      <p className="font-paragraph text-foreground/70 mb-6">{plan.itemDescription}</p>
                      
                      <div className="mb-8">
                        <span className="font-heading text-5xl text-primary">
                          {formatPrice(plan.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                        </span>
                        <span className="font-paragraph text-foreground/60 ml-2">/semester</span>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="font-paragraph text-foreground/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => actions.addToCart({ 
                          collectionId: 'subscriptionplans', 
                          itemId: plan._id 
                        })}
                        disabled={isAdding}
                        className={`w-full py-6 text-lg font-paragraph ${
                          isPremium
                            ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {isAdding ? (
                          <>
                            <LoadingSpinner />
                            <span className="ml-2">Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
