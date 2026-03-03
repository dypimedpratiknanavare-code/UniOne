// HPI 1.7-G
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Shield, 
  Zap, 
  Cpu, 
  Globe, 
  Database, 
  Lock, 
  ChevronRight, 
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

// --- CANONICAL DATA SOURCES ---
// Preserving original data while enriching for the "Quantum Interface" vision
const FEATURES_DATA = [
  {
    id: 'content',
    icon: BookOpen,
    title: 'Free Content Access',
    description: 'Unrestricted access to syllabus copies, lecture notes, and stream-specific announcements. Read-only mode enabled for guest users.',
    color: 'primary',
    stat: '1000+ Docs'
  },
  {
    id: 'premium',
    icon: GraduationCap,
    title: 'Premium Modules',
    description: 'Advanced engineering topics, comprehensive coverage, and exclusive study materials available through tiered subscription plans.',
    color: 'secondary',
    stat: 'Pro Access'
  },
  {
    id: 'identity',
    icon: Shield,
    title: 'Digital Identity',
    description: 'Blockchain-verified digital student IDs. Secure, portable, and instantly verifiable for campus access and exams.',
    color: 'accent-teal',
    stat: 'Verifiable'
  },
  {
    id: 'ai',
    icon: Zap,
    title: 'AI Neural Assistant',
    description: '24/7 academic support powered by our custom LLM. Get instant answers to complex engineering queries.',
    color: 'accent-magenta',
    stat: 'Online'
  }
];

const PRICING_PLANS = [
  {
    name: 'Lite Access',
    price: 'Free',
    description: 'Essential foundation level content.',
    features: ['Syllabus Access', 'Basic Notes', 'Public Announcements', 'Read-Only Mode'],
    highlight: false,
    color: 'primary'
  },
  {
    name: 'Medium Tier',
    price: '$9.99',
    description: 'Enhanced learning materials.',
    features: ['All Lite Features', 'Downloadable Content', 'Practice Sets', 'Priority Support'],
    highlight: true,
    color: 'secondary'
  },
  {
    name: 'Premium Core',
    price: '$19.99',
    description: 'Advanced engineering mastery.',
    features: ['Full Archive Access', 'AI Tutor Unlimited', 'Advanced Topics', 'Certification Prep'],
    highlight: false,
    color: 'accent-magenta'
  }
];

const ANNOUNCEMENTS_TICKER = [
  "System Update: Engineering Mathematics Module v2.4 Live",
  "Scholarship Alert: Global Tech Initiative Applications Open",
  "Exam Schedule: Computer Science Stream - Final Term",
  "New Feature: Dark Mode IDE Integration Available"
];

// --- UTILITY COMPONENTS ---

const ScifiBorder = ({ className = "", children }: { className?: string, children: React.ReactNode }) => (
  <div className={`relative group ${className}`}>
    {/* Corner Accents */}
    <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors duration-300" />
    <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors duration-300" />
    <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors duration-300" />
    <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors duration-300" />
    
    {/* Content */}
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

const GlitchText = ({ text }: { text: string }) => {
  return (
    <span className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-secondary opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </span>
  );
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-clip selection:bg-primary/30 selection:text-primary-foreground font-paragraph">
      <style>{`
        .clip-tech {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
        }
        .clip-tech-inverse {
          clip-path: polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 15%);
        }
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>

      <Header />

      {/* --- HERO SECTION: THE QUANTUM NEXUS --- */}
      <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Grid */}
        <motion.div 
          style={{ y: yBackground }}
          className="absolute inset-0 grid-bg pointer-events-none z-0" 
        />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        <div className="container relative z-10 px-6 mx-auto h-full flex flex-col justify-center">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content */}
            <motion.div 
              style={{ opacity: opacityHero }}
              className="lg:col-span-7 space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                <div className="h-[1px] w-12 bg-primary" />
                <span className="text-primary font-mono text-sm tracking-widest uppercase">System Online v2.4</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
              >
                ENGINEERING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">
                  INTELLIGENCE
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-foreground/70 max-w-2xl leading-relaxed border-l-2 border-primary/30 pl-6"
              >
                Welcome to <span className="text-primary font-bold">UniOne</span>. The central nervous system for engineering education. 
                Access premium data streams, generate cryptographic student identities, and accelerate your learning curve.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <Link to="/register">
                  <Button className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-heading tracking-wide clip-tech relative overflow-hidden group">
                    <span className="relative z-10 flex items-center">
                      Initialize Access <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/explore-free">
                  <Button variant="outline" className="h-14 px-8 border-primary/30 text-primary hover:bg-primary/10 text-lg font-heading tracking-wide clip-tech">
                    <Terminal className="mr-2 h-5 w-5" />
                    Explore Data
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Visual - The Core */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                {/* Rotating Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border border-dotted border-secondary/30 rounded-full"
                />
                
                {/* Central Image */}
                <div className="absolute inset-16 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(0,255,255,0.2)] bg-black">
                  <Image 
                    src="https://static.wixstatic.com/media/7a858b_bca4b290cf1c4d3eabd444e833803518~mv2.png?originWidth=576&originHeight=576"
                    alt="UniOne Core Interface"
                    width={600}
                    className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                {/* Floating Data Cards */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 top-1/4 bg-glassmorphism-overlay backdrop-blur-md border border-primary/30 p-4 rounded-lg max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-4 w-4 text-accent-teal" />
                    <span className="text-xs font-mono text-accent-teal">LIVE METRICS</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-accent-teal animate-pulse" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll to Scan</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* --- DATA STREAM TICKER --- */}
      <div className="w-full bg-primary/5 border-y border-primary/10 overflow-hidden py-3">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: "-50%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 px-8"
          >
            {[...ANNOUNCEMENTS_TICKER, ...ANNOUNCEMENTS_TICKER].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-mono text-primary/80">
                <span className="w-2 h-2 bg-accent-teal rounded-full animate-pulse" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- FEATURES: THE ECOSYSTEM --- */}
      <section className="relative w-full py-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto max-w-[100rem]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-4xl md:text-6xl mb-6">
                <GlitchText text="SYSTEM MODULES" />
              </h2>
              <p className="text-xl text-foreground/60">
                Comprehensive tools designed for the modern engineering workflow.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-4xl font-mono text-primary font-bold">04</div>
              <div className="text-sm text-foreground/40 uppercase tracking-widest">Active Nodes</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES_DATA.map((feature, index) => (
              <ScifiBorder key={feature.id} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-glassmorphism-overlay backdrop-blur-sm p-8 hover:bg-white/5 transition-colors duration-300 flex flex-col"
                >
                  <div className={`w-14 h-14 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-8 border border-${feature.color}/20`}>
                    <feature.icon className={`h-7 w-7 text-${feature.color}`} />
                  </div>
                  
                  <h3 className="font-heading text-2xl mb-4">{feature.title}</h3>
                  <p className="text-foreground/60 leading-relaxed mb-8 flex-grow">
                    {feature.description}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className={`text-xs font-mono text-${feature.color} uppercase tracking-wider`}>
                      [{feature.stat}]
                    </span>
                    <ArrowRight className={`h-4 w-4 text-${feature.color} opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all`} />
                  </div>
                </motion.div>
              </ScifiBorder>
            ))}
          </div>
        </div>
      </section>

      {/* --- DIGITAL IDENTITY SECTION --- */}
      <section className="relative w-full py-32 bg-black/40 border-y border-white/5">
        <div className="container mx-auto max-w-[100rem] px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Holographic Card Effect */}
              <motion.div 
                initial={{ rotateY: 15, rotateX: 5 }}
                whileInView={{ rotateY: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 perspective-1000"
              >
                <div className="relative aspect-[1.586/1] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/7a858b_ca05da0781bd41e7a79be5cfe32b2092~mv2.png?originWidth=1216&originHeight=768')] bg-cover bg-center opacity-50 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
                  
                  {/* Card Content Mockup */}
                  <div className="relative p-8 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                        <div>
                          <div className="h-3 w-32 bg-white/20 rounded mb-2" />
                          <div className="h-2 w-20 bg-white/10 rounded" />
                        </div>
                      </div>
                      <Shield className="h-8 w-8 text-primary/80" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-white/10 rounded" />
                      <div className="h-2 w-2/3 bg-white/10 rounded" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="font-mono text-xs text-primary/80 tracking-[0.2em]">ID: 8X-992-A1</div>
                      <div className="w-16 h-16 bg-white/90 rounded-lg" /> 
                    </div>
                  </div>

                  {/* Scanning Line Animation */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_20px_rgba(0,255,255,0.8)] z-20"
                  />
                </div>
              </motion.div>
              
              {/* Decorative Elements behind card */}
              <div className="absolute -inset-10 bg-primary/5 blur-3xl -z-10" />
              <div className="absolute -bottom-10 -right-10 text-[10rem] font-heading font-bold text-white/5 select-none -z-10">ID</div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-sm font-mono">
                <Lock className="h-3 w-3" />
                SECURE PROTOCOL
              </div>
              
              <h2 className="font-heading text-5xl lg:text-6xl leading-tight">
                Next-Gen <br />
                <span className="text-white">Digital Identity</span>
              </h2>
              
              <p className="text-xl text-foreground/70 leading-relaxed">
                Forget physical cards. UniOne generates a cryptographically secure digital student ID that lives on your dashboard. 
                Instantly verifiable for campus entry, library access, and examination halls.
              </p>

              <ul className="space-y-4 mt-8">
                {[
                  "Blockchain-backed verification",
                  "Dynamic QR code generation",
                  "Offline access mode",
                  "Integrated library permissions"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-8">
                <Link to="/register">
                  <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-none clip-tech-inverse font-bold tracking-wide">
                    Generate ID Card
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- UNIONE STORE (PRICING) --- */}
      <section className="w-full py-32 px-6">
        <div className="container mx-auto max-w-[100rem]">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl mb-6">UniOne Store</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Select your access level. Upgrade your engineering toolkit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group ${plan.highlight ? 'md:-mt-8 md:mb-8 z-10' : ''}`}
              >
                <div className={`
                  relative h-full p-8 border backdrop-blur-md transition-all duration-300
                  ${plan.highlight 
                    ? 'bg-secondary/10 border-secondary/50 shadow-[0_0_30px_rgba(138,43,226,0.15)]' 
                    : 'bg-glassmorphism-overlay border-white/10 hover:border-primary/30'}
                `}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                      Recommended
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="font-heading text-2xl mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold font-mono">{plan.price}</span>
                      {plan.price !== 'Free' && <span className="text-sm text-foreground/50">/month</span>}
                    </div>
                    <p className="text-sm text-foreground/60 mt-4">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <div className={`w-1 h-1 rounded-full bg-${plan.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full py-6 font-heading tracking-wide ${
                    plan.highlight 
                      ? 'bg-secondary hover:bg-secondary/90 text-white' 
                      : 'bg-transparent border border-white/20 hover:bg-white/5'
                  }`}>
                    Select Plan
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION: WARP SPEED --- */}
      <section className="relative w-full py-40 overflow-hidden">
        {/* Warp Speed Background Effect */}
        <div className="absolute inset-0 bg-primary/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <Cpu className="w-20 h-20 mx-auto text-primary animate-pulse" />
            
            <h2 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
              READY TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ASCEND?
              </span>
            </h2>
            
            <p className="text-2xl text-foreground/70 max-w-2xl mx-auto">
              Join the network of future engineers. Initialize your student profile and access the UniOne ecosystem today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
              <Link to="/register">
                <Button className="h-16 px-12 bg-white text-black hover:bg-gray-200 text-xl font-heading font-bold rounded-full transition-all hover:scale-105">
                  Create Account
                </Button>
              </Link>
              <Link to="/explore-free">
                <Button variant="ghost" className="h-16 px-12 text-white border border-white/20 hover:bg-white/10 text-xl font-heading rounded-full">
                  Guest Access
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}