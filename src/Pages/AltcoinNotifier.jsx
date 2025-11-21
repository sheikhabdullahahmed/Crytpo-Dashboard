// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const AltcoinNotifier = () => {
//    const [index, setIndex] = useState(null);
//   const [loading, setLoading] = useState(true);


//   const fetchAltcoinIndex = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/altcoin-index");
//       const data = await res.json();

//       if (data?.seasonIndex) {
//         const value = data.seasonIndex;
//         setIndex(value);

//         if (value >= 75) toast.success("🚀 Altcoin Season Started!");
//         else if (value <= 25) toast.error("⚡ Bitcoin Season Dominating!");
//         else toast("📊 Mixed Market — Stay Alert!");
//       } else {
//         console.warn("Unexpected data format:", data);
//       }
//     } catch (err) {
//       console.error("Error fetching Altcoin Index:", err);
//       toast.error("Failed to fetch Altcoin Index");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAltcoinIndex();
//    const interval = setInterval(fetchAltcoinIndex, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

// return (
//     <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg max-w-sm mx-auto mt-10 text-center">
//       <Toaster position="top-right" />
//       <h2 className="text-2xl font-bold mb-2">🌕 Altcoin Season Index</h2>
//       <p className="text-4xl font-semibold mb-2">
//         {loading ? "Loading..." : index ? `${index}/100` : "No Data"}
//       </p>
//       <p className="text-sm opacity-70">Auto-updating every 5 min</p>
//     </div>
// )
// };

// export default AltcoinNotifier;
