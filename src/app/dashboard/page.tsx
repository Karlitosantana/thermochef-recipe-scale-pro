'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data - in real app this would come from API/database
  const stats = {
    totalRecipes: 89,
    totalConversions: 234,
    totalCollections: 12,
    monthlyConversions: 127,
    subscriptionTier: 'PRO',
  };

  const recentRecipes = [
    { id: 1, title: 'Pasta Carbonara', device: 'TM6', time: '25 min', rating: 4.9 },
    { id: 2, title: 'Chocolate Soufflé', device: 'TM5', time: '45 min', rating: 4.8 },
    { id: 3, title: 'Thai Green Curry', device: 'TM6', time: '30 min', rating: 4.7 },
    { id: 4, title: 'Homemade Bread', device: 'TM6', time: '2h 15min', rating: 4.9 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!mounted) return null;

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-white mb-2">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-gray-300 text-lg">
          {t('dashboard.subtitle')}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={itemVariants}
      >
        <StatsCard
          title={t('dashboard.stats.totalRecipes')}
          value={stats.totalRecipes}
          icon="📖"
          trend="+12%"
          color="emerald"
        />
        <StatsCard
          title={t('dashboard.stats.conversions')}
          value={stats.totalConversions}
          icon="🔄"
          trend="+8%"
          color="cyan"
        />
        <StatsCard
          title={t('dashboard.stats.collections')}
          value={stats.totalCollections}
          icon="📁"
          color="purple"
        />
        <StatsCard
          title={t('dashboard.stats.thisMonth')}
          value={stats.monthlyConversions}
          icon="📊"
          description={stats.subscriptionTier === 'FREE' ? `${5 - stats.monthlyConversions} remaining` : 'Unlimited'}
          color="orange"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Recipes */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-white">{t('dashboard.recentRecipes')}</h2>
          <div className="space-y-4">
            {recentRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍝</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {recipe.device} • {recipe.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <span>★</span>
                      <span className="text-white font-medium">{recipe.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div 
          className="space-y-6"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-white">{t('dashboard.quickActions')}</h2>
          <div className="space-y-4">
            <QuickActionCard
              title={t('dashboard.actions.convertRecipe')}
              description={t('dashboard.actions.convertDescription')}
              icon="🔄"
              href="/dashboard/convert"
              color="emerald"
            />
            <QuickActionCard
              title={t('dashboard.actions.viewCollections')}
              description={t('dashboard.actions.collectionsDescription')}
              icon="📁"
              href="/dashboard/collections"
              color="cyan"
            />
            <QuickActionCard
              title={t('dashboard.actions.mealPlanning')}
              description={t('dashboard.actions.planningDescription')}
              icon="📅"
              href="/dashboard/meal-planning"
              color="purple"
            />
          </div>

          {/* Usage Overview */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.usageOverview')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{t('dashboard.conversionsUsed')}</span>
                <span className="text-white font-medium">{stats.monthlyConversions}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: stats.subscriptionTier === 'FREE' ? `${(stats.monthlyConversions / 5) * 100}%` : '100%' }}
                />
              </div>
              <div className="text-xs text-gray-400">
                {stats.subscriptionTier === 'FREE' 
                  ? `${5 - stats.monthlyConversions} conversions remaining`
                  : 'Unlimited conversions'
                }
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA for Free Users */}
      {stats.subscriptionTier === 'FREE' && (
        <motion.div 
          className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20"
          variants={itemVariants}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {t('dashboard.upgradeTitle')}
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('dashboard.upgradeDescription')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              {t('dashboard.upgradeCta')}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatsCard({ title, value, icon, trend, description, color }: {
  title: string;
  value: number | string;
  icon: string;
  trend?: string;
  description?: string;
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
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl p-6 border transition-all group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className="text-sm text-emerald-400 font-medium">{trend}</span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

function QuickActionCard({ title, description, icon, href, color }: {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'emerald' | 'cyan' | 'purple';
}) {
  const colorClasses = {
    emerald: 'hover:border-emerald-500/50',
    cyan: 'hover:border-cyan-500/50',
    purple: 'hover:border-purple-500/50',
  };

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      className={`block bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 ${colorClasses[color]} transition-all group`}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </motion.a>
  );
}