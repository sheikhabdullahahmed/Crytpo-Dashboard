
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Dashboard = () => {
//   const [holdings, setHoldings] = useState([]);
//   const [coinId, setCoinId] = useState("");
//   const [symbol, setSymbol] = useState("");
//   const [amount, setAmount] = useState("");
//   const [buyPrice, setBuyPrice] = useState("");
//   const [prices, setPrices] = useState({});

//   const token = localStorage.getItem("token");

//   const fetchHoldings = async () => {
//     const res = await axios.get("http://localhost:5000/api/portfolio/my", {
//       headers: { Authorization: token },
//     });
//     setHoldings(res.data);
//   };

//   const fetchPrices = async () => {
//     const ids = holdings.map((h) => h.coinId).join(",");
//     if (!ids) return;
//     const res = await axios.get(
//       `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
//     );
//     setPrices(res.data);
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     await axios.post(
//       "http://localhost:5000/api/portfolio/add",
//       { coinId, symbol, amount, buyPrice },
//       { headers: { Authorization: token } }
//     );
//     setCoinId("");
//     setSymbol("");
//     setAmount("");
//     setBuyPrice("");
//     fetchHoldings();
//   };

//   useEffect(() => {
//     fetchHoldings();
//   }, []);

//   useEffect(() => {
//     fetchPrices();
//   }, [holdings]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl mb-4">Your Portfolio</h1>
//       <form onSubmit={handleAdd} className="mb-6 space-y-2">
//         <input placeholder="Coin ID (e.g. bitcoin)" value={coinId} onChange={(e) => setCoinId(e.target.value)} className="p-2 border rounded w-full" />
//         <input placeholder="Symbol (e.g. BTC)" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="p-2 border rounded w-full" />
//         <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="p-2 border rounded w-full" />
//         <input placeholder="Buy Price (USD)" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="p-2 border rounded w-full" />
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Coin</button>
//       </form>

//       <table className="w-full text-left">
//         <thead>
//           <tr>
//             <th className="border p-2">Symbol</th>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Buy Price</th>
//             <th className="border p-2">Current Price</th>
//             <th className="border p-2">Value (USD)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {holdings.map((h) => (
//             <tr key={h._id}>
//               <td className="border p-2">{h.symbol.toUpperCase()}</td>
//               <td className="border p-2">{h.amount}</td>
//               <td className="border p-2">${h.buyPrice}</td>
//               <td className="border p-2">${prices[h.coinId]?.usd || "-"}</td>
//               <td className="border p-2">${(prices[h.coinId]?.usd * h.amount || 0).toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Dashboard;








     

import React from 'react'

function index() {
  return (
    <div>index</div>
  )
}

export default index