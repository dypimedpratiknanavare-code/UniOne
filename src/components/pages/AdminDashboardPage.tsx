import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, DollarSign, Users, BookOpen, Bell } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseCrudService } from '@/integrations';
import { StudyMaterials, Announcements, PaymentTransactions, StudentProfiles } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const STREAMS = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical'];
const MATERIAL_TYPES = ['Notes', 'Syllabus', 'Question Paper', 'Reference Book'];
const ACCESS_LEVELS = ['Free', 'Lite', 'Medium', 'Premium'];

export default function AdminDashboardPage() {
  const [materials, setMaterials] = useState<StudyMaterials[]>([]);
  const [announcements, setAnnouncements] = useState<Announcements[]>([]);
  const [payments, setPayments] = useState<PaymentTransactions[]>([]);
  const [students, setStudents] = useState<StudentProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  const [materialForm, setMaterialForm] = useState({
    title: '',
    streamDepartment: '',
    materialType: '',
    accessLevel: '',
    fileUrl: '',
    thumbnailImage: ''
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    stream: '',
    isUrgent: false,
    announcementDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [materialsResult, announcementsResult, paymentsResult, studentsResult] = await Promise.all([
        BaseCrudService.getAll<StudyMaterials>('studymaterials'),
        BaseCrudService.getAll<Announcements>('announcements'),
        BaseCrudService.getAll<PaymentTransactions>('paymenttransactions'),
        BaseCrudService.getAll<StudentProfiles>('studentprofiles')
      ]);

      setMaterials(materialsResult.items);
      setAnnouncements(announcementsResult.items);
      setPayments(paymentsResult.items);
      setStudents(studentsResult.items);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMaterial: StudyMaterials = {
        _id: crypto.randomUUID(),
        ...materialForm
      };
      await BaseCrudService.create('studymaterials', newMaterial);
      await loadDashboardData();
      setMaterialForm({ title: '', streamDepartment: '', materialType: '', accessLevel: '', fileUrl: '', thumbnailImage: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await BaseCrudService.delete('studymaterials', id);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAnnouncement: Announcements = {
        _id: crypto.randomUUID(),
        ...announcementForm
      };
      await BaseCrudService.create('announcements', newAnnouncement);
      await loadDashboardData();
      setAnnouncementForm({ title: '', content: '', stream: '', isUrgent: false, announcementDate: new Date().toISOString().split('T')[0] });
      setIsAnnouncementDialogOpen(false);
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await BaseCrudService.delete('announcements', id);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

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
            Admin <span className="text-secondary">Dashboard</span>
          </h1>
          <p className="font-paragraph text-xl text-foreground/70">
            Manage content, monitor payments, and oversee platform operations
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Total Students</p>
                  <p className="font-heading text-3xl text-primary">{students.length}</p>
                </div>
                <Users className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Study Materials</p>
                  <p className="font-heading text-3xl text-secondary">{materials.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-secondary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Total Revenue</p>
                  <p className="font-heading text-3xl text-accent-teal">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-10 w-10 text-accent-teal/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-foreground/60 text-sm mb-1">Announcements</p>
                  <p className="font-heading text-3xl text-accent-magenta">{announcements.length}</p>
                </div>
                <Bell className="h-10 w-10 text-accent-magenta/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="materials" className="font-paragraph">Materials</TabsTrigger>
            <TabsTrigger value="announcements" className="font-paragraph">Announcements</TabsTrigger>
            <TabsTrigger value="payments" className="font-paragraph">Payments</TabsTrigger>
            <TabsTrigger value="students" className="font-paragraph">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-heading text-3xl text-foreground">Study Materials Management</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-foreground/10 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-foreground">Add New Study Material</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMaterial} className="space-y-4">
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">Title</Label>
                      <Input
                        required
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-paragraph text-foreground mb-2 block">Stream</Label>
                        <Select value={materialForm.streamDepartment} onValueChange={(value) => setMaterialForm({ ...materialForm, streamDepartment: value })}>
                          <SelectTrigger className="bg-background/50 border-foreground/20 text-foreground">
                            <SelectValue placeholder="Select stream" />
                          </SelectTrigger>
                          <SelectContent>
                            {STREAMS.map((stream) => (
                              <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="font-paragraph text-foreground mb-2 block">Material Type</Label>
                        <Select value={materialForm.materialType} onValueChange={(value) => setMaterialForm({ ...materialForm, materialType: value })}>
                          <SelectTrigger className="bg-background/50 border-foreground/20 text-foreground">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIAL_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">Access Level</Label>
                      <Select value={materialForm.accessLevel} onValueChange={(value) => setMaterialForm({ ...materialForm, accessLevel: value })}>
                        <SelectTrigger className="bg-background/50 border-foreground/20 text-foreground">
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCESS_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">File URL</Label>
                      <Input
                        type="url"
                        value={materialForm.fileUrl}
                        onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">Thumbnail Image URL</Label>
                      <Input
                        type="url"
                        value={materialForm.thumbnailImage}
                        onChange={(e) => setMaterialForm({ ...materialForm, thumbnailImage: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground"
                        placeholder="https://static.wixstatic.com/media/7a858b_4247c31eced54f62bdfa30d214f4780b~mv2.png?originWidth=384&originHeight=256"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6">
                      Add Material
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {materials.map((material) => (
                <Card key={material._id} className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl text-foreground">{material.title}</h3>
                          <span className={`px-3 py-1 text-xs font-paragraph rounded-full ${
                            material.accessLevel === 'Free' ? 'bg-primary/20 text-primary' :
                            material.accessLevel === 'Lite' ? 'bg-accent-teal/20 text-accent-teal' :
                            material.accessLevel === 'Medium' ? 'bg-secondary/20 text-secondary' :
                            'bg-accent-magenta/20 text-accent-magenta'
                          }`}>
                            {material.accessLevel}
                          </span>
                        </div>
                        <div className="flex gap-6 font-paragraph text-foreground/60 text-sm">
                          <span>{material.streamDepartment}</span>
                          <span>{material.materialType}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMaterial(material._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-heading text-3xl text-foreground">Announcements Management</h2>
              <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-foreground/10 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-foreground">Create New Announcement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAnnouncement} className="space-y-4">
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">Title</Label>
                      <Input
                        required
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">Content</Label>
                      <Textarea
                        required
                        value={announcementForm.content}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label className="font-paragraph text-foreground mb-2 block">Stream</Label>
                      <Select value={announcementForm.stream} onValueChange={(value) => setAnnouncementForm({ ...announcementForm, stream: value })}>
                        <SelectTrigger className="bg-background/50 border-foreground/20 text-foreground">
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Streams</SelectItem>
                          {STREAMS.map((stream) => (
                            <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isUrgent"
                        checked={announcementForm.isUrgent}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, isUrgent: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="isUrgent" className="font-paragraph text-foreground">Mark as Urgent</Label>
                    </div>
                    <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-6">
                      Create Announcement
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement._id} className={`bg-glassmorphism-overlay backdrop-blur-sm border ${announcement.isUrgent ? 'border-destructive/50' : 'border-foreground/10'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl text-foreground">{announcement.title}</h3>
                          {announcement.isUrgent && (
                            <span className="px-3 py-1 bg-destructive/20 text-destructive text-xs font-paragraph rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="font-paragraph text-foreground/70 mb-3">{announcement.content}</p>
                        <div className="flex gap-6 font-paragraph text-foreground/60 text-sm">
                          <span>{announcement.stream}</span>
                          <span>{announcement.announcementDate && new Date(announcement.announcementDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <h2 className="font-heading text-3xl text-foreground mb-8">Payment Transactions</h2>
            <div className="space-y-4">
              {payments.length === 0 ? (
                <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 p-12 text-center">
                  <DollarSign className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
                  <p className="font-paragraph text-foreground/60">No payment transactions yet</p>
                </Card>
              ) : (
                payments.map((payment) => (
                  <Card key={payment._id} className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-heading text-lg text-foreground mb-1">{payment.studentReference}</h3>
                          <p className="font-paragraph text-foreground/60 text-sm">{payment.planPurchased}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-2xl text-primary mb-1">₹{payment.amount}</p>
                          <span className={`px-3 py-1 text-xs font-paragraph rounded-full ${
                            payment.paymentStatus === 'Completed' ? 'bg-primary/20 text-primary' :
                            payment.paymentStatus === 'Pending' ? 'bg-accent-teal/20 text-accent-teal' :
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {payment.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-6 font-paragraph text-foreground/60 text-sm">
                        <span>{payment.paymentMethod}</span>
                        <span>{payment.transactionDate && new Date(payment.transactionDate).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="students">
            <h2 className="font-heading text-3xl text-foreground mb-8">Student Profiles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.length === 0 ? (
                <Card className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10 p-12 text-center col-span-full">
                  <Users className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
                  <p className="font-paragraph text-foreground/60">No students registered yet</p>
                </Card>
              ) : (
                students.map((student) => (
                  <Card key={student._id} className="bg-glassmorphism-overlay backdrop-blur-sm border-foreground/10">
                    <CardContent className="p-6">
                      <h3 className="font-heading text-xl text-foreground mb-2">{student.studentName}</h3>
                      <div className="space-y-2 font-paragraph text-foreground/70 text-sm">
                        <p>{student.collegeEmail}</p>
                        <p>{student.stream}</p>
                        <p>{student.mobileNumber}</p>
                        <div className="pt-2">
                          <span className={`px-3 py-1 text-xs font-paragraph rounded-full ${
                            student.digitalIdStatus ? 'bg-primary/20 text-primary' : 'bg-foreground/20 text-foreground/60'
                          }`}>
                            {student.digitalIdStatus ? 'ID Active' : 'ID Pending'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
