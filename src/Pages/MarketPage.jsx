// frontend/src/Pages/Market.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";
import Pagination from "../Pages/Pagination";
import Sparkline from "../Pages/Sparkline";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../features/watchlistSlice";
import { toast } from "react-toastify";
// import Watchlist from "./Watchh";


const MarketPage = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.items);

  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "market_cap_rank",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [globalData, setGlobalData] = useState(null);
  const [totalCoins, setTotalCoins] = useState(0);
  const [error, setError] = useState(null);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const coinsPerPage = 100;

  // ✅ Fetch coins
  const fetchCoins = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/coins?page=${currentPage}&per_page=${coinsPerPage}`
      );


      

      if (!response.ok) {
        if (response.status === 429) {
          setError("Too many requests — retrying soon...");
          let countdown = 10;
          setRetryCountdown(countdown);

          const timer = setInterval(() => {
            countdown--;
            setRetryCountdown(countdown);
            if (countdown === 0) {
              clearInterval(timer);
              fetchCoins();
            }
          }, 1000);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCoins(data);
        setFilteredCoins(data);
        setError(null);
        setRetryCountdown(0);
      } else {
        console.error("Unexpected data format:", data);
        setCoins([]);
        setFilteredCoins([]);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
      setCoins([]);
      setFilteredCoins([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch global data
  const fetchGlobalData = async () => {
    try {
      const response = await fetch("http://localhost:5000/global");
      const data = await response.json();
      if (data?.data?.active_cryptocurrencies) {
        setGlobalData(data.data);
        setTotalCoins(data.data.active_cryptocurrencies);
      }
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  // ✅ Pagination change handler
  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Fetch on mount & refresh every 5 min
  useEffect(() => {
    fetchCoins();
    fetchGlobalData();

    const interval = setInterval(() => {
      fetchCoins();
      fetchGlobalData();
    }, 300000);

    return () => clearInterval(interval);
  }, [currentPage]);

  // ✅ Search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
  }, [searchQuery, coins]);

  // ✅ Sorting
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sorted = [...filteredCoins].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCoins(sorted);
  };

  // ✅ Toggle Redux Watchlist
  const toggleWatchlist = (coin) => {
    const exists = watchlist.some((item) => item.id === coin.id);
    if (exists) {
      dispatch(removeFromWatchlist(coin.id));
      toast.info(`${coin.name} removed from Watchlist`);
    } else {
      dispatch(addToWatchlist(coin));
      toast.success(`${coin.name} added to Watchlist`);
    }
  };

  // ✅ Number formatter
  const formatNumber = (num) => {
    if (!num) return "-";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatFullNumber = (num) => {
  if (num == null || isNaN(num)) return "-";
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};




 const renderSkeleton = () => (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="animate-pulse divide-y divide-gray-700">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="w-24 h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="w-16 h-4 bg-gray-700 rounded"></div>
            <div className="w-20 h-4 bg-gray-700 rounded"></div>
            <div className="w-24 h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );




  // ✅ Loader
  // if (loading && coins.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
  //         <p className="text-gray-400">Loading market data...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
           {/* <Watchlist currentPage={1} coinsPerPage={10} />  kal aat */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Cryptocurrency Prices by Market Cap
          </h1>
          {error && (
            <p className="text-yellow-500 text-sm">
              {error} {retryCountdown > 0 && `(${retryCountdown}s)`}
            </p>
          )}
          <p className="text-sm md:text-base text-gray-400 flex items-center gap-1 flex-wrap">
            {globalData ? (
              <>
                The global cryptocurrency market cap today is{" "}
                <span className="font-semibold text-blue-400">
                  {formatNumber(globalData.total_market_cap.usd)}
                </span>{" "}
                (
                {globalData.market_cap_change_percentage_24h_usd >= 0 ? (
                  <span className="text-green-400 flex items-center gap-1">
                    ▲
                    {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}
                    %
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    ▼
                    {Math.abs(
                      globalData.market_cap_change_percentage_24h_usd
                    ).toFixed(2)}
                    %
                  </span>
                )}
                ) in the last 24h.
              </>
            ) : (
              "Loading global market data..."
            )}
          </p>
        </div>

        {/* Search */}
        <div className="bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <button
              onClick={async () => {
                toast.info("Refreshing data...");
                await fetchCoins();
                toast.success("Data refreshed!");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          renderSkeleton()
        ) : (
        <div className="bg-gray-800 rounded-xl cursor-pointer shadow-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">
                    Watch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[200px]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
                    24h Change
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
                    Market Cap
                  </th>
                  {/* ✅ Added Circulating Supply header */}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-40">
                    Circulating Supply
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
                    7d Chart
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredCoins.map((coin) => {
                  const isInWatchlist = watchlist.some(
                    (item) => item.id === coin.id
                  );

                  return (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      {/* ⭐ Watchlist */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleWatchlist(coin)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          {isInWatchlist ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar />
                          )}
                        </button>
                      </td>

                      {/* # Rank */}
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {coin.market_cap_rank}
                      </td>

                      {/* Name + Symbol */}
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {coin.name}
                          </p>
                          <p className="text-xs text-gray-400 uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right text-sm text-white">
                        {formatNumber(coin.current_price)}
                      </td>

                      {/* 24h Change */}
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-sm font-medium ${
                            coin.price_change_percentage_24h >= 0
                              ? " text-green-400"
                              : " text-red-400"
                          }`}
                        >
                          {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(
                            2
                          )}
                          %
                        </span>
                      </td>

                      {/* Market Cap */}
                      <td className="px-4 py-3 text-right text-sm text-white">
                        {formatFullNumber(coin.market_cap)}
                        
                      </td>

                      {/* ✅ Circulating Supply (Fixed) */}
                      <td className="px-4 py-3 text-right text-sm">
                        <div className="text-white font-medium">
                          {formatFullNumber(coin.circulating_supply)}
                        </div>
                        <div className="text-gray-400 text-xs uppercase">
                          {coin.symbol}
                        </div>
                      </td>

                      {/* 7d Sparkline Chart */}
                      <td className="px-4 py-3 text-center">
                        <Sparkline
                          data={
                            coin.sparkline_in_7d?.price?.map((p) => ({
                              price: p,
                            })) || []
                          }
                          isUp={coin.price_change_percentage_24h >= 0}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )} 

        {/* Pagination */}
        {totalCoins > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCoins / coinsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default MarketPage;
