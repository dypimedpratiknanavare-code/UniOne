import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Download, FileText, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BaseCrudService } from '@/integrations';
import { StudyMaterials } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMember } from '@/integrations';

export default function PremiumPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useMember();
  const [materials, setMaterials] = useState<StudyMaterials[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStream, setActiveStream] = useState('all');

  const streams = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical'];

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<StudyMaterials>('studymaterials');
      const premiumMaterials = result.items.filter(m => 
        m.accessLevel === 'Lite' || m.accessLevel === 'Medium' || m.accessLevel === 'Premium'
      );
      setMaterials(premiumMaterials);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMaterials = activeStream === 'all' 
    ? materials 
    : materials.filter(m => m.streamDepartment === activeStream);

  const handleAccess = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to access premium content' } });
    } else {
      navigate('/store');
    }
  };

  const getAccessLevelColor = (level?: string) => {
    switch (level) {
      case 'Lite': return 'text-accent-teal';
      case 'Medium': return 'text-primary';
      case 'Premium': return 'text-secondary';
      default: return 'text-foreground';
    }
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/10 rounded-2xl mb-6">
            <Crown className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="font-heading text-6xl text-foreground mb-6">
            Premium <span className="text-secondary">Notes</span>
          </h1>
          <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
            Access advanced study materials, comprehensive notes, and exclusive content for all engineering streams
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={activeStream === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveStream('all')}
              className={activeStream === 'all' ? 'bg-secondary text-secondary-foreground' : 'border-secondary/50 text-foreground'}
            >
              All Streams
            </Button>
            {streams.map((stream) => (
              <Button
                key={stream}
                variant={activeStream === stream ? 'default' : 'outline'}
                onClick={() => setActiveStream(stream)}
                className={activeStream === stream ? 'bg-secondary text-secondary-foreground' : 'border-secondary/50 text-foreground'}
              >
                {stream}
              </Button>
            ))}
          </div>
        </div>

        <div className="min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-20">
              <Lock className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
              <p className="font-paragraph text-foreground/60 mb-6">No premium materials available</p>
              <Button onClick={() => navigate('/store')} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Browse Plans
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredMaterials.map((material, index) => (
                <motion.div
                  key={material._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-glassmorphism-overlay backdrop-blur-sm border border-foreground/10 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-300 relative"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 bg-background/80 backdrop-blur-sm ${getAccessLevelColor(material.accessLevel)} text-xs font-paragraph rounded-full border border-current`}>
                      {material.accessLevel}
                    </span>
                  </div>

                  {material.thumbnailImage && (
                    <div className="relative">
                      <Image
                        src={material.thumbnailImage}
                        alt={material.title || 'Premium Material'}
                        width={400}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-secondary" />
                      <span className="font-paragraph text-sm text-secondary">{material.materialType}</span>
                    </div>
                    <h3 className="font-heading text-xl text-foreground mb-2">{material.title}</h3>
                    <p className="font-paragraph text-foreground/60 text-sm mb-4">{material.streamDepartment}</p>
                    
                    <Button
                      onClick={handleAccess}
                      className="w-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground border border-secondary/30"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {isAuthenticated ? 'Get Access' : 'Login to Access'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 rounded-3xl p-12 text-center border border-secondary/30"
          >
            <Lock className="h-12 w-12 text-secondary mx-auto mb-6" />
            <h2 className="font-heading text-4xl text-foreground mb-4">
              Unlock Premium Content
            </h2>
            <p className="font-paragraph text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Login to your account and subscribe to access advanced study materials and exclusive content
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/login')} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
                Login Now
              </Button>
              <Button onClick={() => navigate('/store')} variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg">
                View Plans
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
