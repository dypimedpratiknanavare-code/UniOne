import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Phone, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { StudentProfiles } from '@/entities';

const COLLEGE_DOMAINS = ['@engineering.edu', '@tech.edu', '@college.edu'];
const STREAMS = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    collegeEmail: '',
    stream: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return COLLEGE_DOMAINS.some(domain => email.endsWith(domain));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.collegeEmail)) {
      setError('Please use a valid college domain email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const studentProfile: StudentProfiles = {
        _id: crypto.randomUUID(),
        studentName: formData.studentName,
        collegeEmail: formData.collegeEmail,
        stream: formData.stream,
        mobileNumber: formData.mobileNumber,
        digitalIdStatus: false
      };

      await BaseCrudService.create('studentprofiles', studentProfile);
      
      navigate('/login', { state: { message: 'Registration successful! Please login to continue.' } });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          className="max-w-2xl mx-auto"
        >
          <div className="bg-glassmorphism-overlay backdrop-blur-sm border border-foreground/10 rounded-3xl p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-heading text-4xl text-foreground mb-3">Student Registration</h1>
              <p className="font-paragraph text-foreground/70">Create your UniOne account to get started</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-6">
                <p className="font-paragraph text-destructive text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="studentName" className="font-paragraph text-foreground mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="studentName"
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="bg-background/50 border-foreground/20 text-foreground"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="collegeEmail" className="font-paragraph text-foreground mb-2 block">
                  College Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                  <Input
                    id="collegeEmail"
                    type="email"
                    required
                    value={formData.collegeEmail}
                    onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
                    className="bg-background/50 border-foreground/20 text-foreground pl-10"
                    placeholder="student@engineering.edu"
                  />
                </div>
                <p className="font-paragraph text-xs text-foreground/50 mt-2">
                  Must use college domain email
                </p>
              </div>

              <div>
                <Label htmlFor="stream" className="font-paragraph text-foreground mb-2 block">
                  Engineering Stream
                </Label>
                <Select value={formData.stream} onValueChange={(value) => setFormData({ ...formData, stream: value })}>
                  <SelectTrigger className="bg-background/50 border-foreground/20 text-foreground">
                    <SelectValue placeholder="Select your stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAMS.map((stream) => (
                      <SelectItem key={stream} value={stream}>
                        {stream}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mobileNumber" className="font-paragraph text-foreground mb-2 block">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                  <Input
                    id="mobileNumber"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="bg-background/50 border-foreground/20 text-foreground pl-10"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="font-paragraph text-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-background/50 border-foreground/20 text-foreground pl-10"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="font-paragraph text-foreground mb-2 block">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-background/50 border-foreground/20 text-foreground pl-10"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-paragraph"
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </Button>

              <p className="text-center font-paragraph text-foreground/70">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary hover:underline"
                >
                  Login here
                </button>
              </p>
            </form>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
