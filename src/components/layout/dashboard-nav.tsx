'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function DashboardNav({ mobile = false, onClose }: DashboardNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    {
      title: t('dashboard.nav.overview'),
      href: '/dashboard',
      icon: '📊',
    },
    {
      title: t('dashboard.nav.convert'),
      href: '/dashboard/convert',
      icon: '🔄',
    },
    {
      title: t('dashboard.nav.recipes'),
      href: '/dashboard/recipes',
      icon: '📖',
    },
    {
      title: t('dashboard.nav.collections'),
      href: '/dashboard/collections',
      icon: '📁',
    },
    {
      title: t('dashboard.nav.mealPlanning'),
      href: '/dashboard/meal-planning',
      icon: '📅',
    },
    {
      title: t('dashboard.nav.analytics'),
      href: '/dashboard/analytics',
      icon: '📈',
    },
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav 
      className="space-y-1 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || 
          (item.href !== '/dashboard' && pathname.startsWith(item.href));
        
        return (
          <motion.div key={item.href} variants={itemVariants}>
            <Link
              href={item.href}
              onClick={mobile ? onClose : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/30'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50'
              )}
            >
              <span className={cn(
                "text-xl transition-transform group-hover:scale-110",
                isActive && "text-emerald-400"
              )}>
                {item.icon}
              </span>
              <span className="font-medium">{item.title}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-2 h-2 bg-emerald-400 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
      
      <motion.div 
        className="!mt-8 border-t border-gray-700/50 pt-4"
        variants={itemVariants}
      >
        <Link
          href="/dashboard/subscription"
          onClick={mobile ? onClose : undefined}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50 group"
        >
          <span className="text-xl transition-transform group-hover:scale-110">💎</span>
          <span className="font-medium">{t('dashboard.nav.subscription')}</span>
        </Link>
        <Link
          href="/dashboard/help"
          onClick={mobile ? onClose : undefined}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50 group"
        >
          <span className="text-xl transition-transform group-hover:scale-110">❓</span>
          <span className="font-medium">{t('dashboard.nav.help')}</span>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="!mt-8 space-y-3"
        variants={itemVariants}
      >
        <div className="px-4 py-3 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">{t('dashboard.nav.thisMonth')}</div>
          <div className="text-lg font-bold text-white">127</div>
          <div className="text-xs text-emerald-400">{t('dashboard.nav.conversions')}</div>
        </div>
        
        <div className="px-4 py-3 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">{t('dashboard.nav.savedRecipes')}</div>
          <div className="text-lg font-bold text-white">89</div>
          <div className="text-xs text-cyan-400">{t('dashboard.nav.recipes')}</div>
        </div>
      </motion.div>
    </motion.nav>
  );
}