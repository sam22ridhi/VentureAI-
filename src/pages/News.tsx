import React, { useState, useEffect } from 'react';
import { ArrowLeft, Rocket, TrendingUp, Users, Globe } from 'lucide-react';

interface NewsArticle {
  title: string;
  link: string;
  published: string;
  summary: string;
  image: string;
  category: string;
}

function App() {
  const [news, setNews] = useState<NewsArticle[]>([
    {
      title: "TechFlow Raises $50M Series B to Revolutionize Developer Workflows",
      link: "https://example.com/techflow-funding",
      published: "March 15, 2024",
      summary: "TechFlow, the innovative developer productivity platform, has secured $50M in Series B funding led by Accel Partners. The startup plans to expand its AI-powered code review capabilities and enter new markets.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
      category: "Funding"
    },
    {
      title: "GreenScale's Sustainable Cloud Computing Platform Goes Global",
      link: "https://example.com/greenscale-expansion",
      published: "March 14, 2024",
      summary: "GreenScale announces global expansion of its eco-friendly cloud computing platform, promising 60% reduction in carbon footprint compared to traditional providers.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      category: "Growth"
    },
    {
      title: "AI Startup Mindforge Acquires Data Analytics Firm DataPulse",
      link: "https://example.com/mindforge-acquisition",
      published: "March 13, 2024",
      summary: "In a strategic move to strengthen its machine learning capabilities, Mindforge announces the acquisition of DataPulse for $80M, creating a powerhouse in AI-driven analytics.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      category: "Acquisition"
    },
    {
      title: "WorkSpace.io Launches Revolutionary Remote Team Collaboration Tools",
      link: "https://example.com/workspace-launch",
      published: "March 12, 2024",
      summary: "WorkSpace.io debuts its next-generation collaboration platform, featuring AI-powered project management and immersive virtual office spaces for remote teams.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
      category: "Product Launch"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'funding':
        return <TrendingUp className="w-5 h-5" />;
      case 'growth':
        return <Rocket className="w-5 h-5" />;
      case 'acquisition':
        return <Users className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => {}}
                className="p-2 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-indigo-600" />
              </button>
              <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Startup News
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm shadow-xl rounded-2xl p-6 animate-pulse"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-72 h-48 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {news.map((article, index) => (
              <article
                key={index}
                className="bg-white/60 backdrop-blur-sm shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-72 h-48 overflow-hidden rounded-xl">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                        {getCategoryIcon(article.category)}
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500">{article.published}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.summary}
                    </p>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                      Read Full Story
                      <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;