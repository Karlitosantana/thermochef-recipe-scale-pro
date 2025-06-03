'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Mock data
  const stats = {
    totalConversions: 1234,
    avgPerDay: 41.1,
    popularDevice: 'TM6',
    topRecipeType: 'Main Dishes',
  };

  const recentActivity = [
    { recipe: 'Pasta Carbonara', device: 'TM6', time: '2 hours ago', type: 'conversion' },
    { recipe: 'Chocolate Soufflé', device: 'TM5', time: '5 hours ago', type: 'conversion' },
    { recipe: 'Thai Green Curry', device: 'TM6', time: '1 day ago', type: 'creation' },
    { recipe: 'Homemade Bread', device: 'TM6', time: '2 days ago', type: 'conversion' },
  ];

  const deviceStats = [
    { name: 'TM6', percentage: 65, color: 'emerald' },
    { name: 'TM5', percentage: 30, color: 'cyan' },
    { name: 'TM7', percentage: 5, color: 'purple' },
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-300 text-lg">Track your recipe conversion performance</p>
        </div>
        
        {/* Period Selector */}
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Conversions"
          value={stats.totalConversions.toLocaleString()}
          change="+12%"
          icon="🔄"
          color="emerald"
        />
        <StatsCard
          title="Average Per Day"
          value={stats.avgPerDay.toFixed(1)}
          change="+8%"
          icon="📊"
          color="cyan"
        />
        <StatsCard
          title="Popular Device"
          value={stats.popularDevice}
          subtitle="65% of conversions"
          icon="📱"
          color="purple"
        />
        <StatsCard
          title="Top Recipe Type"
          value={stats.topRecipeType}
          subtitle="45% of recipes"
          icon="🍝"
          color="orange"
        />
      </motion.div>

      {/* Device Distribution */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Device Distribution</h3>
        <div className="space-y-4">
          {deviceStats.map((device) => (
            <div key={device.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">{device.name}</span>
                <span className="text-sm font-medium text-white">{device.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${device.percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    device.color === 'emerald' ? 'from-emerald-500 to-emerald-400' :
                    device.color === 'cyan' ? 'from-cyan-500 to-cyan-400' :
                    'from-purple-500 to-purple-400'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'conversion' 
                    ? 'bg-emerald-500/20' 
                    : 'bg-cyan-500/20'
                }`}>
                  <span className="text-lg">
                    {activity.type === 'conversion' ? '🔄' : '✨'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{activity.recipe}</h4>
                  <p className="text-xs text-gray-400">
                    {activity.device} • {activity.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatsCard({ title, value, change, subtitle, icon, color }: {
  title: string;
  value: string;
  change?: string;
  subtitle?: string;
  icon: string;
  color: 'emerald' | 'cyan' | 'purple' | 'orange';
}) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl p-6 border transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}