import { Bot, Brain, MessageSquare, Rocket, Sparkles, Zap } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email id');
      return;
    }
    console.log('Email submitted:', email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-custom-gradient text-white">
      {/* Navigation */}
      <nav className="border-b border-indigo-900/30 bg-ai-darker/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-accent-indigo" />
              <span className="ml-2 text-xl font-bold">VentureAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => emailInputRef.current?.focus()} 
                className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-md text-sm font-medium bg-accent-indigo hover:bg-indigo-500 transition"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        {/* Floating Illustrations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 animate-float delay-100">
            <Brain className="h-16 w-16 text-indigo-400 animate-glow" />
          </div>
          <div className="absolute top-40 right-32 animate-float delay-300">
            <Sparkles className="h-12 w-12 text-indigo-300 animate-glow" />
          </div>
          <div className="absolute bottom-32 left-1/4 animate-float delay-500">
            <MessageSquare className="h-10 w-10 text-indigo-500 animate-glow" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Your AI-Powered
              <span className="block text-gradient">
                Startup Assistant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 mb-12 max-w-3xl mx-auto">
            Navigate your startup journey with AI that validates ideas, refines strategies, and helps you scale faster
            </p>

            {/* Sign up Form */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-12">
              <div className="flex gap-4 flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  ref={emailInputRef}
                  className={`flex-1 px-4 py-3 rounded-lg glass-card border ${
                    error ? 'border-red-500' : 'border-indigo-500/30'
                  } focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo focus:ring-opacity-50 transition placeholder-indigo-300/50`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-accent-indigo hover:bg-indigo-500 transition font-medium flex items-center justify-center group"
                >
                  Start your journey
                  <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              {[
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: 'AI-Powered Startup Guide',
                  description: 'Get tailored insights to navigate every stage of your startup journey',
                },
                {
                  icon: <MessageSquare className="h-8 w-8" />,
                  title: 'Find the Right Co-Founder',
                  description: 'AI-driven matchmaking to connect with like-minded entrepreneurs',
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: 'Lightning Fast',
                  description: 'Instant responses and suggestions that keep you in flow',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl glass-card hover:border-accent-indigo transition group"
                >
                  <div className="text-accent-indigo mb-4 group-hover:scale-110 transition">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-indigo-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;