import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Code, Globe, GraduationCap, Lightbulb, MapPin, MessageSquare, Rocket, Search, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Founder {
  id: number;
  name: string;
  role: string;
  location: string;
  skills: string[];
  experience: string;
  bio: string;
  matchScore: number;
  avatar: string;
  interests: string[];
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const founders: Founder[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Technical Co-Founder",
      location: "San Francisco, CA",
      skills: ["Full-Stack Development", "AI/ML", "System Architecture"],
      experience: "Ex-Google, Stanford CS",
      bio: "Passionate about building scalable AI solutions. Looking for a business-minded co-founder to revolutionize enterprise software.",
      matchScore: 95,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      interests: ["AI", "Enterprise Software", "Cloud Computing"]
    },
    {
      id: 2,
      name: "Alex Rivera",
      role: "Business Co-Founder",
      location: "New York, NY",
      skills: ["Growth Strategy", "Sales", "Product Management"],
      experience: "Harvard MBA, Ex-McKinsey",
      bio: "Serial entrepreneur with 2 successful exits. Seeking a technical co-founder for my next venture in FinTech.",
      matchScore: 88,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      interests: ["FinTech", "B2B SaaS", "Blockchain"]
    },
    {
      id: 3,
      name: "Emily Zhang",
      role: "Product Co-Founder",
      location: "Austin, TX",
      skills: ["Product Design", "UX Research", "Data Analytics"],
      experience: "Ex-Airbnb Product Lead",
      bio: "Product leader with a passion for creating delightful user experiences. Looking for a technical co-founder to build the next-gen social platform.",
      matchScore: 92,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      interests: ["Social Media", "Consumer Tech", "Mobile Apps"]
    }
  ];

  const skills = [
    "Full-Stack Development",
    "AI/ML",
    "Product Management",
    "UX/UI Design",
    "Sales",
    "Marketing",
    "Data Science",
    "Blockchain"
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Floating icons animation variants
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 5,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b1f3a] to-[#252b50]">
      {/* Header */}
      <header className="bg-[#1b1f3a] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Find Co-Founders
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Illustrations */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-32 left-24 opacity-20 pointer-events-none"
      >
        <Lightbulb size={110} className="text-yellow-400" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-24 right-32 opacity-20 pointer-events-none"
      >
        <Zap size={130} className="text-purple-500" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/3 right-10 opacity-20 pointer-events-none"
      >
        <Users size={120} className="text-blue-400" />
      </motion.div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Your Perfect Co-Founder
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect with ambitious entrepreneurs who share your vision and complement your skills.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by skills, interests, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-[#2a2f55] rounded-2xl text-white placeholder-gray-400 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Advanced Filters
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSkills.includes(skill)
                          ? 'bg-purple-500 text-white'
                          : 'bg-[#2a2f55] text-gray-300 hover:bg-[#343963]'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {founders.map((founder) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-[#2a2f55] rounded-2xl p-6 border border-purple-500/30 group"
            >
              <div className="flex items-start gap-4">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{founder.name}</h3>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      {founder.matchScore}%
                    </span>
                  </div>
                  <p className="text-gray-300 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {founder.role}
                  </p>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {founder.location}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-300 text-sm">{founder.bio}</p>
                
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#343963] rounded-full text-gray-300 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#343963] rounded-full text-gray-300 text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Connect
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 bg-[#343963] hover:bg-[#3c426f] text-white py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 bg-[#2a2f55] rounded-2xl p-8 border border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,258+</div>
              <div className="text-gray-300">Active Founders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">856</div>
              <div className="text-gray-300">Successful Matches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">92%</div>
              <div className="text-gray-300">Match Satisfaction</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;