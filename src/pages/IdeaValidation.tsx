import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, BarChart, LayoutTemplate, HandCoins } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface MarketCard {
  title: string;
  description: string;
  metrics: string[];
}

const Assistant = () => {
  const [activeTab, setActiveTab] = useState('ideation');
  const [tabMessages, setTabMessages] = useState<Record<string, Message[]>>({
    ideation: [
      {
        type: 'bot',
        content: "Hi there! I'm your AI Ideation Partner. Ready to validate and refine your startup ideas? Let's start with your core concept:",
        timestamp: new Date(),
      }
    ],
    market: [
      {
        type: 'bot',
        content: "🔍 Welcome to Market Analyst! I can help you analyze industry trends, competitors, and market opportunities.\n\nTry an example below or describe your market:",
        timestamp: new Date(),
      }
    ],
    strategy: [
      {
        type: 'bot',
        content: "📊 Welcome to Strategy Planner! Let's build a roadmap for your startup's success, covering product positioning, business models, and go-to-market strategies.",
        timestamp: new Date(),
      }
    ],
    funding: [
      {
        type: 'bot',
        content: "💰 Welcome to Funding Guide! Need help with investment strategies, pitching to VCs, or exploring alternative funding sources? Let's get started!",
        timestamp: new Date(),
      }
    ],

    pitch: [
      {
        type: 'bot',
        content: "Let's generate a pitch deck for you startup idea!!",
        timestamp: new Date(),
      }
    ]
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const marketCards: MarketCard[] = [
    {
      title: "Personalized Health Coaching Market",
      description: "AI-driven health coaching platforms that use genetic data, lifestyle habits, and wearable integration for highly personalized fitness and nutrition plans.",
      metrics: [
        "CAGR 20.1%", 
        "2025 Market: $10B", 
        "Key Players: 23andMe + Lark Health, Thrive AI Health, Suggestic",
        "Focus on specific niches (athletes, post-surgery recovery, genetic predispositions)",
        "Integration with wearables for real-time adjustments"
      ]
    },
    {
      title: "Genetic Data Integration in Wellness",
      description: "AI platforms that integrate genetic analysis to predict diet and exercise responses, offering users tailored health recommendations.",
      metrics: [
        "CAGR 15.8%", 
        "2025 Market: $3.5B", 
        "Key Players: DNAfit, Nutrigenomix, DNA Health",
        "Advanced genomic analysis to predict diet/exercise responses"
      ]
    }
  ];

  const tabs = [
    { id: 'ideation', label: 'Ideation Assistant', icon: Lightbulb },
    { id: 'market', label: 'Market Analysis', icon: BarChart },
    { id: 'strategy', label: 'Strategy Builder', icon: LayoutTemplate },
    { id: 'funding', label: 'Funding Assistant', icon: HandCoins },
    { id: 'pitch', label: 'Pitch Deck Generator', icon: LayoutTemplate}
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabMessages[activeTab]]);

  useEffect(() => {
    if (activeTab === 'ideation' && tabMessages.ideation.length === 1) {
      const timer = setTimeout(() => {
        setTabMessages(prev => ({
          ...prev,
          ideation: [...prev.ideation, {
            type: 'bot',
            content: "Pro Tip: Start with your main value proposition. Example: 'A meal-planning app that syncs with smart kitchen appliances'",
            timestamp: new Date(),
          }]
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, tabMessages.ideation.length]);

  // Update the response format to remove Markdown formatting
  const formatMarkdownResponse = (text: string) => {
    let formatted = text;
  
    // Remove markdown bold and italic markers
    formatted = formatted.replace(/\*\*([^\*]+)\*\*/g, '$1'); // Remove bold markers
    formatted = formatted.replace(/\*([^\*]+)\*/g, '$1'); // Remove italic markers
  
    // Remove markdown headers (e.g., ## Header)
    formatted = formatted.replace(/#{1,6}\s+([^\n]+)/g, '$1'); // Remove headers
  
    // Convert bullet points (like "*" or "-") into proper format (remove the bullets and just keep the text)
    formatted = formatted.replace(/^\s*[-*]\s+/gm, '• ');
  
    // Replace multiple newlines with a single one
    formatted = formatted.replace(/\n{2,}/g, '\n\n');
  
    return formatted.trim();
  };
  const handleMarketCardClick = async (card: MarketCard) => {
    const prompt = `Analyze the ${card.title} market: ${card.description}`;
    setInput(prompt);
    await handleSubmitHelper(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitHelper(input);
  };

  const handleSubmitHelper = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage = {
      type: 'user' as const,
      content: query,
      timestamp: new Date(),
    };

    setTabMessages((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMessage],
    }));

    setInput('');
    setIsLoading(true);
    setLoadingMessage(activeTab === 'ideation' ? 'Ideating...' : 'Analyzing market...');

    try {
      const endpoint =
        activeTab === 'ideation'
          ? 'validate-idea'
          : activeTab === 'market'
          ? 'analyze-market'
          : activeTab === 'strategy'
          ? 'strategy'
          : activeTab === 'funding'
          ? 'fund-distribution'
          : '';
      const payload = { idea: query };

      const response = await axios.post(
        `http://localhost:8000/${endpoint}/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const formattedResponse = formatMarkdownResponse(
        activeTab === 'ideation'
          ? response.data.validation_result
          : activeTab === 'market'
          ? response.data.market_result
          : activeTab === 'strategy'
          ? response.data.strategy_result // assuming 'strategy_result' is the correct field
          : activeTab === 'funding'
          ? response.data.funding_result // assuming 'funding_result' is the correct field
          : ''
      );

      const botMessage = {
        type: 'bot' as const,
        content: formattedResponse,
        timestamp: new Date(),
      };

      setTabMessages((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], botMessage],
      }));
      setLoadingMessage(null); // Reset loading message once done
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot' as const,
        content: '⚠️ Error processing request. Please try again.',
        timestamp: new Date(),
      };
      setTabMessages((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], errorMessage],
      }));
      setLoadingMessage(null); // Reset loading message on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b1f3a] to-[#252b50] text-white">
      <div className="flex justify-center gap-4 p-6 bg-[#1b1f3a] shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-purple-600 shadow-lg'
                : 'bg-[#2a2f55] hover:bg-purple-700/50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-lg">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[#2a2f55] rounded-2xl shadow-xl p-6">
              <div className="h-[60vh] overflow-y-auto mb-6 space-y-4 pr-4">
                {tabMessages[activeTab].map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="p-3 bg-purple-600 rounded-full">
                        <Bot className="w-6 h-6" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-purple-600'
                          : 'bg-[#1b1f3a]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-75 mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {message.type === 'user' && (
                      <div className="p-3 bg-purple-600 rounded-full">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}

                {loadingMessage && (
                  <div className="flex justify-center text-purple-400">
                    <span>{loadingMessage}</span>
                  </div>
                )}

                {activeTab === 'market' && tabMessages.market.length === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {marketCards.map((card, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#1b1f3a] p-4 rounded-xl cursor-pointer border-2 border-transparent hover:border-purple-500"
                        onClick={() => handleMarketCardClick(card)}
                      >
                        <h3 className="text-purple-400 text-lg font-semibold mb-2">
                          {card.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-3">{card.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {card.metrics.map((metric, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-purple-900/50 rounded-full text-xs"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTab === 'ideation' ? 'Describe your startup idea...' :
                    activeTab === 'market' ? 'Describe your market analysis...' :
                    'Share your thoughts...'
                  }
                  className="flex-1 p-3 rounded-2xl bg-[#252b50] text-white"
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-2xl ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600'
                  }`}
                  disabled={isLoading}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assistant;