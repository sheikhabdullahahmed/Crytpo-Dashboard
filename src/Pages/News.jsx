// frontend/src/Pages/CryptoNews.jsx
import React, { useState, useEffect } from "react";
import { 
  FaNewspaper, 
  FaSearch, 
  FaFilter, 
  FaClock, 
  FaExternalLinkAlt,
  FaFire,
  FaTimes,
  FaSpinner
} from "react-icons/fa";
import { toast } from "react-toastify";
// import Navbar from "./Navbar";


const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("cryptocurrency");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: "cryptocurrency", name: "All Crypto", icon: "📰" },
    { id: "bitcoin", name: "Bitcoin", icon: "₿" },
    { id: "ethereum", name: "Ethereum", icon: "Ξ" },
    { id: "blockchain", name: "Blockchain", icon: "🔗" },
    { id: "defi", name: "DeFi", icon: "🏦" },
    { id: "nft", name: "NFT", icon: "🎨" },
  ];

  // Fetch news from backend (CryptoCompare API)
  const fetchNews = async () => {
    setLoading(true);
    try {
      console.log(`📰 Fetching news for category: ${selectedCategory}`);
      
      const response = await fetch(
        `http://localhost:5000/crypto-news?category=${selectedCategory}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch news");
      }

      const data = await response.json();
      
      console.log(`✅ Received ${data.length} articles from backend`);
      
      // Data is already in correct format from backend
      const transformedNews = data.map((article, index) => ({
        id: article.id || article.url + index,
        title: article.title,
        description: article.description,
        source: article.source?.name || article.source || 'Crypto News',
        category: selectedCategory,
        timestamp: new Date(article.publishedAt),
        image: article.urlToImage,
        url: article.url,
        author: article.author,
        content: article.content,
        trending: Math.random() > 0.7, // Random trending for demo
      }));

      setNews(transformedNews);
      setFilteredNews(transformedNews);
      
      if (transformedNews.length > 0) {
        toast.success(`${transformedNews.length} articles loaded!`);
      } else {
        toast.info("No articles found for this category");
      }
      
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      toast.error("Failed to load news. Please try again.");
      setNews([]);
      setFilteredNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing news...");
      fetchNews();
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [selectedCategory]);

  // Filter news by search
  useEffect(() => {
    let filtered = news;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  }, [searchQuery, news]);

  // Time formatter
  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-48 h-48 md:h-32 bg-gray-700 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="flex gap-3">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <Navbar /> */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <FaNewspaper className="text-white" size={24} />
                </div>
                Crypto News
              </h1>
              <p className="text-sm md:text-base text-gray-400 ml-14">
                Stay updated with real-time cryptocurrency news powered by CryptoCompare
              </p>
            </div>

            <button
              onClick={() => {
                toast.info("Refreshing news...");
                fetchNews();
              }}
              disabled={loading}
              className={`self-start lg:self-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Refresh News"
              )}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-4 border border-gray-700/50 shadow-xl hover:scale-[1.02] transition-all">
              <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Total Articles</p>
              <p className="text-2xl font-bold text-white">{news.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-4 border border-gray-700/50 shadow-xl hover:scale-[1.02] transition-all">
              <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Trending</p>
              <p className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                <FaFire size={20} />
                {news.filter(n => n.trending).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-4 border border-gray-700/50 shadow-xl hover:scale-[1.02] transition-all">
              <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Categories</p>
              <p className="text-2xl font-bold text-blue-400">{categories.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-4 border border-gray-700/50 shadow-xl hover:scale-[1.02] transition-all">
              <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Last Updated</p>
              <p className="text-sm font-bold text-green-400 flex items-center gap-1">
                <FaClock size={16} /> {formatTime(new Date())}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-64 pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer transition-all duration-200"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600 hover:scale-105"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          renderSkeleton()
        ) : filteredNews.length === 0 ? (
          <div className="bg-gray-800/60 rounded-xl p-12 text-center border border-gray-700/50">
            <FaNewspaper className="text-5xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No news articles available. Try refreshing or changing category."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchNews();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Clear & Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  {/* Article Image */}
                  <div className="md:w-48 h-48 md:h-32 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-700">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800";
                      }}
                    />
                    {article.trending && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <FaFire /> Trending
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {article.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-blue-400 font-medium">
                        {article.source}
                      </span>
                      {article.author && article.author !== 'Unknown' && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">
                            {article.author}
                          </span>
                        </>
                      )}
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <FaClock size={12} />
                        {formatTime(article.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <div className="md:flex md:items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(article.url, '_blank');
                      }}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                      Read More
                      <FaExternalLinkAlt size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-white">Article Details</h3>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800";
                }}
              />

              {selectedArticle.trending && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                  <FaFire /> Trending Article
                </div>
              )}

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {selectedArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-sm mb-6 pb-6 border-b border-gray-700">
                <span className="text-blue-400 font-medium">
                  {selectedArticle.source}
                </span>
                {selectedArticle.author && selectedArticle.author !== 'Unknown' && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">
                      By {selectedArticle.author}
                    </span>
                  </>
                )}
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 flex items-center gap-1">
                  <FaClock size={12} />
                  {formatTime(selectedArticle.timestamp)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="px-2 py-1 bg-gray-700/50 rounded text-gray-300 capitalize">
                  {selectedArticle.category}
                </span>
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-6">
                {selectedArticle.description}
              </p>

              {selectedArticle.content && selectedArticle.content !== 'Full content not available' && (
                <div className="text-gray-400 text-sm leading-relaxed mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                  {selectedArticle.content}
                </div>
              )}

              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
              >
                Read Full Article
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;