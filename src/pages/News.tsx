import React, { useState, useEffect } from 'react';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NewsArticle {
  title: string;
  link: string;
  published: string;
  summary: string;
  image: string;
}

function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8001/news/');
        setNews(response.data.news);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Enhanced Header */}
      <header className="bg-white shadow-md rounded-lg px-6 py-4 flex items-center mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-indigo-600">Latest News</h1>
        </div>
      </header>

      {/* Enhanced Loading State */}
      {loading ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {news.map((article, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 flex flex-col md:flex-row items-start gap-6"
            >
              {/* Enhanced News Image */}
              {article.image && (
                <div className="w-full md:w-48 flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/300x200.png?text=No+Image';
                    }}
                  />
                </div>
              )}

              {/* Enhanced News Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">{article.published}</p>
                <p className="text-gray-700 line-clamp-3 mb-4">{article.summary}</p>

                {/* Enhanced Read More Link */}
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Read full article
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default News;