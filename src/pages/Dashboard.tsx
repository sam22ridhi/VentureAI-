import { AnimatePresence, motion } from "framer-motion";
import { Bell, Calendar, ChevronDown, Lightbulb, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showTools, setShowTools] = useState(false);
  const navigate = useNavigate(); // React Router navigation function

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1b1f3a] to-[#252b50] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 bg-[#1b1f3a] shadow-md text-2xl">
        <h1 className="text-4xl font-extrabold flex items-center gap-4">
          <Lightbulb size={42} className="text-yellow-400" /> VentureAI
        </h1>
        <div className="flex items-center gap-10">
          <button
            onClick={() => setShowTools(!showTools)}
            className="flex items-center gap-3 hover:text-purple-300 transition text-xl"
          >
            Tools <ChevronDown size={22} />
          </button>
          <button className="hover:text-purple-300 transition text-xl">Blog</button>
          <button className="hover:text-purple-300 transition text-xl">Contact Us</button>
          <Bell size={30} className="hover:text-purple-300 transition cursor-pointer" />
          <Calendar size={30} className="hover:text-purple-300 transition cursor-pointer" />
        </div>
      </nav>

      {/* Floating Illustrations */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-32 left-24 opacity-40"
      >
        <Lightbulb size={110} className="text-yellow-400" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-24 right-32 opacity-40"
      >
        <Zap size={130} className="text-purple-500" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/3 right-10 opacity-40"
      >
        <Users size={120} className="text-blue-400" />
      </motion.div>

      {/* Extra Floating Icons */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 opacity-30"
      >
        <Calendar size={100} className="text-green-400" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-20 opacity-30"
      >
        <Bell size={100} className="text-red-400" />
      </motion.div>

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center h-[90vh] text-center px-6">
        <AnimatePresence mode="wait">
          {showTools ? (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl"
            >
              {[
                { icon: Lightbulb, title: "Smart AI Assistants", desc: "Access a suite of AI-powered assistants for expert support.", link: "/idea-validation" },
                { icon: Users, title: "Find Co-Founder", desc: "Connect with like-minded entrepreneurs.", link: "/find-cofounder" },
                { icon: Zap, title: "Daily News", desc: "Instant startup news to keep you on track.", link: "/news" },
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative p-10 bg-[#2a2f55] rounded-3xl shadow-2xl cursor-pointer"
                  onClick={() => navigate(tool.link)} // Navigate on click
                >
                  <div className="relative z-20">
                    <tool.icon size={56} className="text-purple-400 mb-6" />
                    <h3 className="text-3xl font-bold">{tool.title}</h3>
                    <p className="text-xl">{tool.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <motion.h2
                className="text-6xl font-extrabold text-gray-300 mb-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                Welcome to VentureAI! 🚀
              </motion.h2>
              <p className="text-gray-400 max-w-3xl text-2xl mb-10">
                Your AI-powered assistant for idea validation, team management, and strategic guidance.  
                Click on <span className="text-purple-300 font-bold">Tools</span> to explore features.
              </p>
              <motion.button
                onClick={() => setShowTools(true)}
                className="px-10 py-4 bg-purple-600 text-white rounded-2xl shadow-xl text-2xl hover:bg-purple-700 transition"
                whileHover={{ scale: 1.1 }}
              >
                Explore Tools
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
