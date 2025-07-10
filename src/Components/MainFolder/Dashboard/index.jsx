import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/portfolio", {
          withCredentials: true,
        });

        setCoins(res.data.coins);

        const total = res.data.coins.reduce((acc, coin) => {
          return acc + coin.currentPrice * coin.quantity;
        }, 0);

        setTotalValue(total);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
        alert("Please login again");
        navigate("/login");
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">📊 Crypto Portfolio Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Total Portfolio Value</h2>
        <p className="text-2xl text-green-600">${totalValue.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coins.map((coin) => (
          <div key={coin._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{coin.name} ({coin.symbol})</h3>
            <p>Quantity: {coin.quantity}</p>
            <p>Buy Price: ${coin.buyPrice}</p>
            <p>Current Price: ${coin.currentPrice}</p>
            <p className={`font-semibold ${coin.currentPrice > coin.buyPrice ? "text-green-600" : "text-red-500"}`}>
              P/L: ${(coin.currentPrice - coin.buyPrice) * coin.quantity}
            </p>
            <button
              onClick={() => navigate(`/edit/${coin._id}`)}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
