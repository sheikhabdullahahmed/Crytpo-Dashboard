// frontend/src/Pages/Watchlist.jsx
import React, { useState, useEffect, useMemo } from "react";
import { FaStar, FaSearch, FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromWatchlist,
  clearWatchlist,
  addToWatchlist,
} from "../features/watchlistSlice";
import { toast } from "react-toastify";
import Sparkline from "../Pages/Sparkline";

const Watchlist = ({ currentPage = 1, coinsPerPage = 10 }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.items);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [viewMode, setViewMode] = useState("desktop");
  const [showModal, setShowModal] = useState(false);
  const [coinsList, setCoinsList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    if (showModal) {
      const fetchCoins = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/coins?page=${currentPage}&per_page=${coinsPerPage}&sparkline=true`
          );
          const data = await res.json();
          setCoinsList(data);
        } catch (err) {
          toast.error("Failed to load coins");
        }
      };
      fetchCoins();
    }
  }, [showModal, currentPage, coinsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredCoins(watchlist);
      } else {
        const filtered = watchlist.filter(
          (coin) =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCoins(filtered);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, watchlist]);

  const handleRemove = (coin) => {
    dispatch(removeFromWatchlist(coin.id));
    toast.info(`${coin.name} removed from Watchlist`);
  };

  const handleClearAll = () => {
    dispatch(clearWatchlist());
    toast.success("Watchlist cleared!");
  };

  const formatNumber = (num) => {
    if (!num) return "-";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const totalValue = useMemo(
    () => watchlist.reduce((acc, coin) => acc + (coin.current_price || 0), 0),
    [watchlist]
  );

  const handleAddCoin = () => {
    if (selectedCoin) {
      dispatch(
        addToWatchlist({
          id: selectedCoin.id,
          name: selectedCoin.name,
          symbol: selectedCoin.symbol,
          image: selectedCoin.image,
          current_price: selectedCoin.current_price,
          market_cap: selectedCoin.market_cap,
          market_cap_rank: selectedCoin.market_cap_rank,
          price_change_percentage_24h: selectedCoin.price_change_percentage_24h,
          sparkline_in_7d: {
            price: selectedCoin.sparkline_in_7d?.price || [],
          },
          circulating_supply: selectedCoin.circulating_supply,
        })
      );

      toast.success(`${selectedCoin.name} added to Watchlist`);
      setShowModal(false);
      setSelectedCoin(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
                  <FaStar className="text-white" size={24} />
                </div>
                My Watchlist
              </h1>
              <p className="text-sm md:text-base text-gray-400 ml-14">
                Track your favorite cryptocurrencies in real-time
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                <FaPlus size={14} />
                <span className="hidden sm:inline">Add Asset</span>
                <span className="sm:hidden">Add</span>
              </button>

              {watchlist.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
                >
                  <FaTrash size={14} />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          {watchlist.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-600">
                <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Total Coins</p>
                <p className="text-3xl font-bold text-white">
                  {watchlist.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-600">
                <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Total Value</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {formatNumber(totalValue)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-600 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Avg. 24h Change</p>
                {(() => {
                  const avgChange =
                    watchlist.reduce(
                      (acc, coin) =>
                        acc + (coin.price_change_percentage_24h || 0),
                      0
                    ) / watchlist.length;

                  const isPositive = avgChange >= 0;

                  return (
                    <p
                      className={`text-3xl font-bold flex items-center gap-2 ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <span className="text-2xl">{isPositive ? "▲" : "▼"}</span>
                      {Math.abs(avgChange).toFixed(2)}%
                    </p>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {watchlist.length > 0 && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-4 mb-6 border border-gray-700/50">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coins by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl p-12 md:p-16 text-center border border-gray-700/50 shadow-2xl">
            <div className="max-w-md mx-auto">
              <div className="inline-block p-6 bg-gray-700/50 rounded-full mb-6">
                <FaStar className="text-6xl text-gray-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Your Watchlist is Empty
              </h2>
              <p className="text-gray-400 mb-8 text-base">
                Start tracking cryptocurrencies to monitor their performance and stay updated with market trends
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                <FaPlus />
                Add Your First Coin
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            {viewMode === "mobile" && (
              <div className="space-y-4">
                {filteredCoins.map((coin) => (
                  <div
                    key={coin.id}
                    className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-4 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-12 h-12 rounded-full shadow-md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white text-lg truncate">
                            {coin.name}
                          </div>
                          <div className="text-sm text-gray-400 uppercase font-medium">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(coin)}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1 font-medium">Price</div>
                        <div className="text-white font-bold text-lg">
                          {formatNumber(coin.current_price)}
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1 font-medium">24h Change</div>
                        <div
                          className={`font-bold text-lg flex items-center gap-1 ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1 font-medium">Market Cap</div>
                        <div className="text-white font-semibold">
                          {formatNumber(coin.market_cap)}
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1 font-medium">Rank</div>
                        <div className="text-white font-semibold text-lg">
                          #{coin.market_cap_rank}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">7 Day Chart</span>
                        <Sparkline
                          data={
                            coin.sparkline_in_7d?.price?.map((p) => ({
                              price: p,
                            })) || []
                          }
                          isUp={coin.price_change_percentage_24h >= 0}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Desktop Table View */}
            {viewMode === "desktop" && (
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead className="bg-gray-900/80 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-300 uppercase tracking-wider w-20">
                          Action
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[220px]">
                          Name
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider w-36">
                          Price
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider w-36">
                          24h Change
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider w-36">
                          Market Cap
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider w-44">
                          Supply
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-300 uppercase tracking-wider w-36">
                          7d Chart
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredCoins.map((coin) => (
                        <tr
                          key={coin.id}
                          className="hover:bg-gray-700/30 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleRemove(coin)}
                              className="p-2 text-yellow-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all duration-200"
                              title="Remove from watchlist"
                            >
                              <FaStar size={18} />
                            </button>
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-gray-300">
                            #{coin.market_cap_rank}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-10 h-10 rounded-full shadow-md"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate text-base">
                                  {coin.name}
                                </p>
                                <p className="text-xs text-gray-400 uppercase font-medium">
                                  {coin.symbol}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right text-base text-white font-bold">
                            {formatNumber(coin.current_price)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                                coin.price_change_percentage_24h >= 0
                                  ? " text-green-400"
                                  : " text-red-400"
                              }`}
                            >
                              {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
                              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right text-sm text-white font-semibold">
                            {formatNumber(coin.market_cap)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="text-white font-semibold text-sm">
                              {formatNumber(coin.circulating_supply)}
                            </div>
                            <div className="text-gray-400 text-xs uppercase font-medium mt-0.5">
                              {coin.symbol}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <Sparkline
                                data={
                                  coin.sparkline_in_7d?.price?.map((p) => ({
                                    price: p,
                                  })) || []
                                }
                                isUp={coin.price_change_percentage_24h >= 0}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredCoins.length === 0 && searchQuery && (
              <div className="bg-gray-800/60 rounded-xl p-12 text-center border border-gray-700/50">
                <p className="text-gray-400 text-lg">
                  No cryptocurrencies found matching "<span className="text-white font-semibold">{searchQuery}</span>"
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaPlus className="text-blue-400" />
                Add New Asset
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCoin(null);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <select
                onChange={(e) =>
                  setSelectedCoin(coinsList.find((c) => c.id === e.target.value))
                }
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a Coin</option>
                {coinsList.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>

              {selectedCoin && (
                <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <img
                    src={selectedCoin.image}
                    alt={selectedCoin.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-semibold">{selectedCoin.name}</p>
                    <p className="text-gray-400 text-sm">{selectedCoin.symbol.toUpperCase()}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedCoin(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCoin}
                  disabled={!selectedCoin}
                  className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${
                    selectedCoin
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/50"
                      : "bg-gray-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;