// ============================================
// 📁 backend/routes/news.js
// ✅ 100% WORKING - NO API KEY NEEDED!
// Replace your ENTIRE file with this code
// ============================================

const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/crypto-news', async (req, res) => {
  try {
    console.log('📰 Fetching crypto news from CryptoCompare...');
    
    const category = req.query.category || 'cryptocurrency';
    
    // CryptoCompare API - FREE, NO KEY NEEDED!
    const response = await axios.get(
      'https://min-api.cryptocompare.com/data/v2/news/',
      {
        params: {
          lang: 'EN',
          sortOrder: 'latest'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (!response.data || !response.data.Data) {
      console.log('⚠️ No data received from API');
      return res.json([]);
    }
    
    // Filter by category if needed
    let articles = response.data.Data;
    
    if (category !== 'cryptocurrency') {
      articles = articles.filter(item => {
        const tags = (item.tags || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        const body = (item.body || '').toLowerCase();
        
        return tags.includes(category) || 
               title.includes(category) || 
               body.includes(category);
      });
    }
    
    // Transform to standard format
    const transformedArticles = articles.slice(0, 50).map((item, index) => ({
      id: item.id || index,
      title: item.title || 'No title',
      description: item.body ? item.body.substring(0, 250) + '...' : 'No description',
      url: item.url || item.guid || '#',
      urlToImage: item.imageurl || 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
      publishedAt: new Date(item.published_on * 1000).toISOString(),
      source: {
        id: item.source || 'crypto-news',
        name: item.source_info?.name || item.source || 'Crypto News'
      },
      author: item.source_info?.name || 'Unknown',
      content: item.body || 'Full content not available'
    }));
    
    console.log(`✅ Successfully fetched ${transformedArticles.length} articles`);
    res.json(transformedArticles);
    
  } catch (error) {
    console.error('❌ Error fetching news:', error.message);
    
    // Send detailed error for debugging
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});










// router.get("/altcoin-index", async (req, res) => {
//   try {
//     const response = await fetch("https://api.blockchaincenter.net/api/altcoin-season");
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });



// Health check route

// router.get('/test-news', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'News API route is working!',
//     endpoint: '/api/crypto-news',
//     timestamp: new Date().toISOString()
//   });
// });

module.exports = router;

