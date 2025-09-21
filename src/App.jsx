import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeAnalyzerService from './ResumeAnalyzerService';
import CareerRoadmapService from './CareerRoadmapService';
import InterviewReadinessService from './InterviewReadinessService';
import { AppProvider, useAppStore } from './AppContext';
import OnboardingForm from './components/OnboardingForm';
import { useOnboarding } from './hooks/useOnboarding';

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    const theme = saved ? JSON.parse(saved) : false;
    // Apply theme immediately
    if (theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return theme;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    
    // Update state
    setIsDark(newTheme);
    
    // Update localStorage
    localStorage.setItem('theme', JSON.stringify(newTheme));
    
    // Update DOM immediately
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// App state is now managed by AppContext

// Mock Data
const mockRoles = {
  "frontend-developer": {
    title: "Frontend Developer",
    months: [
      {
        month: 1,
        skills: ["HTML/CSS Fundamentals", "JavaScript ES6+", "Git/GitHub"],
        resources: ["freeCodeCamp", "MDN Docs", "JavaScript.info"],
        projects: ["Personal Portfolio", "Calculator App"]
      },
      {
        month: 2,
        skills: ["React Basics", "Component Architecture", "State Management"],
        resources: ["React Official Docs", "React Beta Docs", "Scrimba React Course"],
        projects: ["Todo App", "Weather Dashboard"]
      },
      {
        month: 3,
        skills: ["Advanced React", "Custom Hooks", "Context API"],
        resources: ["Epic React", "React Patterns", "useHooks.com"],
        projects: ["E-commerce Frontend", "Blog Platform"]
      },
      {
        month: 4,
        skills: ["TypeScript", "Testing (Jest/RTL)", "Build Tools"],
        resources: ["TypeScript Handbook", "Testing Library Docs", "Vite Guide"],
        projects: ["Type-safe API Client", "Component Library"]
      },
      {
        month: 5,
        skills: ["Performance Optimization", "Accessibility", "SEO"],
        resources: ["Web.dev", "A11y Project", "Lighthouse Guides"],
        projects: ["PWA Development", "Optimized Landing Page"]
      },
      {
        month: 6,
        skills: ["System Design", "Interview Prep", "Portfolio Polish"],
        resources: ["Frontend Masters", "LeetCode", "Pramp"],
        projects: ["Capstone Project", "Interview Practice"]
      }
    ]
  }
};

const mockATSFeedback = {
  score: 68,
  sections: {
    experience: { score: 75, feedback: "Strong technical experience, but add more quantified achievements" },
    skills: { score: 85, feedback: "Good technical skills coverage" },
    formatting: { score: 45, feedback: "Consider ATS-friendly formatting with clear sections" },
    keywords: { score: 60, feedback: "Missing key industry terms like 'agile', 'CI/CD'" }
  },
  missingKeywords: ["React", "TypeScript", "CI/CD", "Agile", "REST APIs"]
};

const mockResumeSample = [
  "Developed web applications using JavaScript and various frameworks",
  "Worked on team projects and collaborated with other developers", 
  "Implemented features and fixed bugs in existing codebase",
  "Participated in code reviews and improved application performance",
  "Created user interfaces and ensured responsive design"
];

// UI Components
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <motion.div
    whileHover={hover ? { y: -2, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none ${className}`}
    {...props}
  />
);

// Navigation Components
const Navbar = ({ onNavigate, currentPage, onOpenAuth, onOpenOnboarding }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, setUser } = useAppStore();
  const { isCompleted } = useOnboarding();
  
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ACT
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">AI Career Toolkit</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('pricing')} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Pricing
            </button>
            <button onClick={() => onNavigate('about')} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              About
            </button>
            
            {user ? (
              <>
                {!isCompleted && onOpenOnboarding && (
                  <Button 
                    onClick={onOpenOnboarding}
                    variant="outline"
                    size="sm"
                  >
                    Complete Your Profile
                  </Button>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user.username || user.email).substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {user.username || user.email}
                  </span>
                </div>
                <Button 
                  onClick={async () => {
                    const authService = await import('./services/authService');
                    await authService.logout();
                    setUser(null);
                    onNavigate('landing');
                  }}
                  variant="outline"
                >
                  Sign Out
                </Button>
                <Button onClick={() => onNavigate('app')}>Dashboard</Button>
              </>
            ) : (
              <>
                <button onClick={onOpenAuth} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Sign In
                </button>
                <Button onClick={() => onNavigate('app')}>Try Free</Button>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const Sidebar = ({ onNavigate, currentPage }) => {
  const pages = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊' },
    { id: 'resume-analyzer', title: 'Resume Analyzer', icon: '📄' },
    { id: 'career-roadmap', title: 'Career Roadmap', icon: '🗺️' },
    { id: 'line-analyzer', title: 'Interview Readiness', icon: '🔍' },
    { id: 'settings', title: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ACT
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">AI Career Toolkit</span>
        </div>
        
        <nav className="space-y-2">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentPage === page.id
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{page.icon}</span>
              <span>{page.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Page Components
const LandingPage = ({ onNavigate }) => {
  const features = [
    {
      icon: '📄',
      title: 'ATS Resume Analyzer',
      description: 'Get instant feedback on your resume\'s ATS compatibility and scoring.',
      badge: 'Free'
    },
    {
      icon: '🗺️',
      title: 'Career Roadmap Generator',
      description: '6-month learning plans tailored to your target role.',
      badge: 'Free'
    },
    {
      icon: '🔍',
      title: 'Interview Readiness Gauge',
      description: 'Quick assessment of your interview preparedness level.',
      badge: 'Trial Based'
    }
  ];

  const steps = [
    { title: 'Upload Your Resume', desc: 'Drop your PDF or paste your content' },
    { title: 'Get AI Analysis', desc: 'Instant feedback on ATS compatibility' },
    { title: 'Apply Improvements', desc: 'Download optimized resume' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      {/* Development Phase Notice */}
      <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-center">
        <p className="text-sm font-medium">🚧 This application is currently in development phase. Only 3 features are available at this time. 🚧</p>
      </div>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Land interviews faster with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-powered
              </span>{' '}
              resume tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Your career deserves better than copy-paste resumes. Let AI roast, fix, and future-proof it — in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => {
                onNavigate('dashboard');
              }}>
                Try it free
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('pricing')}>
                View pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              ATS-friendly suggestions • Role-based roadmaps • Actionable rewrites • No credit card to try
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                onClick={() => {
                  if (feature.title === 'ATS Resume Analyzer') {
                    onNavigate('resume-analyzer-service');
                  } else if (feature.title === 'Career Roadmap Generator') {
                    onNavigate('roadmap-service');
                  } else if (feature.title === 'Interview Readiness Gauge') {
                    onNavigate('interview-service');
                  }
                }}
                className="cursor-pointer"
              >
                <Card hover className="text-center h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <div className="flex items-center justify-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mr-2">
                      {feature.title}
                    </h3>
                    <Badge variant={feature.badge === 'Free' ? 'success' : 'warning'}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Coming Soon */}
      <section className="py-10 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <p className="text-indigo-600 dark:text-indigo-300 font-medium">✨ More features coming soon ✨</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              We're constantly working on new tools to help you advance your career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to land your next interview?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands who have improved their resumes with AI Career Toolkit.
            </p>
            <Button size="lg" onClick={() => onNavigate('app')}>
              Get started free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  ACT
                </div>
                <span className="font-bold text-xl text-white">AI Career Toolkit</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering job seekers with AI-powered tools to land their dream jobs faster.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => onNavigate('landing')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('pricing')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => onNavigate('resume-analyzer-service')}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    ATS Resume Analyzer
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('roadmap-service')}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Career Roadmap Generator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('interview-service')}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Interview Readiness Gauge
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <p className="text-gray-400 text-sm mb-2">
                Have questions or feedback? Reach out to our team.
              </p>
              <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                support@aicareer.toolkit
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AI Career Toolkit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PricingPage = ({ onNavigate }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'ATS Resume Analyzer',
        'Career Roadmap Generator',
        'Basic templates',
        'Community support'
      ]
    },
    {
      name: 'Trial',
      price: '$9',
      period: '7 days',
      features: [
        'Everything in Free',
        'Line-by-Line Analyzer (50 lines)',
        'Priority processing',
        'Export to PDF'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'month',
      features: [
        'Everything in Trial',
        'Unlimited analyses',
        'Job Description Analyzer',
        'Mock Interview Prep',
        'Cover Letter Generator',
        'Priority support'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose your plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start free, upgrade when you need more features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative ${plan.popular ? 'ring-2 ring-indigo-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="success">Most Popular</Badge>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                    <span className="text-lg text-gray-500">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'primary' : 'outline'}
                  onClick={() => onNavigate(plan.name === 'Free' ? 'app' : 'auth')}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Start Trial'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
    <div className="max-w-4xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
          About AI Career Toolkit
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            We're on a mission to democratize career advancement through AI-powered tools 
            that help job seekers land their dream roles.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Started by a team of engineers and career coaches who experienced firsthand 
                how broken the job search process can be. We believe everyone deserves access 
                to professional-grade career tools.
              </p>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To provide accessible, AI-powered career tools that help job seekers 
                optimize their applications, develop relevant skills, and land interviews 
                at their target companies.
              </p>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const AuthModal = ({ onClose, onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setUser } = useAppStore();

  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    clearForm();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp) {
      // Username validation for signup
      if (!username.trim()) newErrors.username = 'Username is required';
      else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters long';
      else if (username.length > 20) newErrors.username = 'Username must be no more than 20 characters long';
      else if (!/^[a-zA-Z0-9_]+$/.test(username)) newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 12) newErrors.password = 'Password must be at least 12 characters';
    else {
      // Check password requirements
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?`~]/.test(password);
      
      if (!hasUppercase) newErrors.password = 'Password must contain at least one uppercase letter';
      else if (!hasLowercase) newErrors.password = 'Password must contain at least one lowercase letter';
      else if (!hasDigit) newErrors.password = 'Password must contain at least one digit';
      else if (!hasSpecial) newErrors.password = 'Password must contain at least one special character';
    }
    
    if (isSignUp) {
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Import dynamically to avoid circular dependencies
      const authService = await import('./services/authService');
      
      let response;
      if (isSignUp) {
        response = await authService.register({ username, email, password });
        setToastMessage('Account created successfully!');
      } else {
        // For login, use email as the login field (can be username or email)
        response = await authService.login({ login: email, password });
        setToastMessage('Login successful!');
      }
      
      // Set user in context
      setUser(response.user);
      setToastType('success');
      setShowToast(true);
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        onNavigate('app');
        onClose();
      }, 2000);
    } catch (error) {
      setToastType('error');
      // Ensure we display a proper error message
      const errorMessage = error?.message || error?.toString() || 'Invalid credentials';
      setToastMessage(errorMessage);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSignUp ? 'Get started with your free account' : 'Welcome back!'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe123"
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                  {!errors.username && (
                    <p className="text-gray-500 text-xs mt-1">
                      3-20 characters, letters, numbers, and underscores only
                    </p>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isSignUp ? 'Email' : 'Email or Username'}
                </label>
                <Input
                  type={isSignUp ? "email" : "text"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSignUp ? "you@example.com" : "you@example.com or username"}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                {isSignUp && !errors.password && (
                  <p className="text-gray-500 text-xs mt-1">
                    Password must be 12+ characters with uppercase, lowercase, digit, and special character (!@#$%^&*)
                  </p>
                )}
              </div>
              
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleToggleMode}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-4 right-4 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg`}
        >
          {toastType === 'success' ? '✓' : '✗'} {toastMessage}
        </motion.div>
      )}
    </div>
  );
};

// App Components
const Dashboard = ({ onNavigate, onOpenOnboarding }) => {
  const { credits } = useAppStore();
  const { isCompleted } = useOnboarding();
  const cards = [
    { title: 'Recent Uploads', value: '3', subtitle: 'Last 30 days' },
    { title: 'Avg. ATS Score', value: '68', subtitle: '+12 from last month' },
    { title: 'Roadmap Progress', value: '45%', subtitle: '2/6 months complete' },
    { title: 'Interview Readiness', value: 'Trial', subtitle: 'Access to interview readiness gauge' }
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          {!isCompleted && onOpenOnboarding && (
            <Button 
              onClick={onOpenOnboarding}
              variant="outline"
            >
              Complete Your Profile
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {card.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.subtitle}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Resume analyzed: Frontend_Resume.pdf</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Roadmap created: Frontend Developer</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Line analysis: 3 bullets improved</span>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Services</h3>
            <div className="space-y-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">📄 Resume Analyzer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-2">
                  Get your resume analyzed by our AI to improve ATS compatibility and highlight areas for improvement. Costs 50 credits per analysis.
                </p>
                <Button className="w-full mt-2" onClick={() => onNavigate('resume-analyzer-service')}>
                  Try Resume Analyzer
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">🗺️ Career Roadmap</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-2">
                  Generate a personalized career development path with skills to learn and milestones to achieve. Costs 50 credits per roadmap.
                </p>
                <Button className="w-full mt-2" onClick={() => onNavigate('roadmap-service')}>
                  Create Your Roadmap
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">🔍 Interview Readiness</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-2">
                  Assess your interview readiness with AI feedback on your resume bullets and potential interview questions. Costs 50 credits per assessment.
                </p>
                <Button className="w-full mt-2" onClick={() => onNavigate('interview-service')}>
                  Check Your Readiness
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showJDCompare, setShowJDCompare] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const { credits, setCredits } = useAppStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      // Check if user has enough credits
      if (credits < 50) {
        setShowUpgradeModal(true);
        return;
      }
      
      // Deduct credits
      setCredits(credits - 50);
      
      setFile(uploadedFile);
      setAnalyzing(true);
      
      setTimeout(() => {
        setResults(mockATSFeedback);
        setAnalyzing(false);
      }, 2000);
    }
  };

  const handleJDCompare = () => {
    setShowJDCompare(false);
    // Mock JD comparison logic would go here
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Resume Analyzer</h1>

        {!file && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Drag and drop your PDF or DOCX file, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button className="cursor-pointer">
                Choose File
              </Button>
            </label>
          </Card>
        )}

        {analyzing && (
          <Card className="text-center py-12">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Analyzing Your Resume...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI is reviewing your resume for ATS compatibility
            </p>
          </Card>
        )}

        {results && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ATS Score: {results.score}/100
                </h3>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowJDCompare(true)} variant="outline">
                    Compare to Job Description
                  </Button>
                  <Button variant="outline">Export PDF</Button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{results.score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${results.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(results.sections).map(([key, section]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {key.replace('_', ' ')}
                      </h4>
                      <span className="text-sm font-medium">{section.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
                      <div 
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${section.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.missingKeywords.map((keyword, i) => (
                  <Badge key={i} variant="warning">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Consider adding these relevant keywords to improve your ATS score
              </p>
            </Card>
          </div>
        )}

        {showJDCompare && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Compare to Job Description
              </h3>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="mb-4"
              />
              <div className="flex space-x-2">
                <Button onClick={handleJDCompare}>
                  Compare
                </Button>
                <Button variant="outline" onClick={() => setShowJDCompare(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const CareerRoadmap = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [generating, setGenerating] = useState(false);
  const { credits, setCredits } = useAppStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const roles = [
    { id: 'frontend-developer', name: 'Frontend Developer' },
    { id: 'backend-developer', name: 'Backend Developer' },
    { id: 'data-analyst', name: 'Data Analyst' },
    { id: 'product-manager', name: 'Product Manager' }
  ];

  const generateRoadmap = () => {
    // Check if user has enough credits
    if (credits < 50) {
      setShowUpgradeModal(true);
      return;
    }
    
    // Deduct credits
    setCredits(credits - 50);
    
    setGenerating(true);
    setTimeout(() => {
      setRoadmap(mockRoles[selectedRole] || mockRoles['frontend-developer']);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Career Roadmap</h1>

        {!roadmap && (
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create Your Learning Path
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5+ years)</option>
                </select>
              </div>
              <Button 
                onClick={generateRoadmap} 
                disabled={!selectedRole || generating}
                className="w-full"
              >
                {generating ? 'Generating...' : 'Generate Roadmap'}
              </Button>
            </div>
          </Card>
        )}

        {generating && (
          <Card className="text-center py-12">
            <div className="animate-pulse text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Creating Your Roadmap...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generating a personalized 6-month learning plan
            </p>
          </Card>
        )}

        {roadmap && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {roadmap.title} Roadmap
              </h2>
              <Button onClick={() => setRoadmap(null)} variant="outline">
                Create New Roadmap
              </Button>
            </div>

            <div className="grid gap-6">
              {roadmap.months.map((month, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Month {month.month}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skills to Learn</h4>
                        <ul className="space-y-1">
                          {month.skills.map((skill, j) => (
                            <li key={j} className="text-gray-600 dark:text-gray-400 text-sm">
                              • {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Free Resources</h4>
                        <ul className="space-y-1">
                          {month.resources.map((resource, j) => (
                            <li key={j} className="text-indigo-600 dark:text-indigo-400 text-sm cursor-pointer hover:underline">
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Projects</h4>
                        <div className="space-y-2">
                          {month.projects.map((project, j) => (
                            <div key={j} className="flex items-center justify-between">
                              <span className="text-gray-600 dark:text-gray-400 text-sm">{project}</span>
                              <Button size="sm" variant="outline">Add to Tracker</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const LineAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [analyzedLines, setAnalyzedLines] = useState([]);
  const { credits, setCredits } = useAppStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const analyzeResume = () => {
    // Check if user has enough credits
    if (credits < 50) {
      setShowUpgradeModal(true);
      return;
    }
    
    // Deduct credits
    setCredits(credits - 50);
    
    const lines = resumeText.split('\n').filter(line => line.trim());
    const analyzed = lines.map((line, i) => ({
      original: line,
      canAnalyze: true,
      issues: ['Weak action verb', 'Missing metrics'],
      improved: line
        .replace(/\b(Developed|Worked|Implemented)\b/i, 'Architected')
        .replace(/\b(applications|projects|features)\b/i, 'solutions') +
        ' resulting in 25% efficiency gain',
      impact: 'More specific and quantified'
    }));
    
    setAnalyzedLines(analyzed);
    
    // Generate interview readiness assessment
    const assessment = ['Resume-ready', 'Needs Projects', 'Start Interview Prep'][Math.floor(Math.random() * 3)];
    setTimeout(() => {
      alert(`Interview Readiness Assessment: ${assessment}`);
    }, 1000);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Readiness Gauge</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="warning">Trial Based</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Paste Your Resume Content for Interview Readiness Assessment
            </h3>
            <Textarea
              placeholder="Paste your resume bullet points here, one per line..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
              className="mb-4"
            />
            <Button onClick={analyzeResume} disabled={!resumeText.trim()}>
              Analyze Lines
            </Button>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Results
            </h3>
            <div className="space-y-4">
              {analyzedLines.map((line, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Line {i + 1}
                    </span>
                    {!line.canAnalyze && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          // Update the line to be analyzed
                          const updatedLines = [...analyzedLines];
                          updatedLines[i].canAnalyze = true;
                          setAnalyzedLines(updatedLines);
                        }}
                      >
                        Analyze
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Original: {line.original}
                  </div>
                  
                  {line.canAnalyze ? (
                    <div>
                      <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                        Improved: {line.improved}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {line.issues.map((issue, j) => (
                          <Badge key={j} variant="warning">{issue}</Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Impact: {line.impact}
                      </div>
                    </div>
                  ) : (
                    <div className="blur-sm text-sm text-gray-400">
                      Improved version available with credits...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Unlock Full Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get detailed feedback and improved versions for all your resume bullets with our Trial plan.
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => setShowUpgradeModal(false)}>
                  Start Trial
                </Button>
                <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                  Maybe Later
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Settings = ({ onOpenOnboarding }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isCompleted } = useOnboarding();

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile</h3>
            <div className="space-y-4">
              {!isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Complete Your Profile</h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">Add your skills, experience, and preferences</p>
                      </div>
                    </div>
                    <Button 
                      onClick={onOpenOnboarding}
                      variant="primary"
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </motion.div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <Input placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input placeholder="john@example.com" type="email" />
              </div>
              <Button variant="outline">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Dark Mode</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    isDark ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data</h3>
            <div className="space-y-4">
              <Button variant="outline">Export My Data</Button>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

// App Shell
const AppShell = ({ currentPage, onNavigate, onOpenOnboarding }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, setUser } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={onNavigate} onOpenOnboarding={onOpenOnboarding} />;
      case 'resume-analyzer': return <ResumeAnalyzer />;
      case 'career-roadmap': return <CareerRoadmap />;
      case 'line-analyzer': return <LineAnalyzer />;
      case 'settings': return <Settings onOpenOnboarding={onOpenOnboarding} />;
      default: return <Dashboard onNavigate={onNavigate} onOpenOnboarding={onOpenOnboarding} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar onNavigate={onNavigate} currentPage={currentPage} />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('landing')}
                className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Return to Home</span>
              </button>
              <Input placeholder="Search..." className="w-64" />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                🔔
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user ? (user.username || user.email).substring(0, 2).toUpperCase() : 'GU'}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {user ? (user.username || user.email) : 'Guest User'}
                  </span>
                  {user && (
                    <button 
                      onClick={async () => {
                        const authService = await import('./services/authService');
                        await authService.logout();
                        setUser(null);
                        onNavigate('landing');
                      }} 
                      className="text-xs text-gray-500 hover:text-indigo-600 text-left"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

// 404 Page
const NotFoundPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">🚀</div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => onNavigate('landing')}>
        Go Home
      </Button>
    </div>
  </div>
);

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuth, setShowAuth] = useState(false);
  const { user, setUser } = useAppStore();
  const { 
    showOnboarding, 
    onboardingData, 
    isCompleted, 
    handleComplete, 
    handleSkip, 
    openOnboarding, 
    closeOnboarding,
    forceShowOnboarding
  } = useOnboarding();
  
  // Effect to check if user is already logged in
  useEffect(() => {
    if (user && currentPage === 'landing') {
      setCurrentPage('app');
    }
  }, [user, currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Attempt session restore on mount
  useEffect(() => {
    (async () => {
      const authService = await import('./services/authService');
      const token = authService.getToken();
      if (token && !user) {
        try {
          const me = await authService.me();
          setUser(me);
        } catch (_) {
          // ignore
        }
      }
    })();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'resume-analyzer-service':
        return <ResumeAnalyzerService onNavigate={handleNavigate} />;
      case 'roadmap-service':
        return <CareerRoadmapService onNavigate={handleNavigate} />;
      case 'interview-service':
        return <InterviewReadinessService onNavigate={handleNavigate} />;
      case 'app':
      case 'dashboard':
      case 'resume-analyzer':
      case 'career-roadmap':
      case 'line-analyzer':
      case 'settings':
        return <AppShell currentPage={currentPage.startsWith('app') ? 'dashboard' : currentPage} onNavigate={handleNavigate} onOpenOnboarding={openOnboarding} />;
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  const showNavbar = !['app', 'dashboard', 'resume-analyzer', 'career-roadmap', 'line-analyzer', 'settings'].includes(currentPage);

  return (
    <ThemeProvider>
      <AppProvider>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          {showNavbar && <Navbar onNavigate={handleNavigate} currentPage={currentPage} onOpenAuth={() => setShowAuth(true)} onOpenOnboarding={openOnboarding} />}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showOnboarding ? 0.3 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentPage()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {showAuth && (
            <AuthModal onClose={() => setShowAuth(false)} onNavigate={handleNavigate} />)
          }
          {showOnboarding && (
            <OnboardingForm 
              isOpen={showOnboarding}
              onClose={closeOnboarding}
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          )}
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded space-y-2">
              <div>Onboarding: {showOnboarding ? 'SHOWING' : 'HIDDEN'}</div>
              <div>Completed: {isCompleted ? 'YES' : 'NO'}</div>
              <button 
                onClick={forceShowOnboarding}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Force Show
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Clear & Reload
              </button>
            </div>
          )}
        </div>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;