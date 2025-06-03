'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t, i18n, ready } = useTranslation();
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [languageLoaded, setLanguageLoaded] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (ready && mounted) {
      setLanguageLoaded(true);
    }
  }, [ready, mounted]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'pl', name: 'Polski' },
    { code: 'cs', name: 'Čeština' },
    { code: 'it', name: 'Italiano' },
  ];

  const currencies = {
    en: { symbol: '$', price: '39.99' },
    de: { symbol: '€', price: '37.99' },
    fr: { symbol: '€', price: '37.99' },
    es: { symbol: '€', price: '37.99' },
    pl: { symbol: 'zł', price: '169' },
    cs: { symbol: 'Kč', price: '899' },
    it: { symbol: '€', price: '37.99' },
  };

  const currentCurrency = currencies[i18n.language as keyof typeof currencies] || currencies.en;

  if (!mounted || !languageLoaded || !isLoaded) {
    // Loading state
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-400">Loading ThermoChef...</p>
        </div>
      </div>
    );
  }

  const recipeExamples = [
    {
      title: t('pricing.features.conversions') || "Recipe Conversions",
      description: "Instant TM5/TM6/TM7 adaptations",
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: t('hero.features.languages') || "7 Languages",
      description: "Cook in your preferred language",
      gradient: "from-cyan-500 to-purple-500",
    },
    {
      title: t('hero.features.export') || "Export & Share",
      description: "PDF, Print, Email your recipes",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-white font-bold text-xl">ThermoChef</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          {/* Language Selector */}
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-emerald-500 outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-gray-300 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Go to Dashboard
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {t('hero.title') || "Convert Any Recipe for Your Thermomix"}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle') || "Transform any recipe into perfect Thermomix instructions. Compatible with TM5, TM6, and TM7 devices."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:opacity-90 transition-opacity shadow-xl">
                  {t('hero.cta') || "Start Converting"} - {t('pricing.free') || "Free"}
                </button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard/convert">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:opacity-90 transition-opacity shadow-xl">
                  {t('hero.cta') || "Start Converting"}
                </button>
              </Link>
            )}
            <button className="border border-gray-700 text-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:border-gray-600 hover:text-white transition-all">
              View Demo
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {recipeExamples.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl mb-4`} />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Recipe Cards */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/30"
              style={{
                top: `${20 + i * 30}%`,
                left: i % 2 === 0 ? '10%' : '80%',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-32 h-20 bg-gray-700/50 rounded mb-2" />
              <div className="h-3 bg-gray-700/50 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-700/50 rounded w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Choose the plan that's right for you</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.free') || "Free"}</h3>
            <p className="text-gray-400 mb-6">Perfect for trying out</p>
            <div className="text-4xl font-bold text-white mb-6">
              {currentCurrency.symbol}0
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                5 conversions per month
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                Basic recipe storage
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                Email support
              </li>
            </ul>
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                  {t('pricing.getStarted') || "Get Started"}
                </button>
              </SignUpButton>
            )}
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/50 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.pro') || "Pro"}</h3>
            <p className="text-gray-400 mb-6">For serious home cooks</p>
            <div className="text-4xl font-bold text-white mb-6">
              {currentCurrency.symbol}{currentCurrency.price}
              <span className="text-lg font-normal text-gray-400">/year</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                {t('pricing.features.unlimited') || "Unlimited conversions"}
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                {t('pricing.features.storage') || "Unlimited recipe storage"}
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                HD image generation
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                {t('pricing.features.priority') || "Priority support"}
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                {t('pricing.features.export') || "Export capabilities"}
              </li>
            </ul>
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
                  {t('pricing.upgrade') || "Upgrade to Pro"}
                </button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard/subscription">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
                  {t('pricing.upgrade') || "Upgrade to Pro"}
                </button>
              </Link>
            )}
          </motion.div>

          {/* Family Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.family') || "Family"}</h3>
            <p className="text-gray-400 mb-6">Share with loved ones</p>
            <div className="text-4xl font-bold text-white mb-6">
              {currentCurrency.symbol}{parseFloat(currentCurrency.price) * 1.5}
              <span className="text-lg font-normal text-gray-400">/year</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                Everything in Pro
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                5 {t('pricing.features.family') || "family accounts"}
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                {t('pricing.features.sharing') || "Shared recipe collections"}
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                Meal planning calendar
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                Shopping list sync
              </li>
            </ul>
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                  {t('pricing.upgrade') || "Upgrade to Family"}
                </button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard/subscription">
                <button className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
                  {t('pricing.upgrade') || "Upgrade to Family"}
                </button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-white font-bold">ThermoChef</span>
              </div>
              <p className="text-gray-400 text-sm">© 2024 ThermoChef. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}