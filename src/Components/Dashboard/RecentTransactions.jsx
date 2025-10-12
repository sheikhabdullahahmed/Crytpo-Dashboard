import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentTransactions = ({ transactions = [] }) => {
  const navigate = useNavigate();

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Transactions
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Transactions Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your crypto portfolio by adding your first transaction
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Add Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <button
          onClick={() => navigate('/user/transactions')}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'buy'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                <span className="text-lg">
                  {transaction.type === 'buy' ? '➕' : '➖'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'buy'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {transaction.coinSymbol}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transaction.amount} {transaction.coinSymbol} @ $
                  {transaction.pricePerCoin.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                ${transaction.totalValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {timeAgo(transaction.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;