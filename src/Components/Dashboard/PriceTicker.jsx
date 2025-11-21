import React, { useState, useEffect } from 'react';

const PriceTicker = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
  try {
    const response = await fetch('http://localhost:5000/prices');
    const data = await response.json();
    // console.log("Fetched data:", data);

    if (Array.isArray(data)) {
      setCoins(data);
    } else {
      console.error("Unexpected data format:", data);
      setCoins([]); // prevent error
    }

    setLoading(false);
  } catch (error) {
    console.error("Error fetching prices:", error);
    // setCoins([]);
    // setLoading(false);
  }
};


    fetchPrices();
    const interval = setInterval(fetchPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 overflow-hidden">
        <div className="animate-pulse flex gap-6 px-4">
          {[1, 2, 3, 9, 10].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {[...coins, ...coins].map((coin, index) => (
            <div
              key={`${coin.id}-${index}`}
              className="ticker-item inline-flex items-center gap-2 px-4"
            >
              <img src={coin.image} alt={coin.symbol} className="w-5 h-5" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                ${coin.current_price.toLocaleString()}
              </span>
              <span className={`text-sm font-medium ${
                coin.price_change_percentage_24h >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;