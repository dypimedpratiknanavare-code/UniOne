import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, CreditCard, MessageSquare, IdCard, User, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseCrudService, useMember } from '@/integrations';
import { StudyMaterials, ScholarshipUpdates, StudentProfiles } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { member } = useMember();
  const [materials, setMaterials] = useState<StudyMaterials[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipUpdates[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfiles | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    passportPhoto: '',
    signatureImage: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [materialsResult, scholarshipsResult, profilesResult] = await Promise.all([
        BaseCrudService.getAll<StudyMaterials>('studymaterials'),
        BaseCrudService.getAll<ScholarshipUpdates>('scholarshipupdates'),
        BaseCrudService.getAll<StudentProfiles>('studentprofiles')
      ]);

      setMaterials(materialsResult.items);
      setScholarships(scholarshipsResult.items);
      
      if (profilesResult.items.length > 0) {
        setStudentProfile(profilesResult.items[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile) return;

    setIsUpdatingProfile(true);
    try {
      await BaseCrudService.update<StudentProfiles>('studentprofiles', {
        _id: studentProfile._id,
        passportPhoto: profileForm.passportPhoto || studentProfile.passportPhoto,
        signatureImage: profileForm.signatureImage || studentProfile.signatureImage,
        digitalIdStatus: true
      });

      await loadDashboardData();
      setProfileForm({ passportPhoto: '', signatureImage: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const freeMaterials = materials.filter(m => m.accessLevel === 'Free');
  const premiumMaterials = materials.filter(m => m.accessLevel !== 'Free');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl text-foreground mb-4">
            Welcome, <span className="text-primary">{studentProfile?.studentName || member?.profile?.nickname || 'Student'}</span>
          </h1>
          <p className="font-paragraph text-xl text-foreground/70">
            Your personalized learning dashboard
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Free Materials</p>
                  <p className="font-heading text-3xl text-primary">{freeMaterials.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Premium Content</p>
                  <p className="font-heading text-3xl text-secondary">{premiumMaterials.length}</p>
                </div>
                <CreditCard className="h-10 w-10 text-secondary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Scholarships</p>
                  <p className="font-heading text-3xl text-accent-teal">{scholarships.length}</p>
                </div>
                <Award className="h-10 w-10 text-accent-teal/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Digital ID</p>
                  <p className="font-heading text-xl text-accent-magenta">
                    {studentProfile?.digitalIdStatus ? 'Active' : 'Pending'}
                  </p>
                </div>
                <IdCard className="h-10 w-10 text-accent-magenta/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="materials" className="font-paragraph">Materials</TabsTrigger>
            <TabsTrigger value="scholarships" className="font-paragraph">Scholarships</TabsTrigger>
            <TabsTrigger value="profile" className="font-paragraph">Profile</TabsTrigger>
            <TabsTrigger value="ai-chat" className="font-paragraph">AI Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl text-foreground mb-6">Free Learning Materials</h2>
                {freeMaterials.length === 0 ? (
                  <p className="font-paragraph text-foreground/60">No free materials available</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {freeMaterials.slice(0, 6).map((material) => (
                      <Card key={material._id} className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 hover:border-primary/50 transition-all">
                        <CardContent className="p-6">
                          {material.thumbnailImage && (
                            <Image src={material.thumbnailImage} alt={material.title || ''} width={300} className="w-full h-32 object-cover rounded-lg mb-4" />
                          )}
                          <h3 className="font-heading text-lg text-foreground mb-2">{material.title}</h3>
                          <p className="font-paragraph text-foreground/60 text-sm">{material.streamDepartment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-3xl text-foreground">Premium Content</h2>
                  {!studentProfile?.digitalIdStatus && (
                    <span className="px-4 py-2 bg-destructive/20 text-destructive text-sm font-paragraph rounded-lg">
                      Complete profile to purchase
                    </span>
                  )}
                </div>
                {premiumMaterials.length === 0 ? (
                  <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 p-12 text-center">
                    <p className="font-paragraph text-foreground/60 mb-6">No premium content available yet</p>
                    <Button onClick={() => navigate('/store')} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Browse Plans
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {premiumMaterials.slice(0, 6).map((material) => (
                      <Card key={material._id} className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 hover:border-secondary/50 transition-all">
                        <CardContent className="p-6">
                          {material.thumbnailImage && (
                            <Image src={material.thumbnailImage} alt={material.title || ''} width={300} className="w-full h-32 object-cover rounded-lg mb-4" />
                          )}
                          <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-paragraph rounded mb-2 inline-block">
                            {material.accessLevel}
                          </span>
                          <h3 className="font-heading text-lg text-foreground mb-2">{material.title}</h3>
                          <p className="font-paragraph text-foreground/60 text-sm">{material.streamDepartment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scholarships">
            <h2 className="font-heading text-3xl text-foreground mb-6">Scholarship Updates</h2>
            {scholarships.length === 0 ? (
              <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 p-12 text-center">
                <Award className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
                <p className="font-paragraph text-foreground/60">No scholarship updates available</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship._id} className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 hover:border-accent-teal/50 transition-all">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-heading text-2xl text-foreground mb-2">{scholarship.scholarshipName}</h3>
                          <p className="font-paragraph text-primary">{scholarship.scholarshipProvider}</p>
                        </div>
                        <Award className="h-8 w-8 text-accent-teal" />
                      </div>
                      <p className="font-paragraph text-foreground/70 mb-4">{scholarship.eligibilityCriteria}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-sm text-foreground/60">
                          Deadline: {scholarship.applicationDeadline && new Date(scholarship.applicationDeadline).toLocaleDateString()}
                        </span>
                        {scholarship.applicationLink && (
                          <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-accent-teal text-primary-foreground hover:bg-accent-teal/90">
                              Apply Now
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl text-foreground mb-6">Student Profile</h2>
              
              {studentProfile && (
                <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 mb-8">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="font-paragraph text-foreground/60 text-sm">Name</Label>
                        <p className="font-paragraph text-foreground text-lg">{studentProfile.studentName}</p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-foreground/60 text-sm">Email</Label>
                        <p className="font-paragraph text-foreground text-lg">{studentProfile.collegeEmail}</p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-foreground/60 text-sm">Stream</Label>
                        <p className="font-paragraph text-foreground text-lg">{studentProfile.stream}</p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-foreground/60 text-sm">Mobile</Label>
                        <p className="font-paragraph text-foreground text-lg">{studentProfile.mobileNumber}</p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-foreground/60 text-sm">Digital ID Status</Label>
                        <p className={`font-paragraph text-lg ${studentProfile.digitalIdStatus ? 'text-primary' : 'text-destructive'}`}>
                          {studentProfile.digitalIdStatus ? 'Active' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!studentProfile?.digitalIdStatus && (
                <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-foreground">Complete Your Profile</CardTitle>
                    <p className="font-paragraph text-foreground/60">Upload your documents to generate digital student ID</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <Label htmlFor="passportPhoto" className="font-paragraph text-foreground mb-2 block">
                          Passport Photo URL
                        </Label>
                        <Input
                          id="passportPhoto"
                          type="url"
                          value={profileForm.passportPhoto}
                          onChange={(e) => setProfileForm({ ...profileForm, passportPhoto: e.target.value })}
                          className="bg-background/50 border-foreground/20 text-foreground"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="signatureImage" className="font-paragraph text-foreground mb-2 block">
                          Signature Image URL
                        </Label>
                        <Input
                          id="signatureImage"
                          type="url"
                          value={profileForm.signatureImage}
                          onChange={(e) => setProfileForm({ ...profileForm, signatureImage: e.target.value })}
                          className="bg-background/50 border-foreground/20 text-foreground"
                          placeholder="https://example.com/signature.jpg"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-paragraph"
                      >
                        {isUpdatingProfile ? 'Updating...' : 'Generate Digital ID'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-chat">
            <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="font-heading text-3xl text-foreground flex items-center">
                  <MessageSquare className="h-8 w-8 text-accent-magenta mr-3" />
                  AI Study Assistant
                </CardTitle>
                <p className="font-paragraph text-foreground/60">Get instant help with your studies</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-background/50 rounded-xl p-8 min-h-[400px] mb-6 border border-foreground/10">
                  <p className="font-paragraph text-foreground/60 text-center">AI chat interface coming soon...</p>
                </div>
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Ask me anything about your studies..."
                    className="bg-background/50 border-foreground/20 text-foreground resize-none"
                    rows={3}
                  />
                  <Button className="bg-accent-magenta text-primary-foreground hover:bg-accent-magenta/90 px-8">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
