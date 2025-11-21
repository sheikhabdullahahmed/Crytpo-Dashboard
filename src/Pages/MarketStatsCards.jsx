import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const sampleData = [
  { value: 100 },
  { value: 120 },
  { value: 90 },
  { value: 80 },
  { value: 95 },
  { value: 85 },
  { value: 70 },
];

const formatNumber = (num) => {
  if (num >= 1_000_000_000_000)
    return (num / 1_000_000_000_000).toFixed(2) + "T";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  return num.toLocaleString();
};

const DashboardCards = () => {
  const [globalData, setGlobalData] = useState(null);
  const [fearGreed, setFearGreed] = useState({
    value: "0",
    value_classification: "Loading",
  });

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/global");
        setGlobalData(res.data.data);
      } catch (error) {
        console.error("Error fetching global data:", error);
      }
    };

    fetchGlobalData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchGlobalData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFearGreed = async () => {
      try {
        const res = await axios.get("https://api.alternative.me/fng/");
        setFearGreed(res.data.data[0]);
      } catch (error) {
        console.error("Error fetching Fear & Greed Index:", error);
      }
    };
    fetchFearGreed();
  }, []);

  const marketCapValue = globalData?.total_market_cap?.usd;
  const marketCap = marketCapValue
    ? formatNumber(marketCapValue)
    : "Loading...";
  const marketChange = globalData?.market_cap_change_percentage_24h_usd ?? 0;
  const isPositive = marketChange >= 0;

  return (
    <div className="grid grid-cols-1  bg-[#111827] sm:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
      {/* 🟢 Market Cap */}
      {/* <div className="bg-gray-700 text-white  rounded-4xl p-4 shadow-lg"> */}
      <div
        className="bg-gray-700 text-white rounded-4xl p-4 shadow-lg 
  transition-all duration-300 
  hover:outline  hover:outline-blue-500  "
      >
        <h3 className="text-sm font-semibold  text-white">Market Cap</h3>
        <div className="flex justify-between items-end mt-1">
          <div>
            <p className="text-xl font-bold">${formatNumber(marketCap)}</p>
            <p
              className={`text-sm font-medium ${
                isPositive ? "text-green-400" : "text-red-500"
              }`}
            >
              {isPositive ? "▲" : "▼"} {Math.abs(marketChange).toFixed(2)}%
            </p>
          </div>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleData}>
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#chartFill)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🟠 CMC20 */}
      <div
        className="bg-gray-700 transition-all duration-300 
  hover:outline  hover:outline-blue-500  text-white rounded-4xl p-4 shadow-lg"
      >
        <h3 className="text-sm font-semibold  text-white">CMC20</h3>
        <div className="flex justify-between items-end mt-1">
          <div>
            <p className="text-xl font-bold">$231.54</p>
            <p className="text-red-500 text-sm font-medium">▼ 2.91%</p>
          </div>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleData}>
                <defs>
                  <linearGradient id="chartFill2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#chartFill)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🟡 Fear & Greed */}
      {/* 🟡 Fear & Greed */}
      <div
        className="bg-gray-700 transition-all duration-300 
  hover:outline hover:outline-blue-500 text-white rounded-4xl p-4 shadow-lg flex flex-col items-center justify-center"
      >
        <h3 className="text-sm font-semibold text-white mb-1">Fear & Greed</h3>
        <div className="w-full flex flex-col items-center">
          <div className="w-24 h-12 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-t-full relative">
            <div
              className="absolute w-3 h-3 bg-white rounded-full shadow-md"
              style={{ left: `${fearGreed.value}%`, top: "55%" }}
            ></div>
          </div>
          <p className="text-2xl font-bold mt-2">{fearGreed.value}</p>
          <p className="text-white text-sm">{fearGreed.value_classification}</p>
        </div>
      </div>

      {/* 🔵 Altcoin Season */}
      <div
        className="bg-gray-700 transition-all duration-300 
  hover:outline  hover:outline-blue-500  text-white rounded-4xl p-4 shadow-lg"
      >
        <h3 className="text-sm font-semibold text-gray-300">Altcoin Season</h3>
        <p className="text-2xl font-bold mt-1">
          28<span className="text-white text-base">/100</span>
        </p>
        <div className="w-full h-2 bg-gray-700 rounded-full mt-2 relative">
          <div className="absolute left-[28%] top-[-2px] w-3 h-3 bg-white rounded-full shadow" />
          <div
            className="absolute top-0 left-0 h-2 rounded-l-full bg-orange-500"
            style={{ width: "28%" }}
          />
        </div>
        <div className="flex justify-between text-xs text-white mt-1">
          <span>Bitcoin</span>
          <span>Altcoin</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
