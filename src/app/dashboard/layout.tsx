'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Desktop Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0f1c]/90 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-8"
            >
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg" />
                <span className="text-xl font-bold text-white">ThermoChef</span>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard.nav.dashboard')}
                </Link>
                <Link
                  href="/dashboard/convert"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard.nav.convert')}
                </Link>
                <Link
                  href="/dashboard/recipes"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard.nav.recipes')}
                </Link>
                <Link
                  href="/dashboard/collections"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard.nav.collections')}
                </Link>
                <Link
                  href="/dashboard/meal-planning"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard.nav.mealPlanning')}
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard.nav.analytics')}
                </Link>
              </nav>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {/* Language Selector */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <span className="text-lg">{currentLang.flag}</span>
                  <span className="text-sm hidden sm:block">{currentLang.code.toUpperCase()}</span>
                </button>
              </div>

              <Link
                href="/dashboard/subscription"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {t('dashboard.nav.subscription')}
              </Link>
              
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-emerald-500/20",
                    userButtonPopoverCard: "bg-gray-900 border border-gray-700",
                    userButtonPopoverText: "text-gray-300",
                  },
                }}
              />

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative w-64 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-700"
          >
            <DashboardNav mobile onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-700/50 bg-gray-900/50 backdrop-blur-xl lg:block">
        <DashboardNav />
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}