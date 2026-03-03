import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMember } from '@/integrations';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useMember();
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'admin') {
      if (formData.email === 'admin@unione.edu' && formData.password === 'admin123') {
        actions.login();
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      actions.login();
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
          className="max-w-xl mx-auto"
        >
          <div className="bg-glassmorphism-overlay backdrop-blur-sm border border-foreground/10 rounded-3xl p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-heading text-4xl text-foreground mb-3">Welcome Back</h1>
              <p className="font-paragraph text-foreground/70">Login to access your dashboard</p>
            </div>

            {successMessage && (
              <div className="bg-primary/10 border border-primary/50 rounded-lg p-4 mb-6">
                <p className="font-paragraph text-primary text-sm">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-6">
                <p className="font-paragraph text-destructive text-sm">{error}</p>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="student" className="font-paragraph">Student Login</TabsTrigger>
                <TabsTrigger value="admin" className="font-paragraph">Admin Login</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="student-email" className="font-paragraph text-foreground mb-2 block">
                      College Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                      <Input
                        id="student-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground pl-10"
                        placeholder="student@engineering.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="student-password" className="font-paragraph text-foreground mb-2 block">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                      <Input
                        id="student-password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground pl-10"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-paragraph"
                  >
                    Login as Student
                  </Button>

                  <p className="text-center font-paragraph text-foreground/70">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-primary hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="admin-email" className="font-paragraph text-foreground mb-2 block">
                      Admin Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                      <Input
                        id="admin-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground pl-10"
                        placeholder="admin@unione.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admin-password" className="font-paragraph text-foreground mb-2 block">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                      <Input
                        id="admin-password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-background/50 border-foreground/20 text-foreground pl-10"
                        placeholder="Enter admin password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-6 text-lg font-paragraph"
                  >
                    Login as Admin
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
