// src/WalletLogin.js
import React, { useState } from "react";
import { ethers } from "ethers";

export default function WalletLogin() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        alert("Wallet Connected: " + address);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask not found! Install MetaMask extension.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Connect Wallet
      </button>
      {account && <p className="mt-4">Connected Account: {account}</p>}
    </div>
  );
}
