import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, FileText, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseCrudService } from '@/integrations';
import { StudyMaterials, Announcements } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMember } from '@/integrations';

export default function ExploreFreePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useMember();
  const [materials, setMaterials] = useState<StudyMaterials[]>([]);
  const [announcements, setAnnouncements] = useState<Announcements[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStream, setActiveStream] = useState('all');

  const streams = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [materialsResult, announcementsResult] = await Promise.all([
        BaseCrudService.getAll<StudyMaterials>('studymaterials'),
        BaseCrudService.getAll<Announcements>('announcements')
      ]);
      
      const freeMaterials = materialsResult.items.filter(m => m.accessLevel === 'Free');
      setMaterials(freeMaterials);
      setAnnouncements(announcementsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to download materials' } });
    }
  };

  const filteredMaterials = activeStream === 'all' 
    ? materials 
    : materials.filter(m => m.streamDepartment === activeStream);

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
            Explore <span className="text-primary">Free Content</span>
          </h1>
          <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
            Access syllabus, notes, and announcements across all engineering streams
          </p>
        </motion.div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="materials" className="font-paragraph">Study Materials</TabsTrigger>
            <TabsTrigger value="announcements" className="font-paragraph">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant={activeStream === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveStream('all')}
                  className={activeStream === 'all' ? 'bg-primary text-primary-foreground' : 'border-primary/50 text-foreground'}
                >
                  All Streams
                </Button>
                {streams.map((stream) => (
                  <Button
                    key={stream}
                    variant={activeStream === stream ? 'default' : 'outline'}
                    onClick={() => setActiveStream(stream)}
                    className={activeStream === stream ? 'bg-primary text-primary-foreground' : 'border-primary/50 text-foreground'}
                  >
                    {stream}
                  </Button>
                ))}
              </div>
            </div>

            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <LoadingSpinner />
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
                  <p className="font-paragraph text-foreground/60">No materials available</p>
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
                      className="bg-glassmorphism-overlay backdrop-blur-sm border border-foreground/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                    >
                      {material.thumbnailImage && (
                        <Image
                          src={material.thumbnailImage}
                          alt={material.title || 'Study Material'}
                          width={400}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="font-paragraph text-sm text-primary">{material.materialType}</span>
                        </div>
                        <h3 className="font-heading text-xl text-foreground mb-2">{material.title}</h3>
                        <p className="font-paragraph text-foreground/60 text-sm mb-4">{material.streamDepartment}</p>
                        <Button
                          onClick={handleDownload}
                          className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {isAuthenticated ? 'Download' : 'Login to Download'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <LoadingSpinner />
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-20">
                  <Bell className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
                  <p className="font-paragraph text-foreground/60">No announcements available</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-glassmorphism-overlay backdrop-blur-sm border ${
                        announcement.isUrgent ? 'border-destructive/50' : 'border-foreground/10'
                      } rounded-2xl p-8`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Bell className={`h-6 w-6 ${announcement.isUrgent ? 'text-destructive' : 'text-primary'}`} />
                          <h3 className="font-heading text-2xl text-foreground">{announcement.title}</h3>
                        </div>
                        {announcement.isUrgent && (
                          <span className="px-3 py-1 bg-destructive/20 text-destructive text-xs font-paragraph rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="font-paragraph text-foreground/80 mb-4 leading-relaxed">{announcement.content}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-paragraph text-foreground/60">{announcement.stream}</span>
                        <span className="font-paragraph text-foreground/60">
                          {announcement.announcementDate && new Date(announcement.announcementDate).toLocaleDateString()}
                        </span>
                      </div>
                      {announcement.externalLink && (
                        <a
                          href={announcement.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-primary hover:underline font-paragraph"
                        >
                          Learn More →
                        </a>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
