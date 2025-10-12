import React from 'react';

const StatsCard = ({ icon, title, value, subValue, trend, isPositive }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Main Value */}
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>

      {/* Sub Value / Trend */}
      {subValue && (
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${
            isPositive === true 
              ? 'text-green-600 dark:text-green-400' 
              : isPositive === false 
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {trend && (
              <span className="mr-1">
                {isPositive ? '↗' : isPositive === false ? '↘' : ''}
              </span>
            )}
            {subValue}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;