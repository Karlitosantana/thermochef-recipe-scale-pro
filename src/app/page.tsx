'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
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
      // Set default language to English if not set
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      } else {
        i18n.changeLanguage('en');
        localStorage.setItem('language', 'en');
      }
      setLanguageLoaded(true);
    }
  }, [i18n, ready, mounted]);

  const currencies = {
    en: { symbol: '$', price: '39.99' },
    de: { symbol: '€', price: '37.99' },
    fr: { symbol: '€', price: '37.99' },
    es: { symbol: '€', price: '37.99' },
    pl: { symbol: 'zł', price: '169.99' },
    cs: { symbol: 'Kč', price: '899' },
    it: { symbol: '€', price: '37.99' },
  };

  const currentCurrency = currencies[i18n.language as keyof typeof currencies] || currencies.en;

  if (!mounted || !languageLoaded || !isLoaded) {
    // Loading state
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1c] overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f1c]/80 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg" />
              <span className="text-xl font-bold text-white">ThermoChef</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.features')}
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.pricing')}
              </Link>
              <LanguageSelector />
              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    {t('nav.dashboard')}
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
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-300 hover:text-white transition-colors">
                      {t('nav.signIn')}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                      {t('nav.getStarted')}
                    </button>
                  </SignUpButton>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {t('hero.title.part1')}{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('hero.title.highlight')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {isSignedIn ? (
              <Link
                href="/dashboard/convert"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all inline-block"
              >
                {t('hero.cta.convertNow')}
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all">
                  {t('hero.cta.primary')}
                </button>
              </SignUpButton>
            )}
            <Link 
              href="#demo"
              className="px-8 py-4 border border-gray-600 rounded-xl text-white font-semibold text-lg hover:bg-white/5 transition-all"
            >
              {t('hero.cta.secondary')}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '718,024', label: t('stats.recipes') },
              { value: '8.716', label: t('stats.rating') },
              { value: '4.026', label: t('stats.users') },
              { value: '7', label: t('stats.languages') },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Recipe Cards */}
        <FloatingCards />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t(`features.items.${feature.key}.title`)}
                </h3>
                <p className="text-gray-300">
                  {t(`features.items.${feature.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${
                  tier.featured ? 'scale-105' : ''
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-sm font-semibold text-white">
                    {t('pricing.popular')}
                  </div>
                )}
                <div className={`h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border ${
                  tier.featured ? 'border-emerald-500/50' : 'border-gray-700/50'
                } hover:border-emerald-500/50 transition-all`}>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t(`pricing.tiers.${tier.key}.name`)}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {t(`pricing.tiers.${tier.key}.description`)}
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-white">
                      {tier.price === 'Free' ? t('pricing.free') : `${currentCurrency.symbol}${tier.key === 'pro' ? currentCurrency.price : (parseFloat(currentCurrency.price) * 1.5).toFixed(2)}`}
                    </span>
                    {tier.price !== 'Free' && (
                      <span className="text-gray-400">/{t('pricing.year')}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-emerald-400 mr-2">✓</span>
                        <span className="text-gray-300">
                          {t(`pricing.tiers.${tier.key}.features.${i}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {isSignedIn ? (
                    <Link
                      href="/dashboard"
                      className={`w-full py-3 rounded-xl font-semibold transition-all inline-block text-center ${
                        tier.featured
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                          : 'border border-gray-600 text-white hover:bg-white/5'
                      }`}
                    >
                      {t('nav.dashboard')}
                    </Link>
                  ) : (
                    <SignUpButton mode="modal">
                      <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        tier.featured
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                          : 'border border-gray-600 text-white hover:bg-white/5'
                      }`}>
                        {t(`pricing.tiers.${tier.key}.cta`)}
                      </button>
                    </SignUpButton>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg" />
              <span className="text-lg font-semibold text-white">ThermoChef</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 ThermoChef. {t('footer.rights')}
            </p>
            <nav className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('footer.terms')}
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('footer.contact')}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="text-sm">{currentLang.code.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 right-0 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-700 overflow-hidden min-w-[150px]"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                localStorage.setItem('language', lang.code);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center space-x-2 hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm text-gray-300">{lang.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function FloatingCards() {
  return (
    <>
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -left-64 xl:left-10 w-64 h-40 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 hidden xl:block"
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg" />
          <span className="text-white font-semibold">Pasta Carbonara</span>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <div>TM6 • 25 min • 4 servings</div>
          <div className="flex space-x-2">
            <span className="text-yellow-400">★★★★★</span>
            <span>4.9 (234)</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 -right-64 xl:right-10 w-64 h-40 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 hidden xl:block"
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg" />
          <span className="text-white font-semibold">Chocolate Soufflé</span>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <div>TM5 • 45 min • 6 servings</div>
          <div className="flex space-x-2">
            <span className="text-yellow-400">★★★★★</span>
            <span>4.8 (567)</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const features = [
  {
    key: 'urlToRecipe',
    icon: '🔗',
    title: 'URL to Recipe',
    description: 'Simply paste any recipe URL and watch as we convert it into perfect Thermomix instructions.',
  },
  {
    key: 'aiPowered',
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Our AI understands cooking methods and automatically converts them to optimal Thermomix settings.',
  },
  {
    key: 'multiLanguage',
    icon: '🌍',
    title: 'Multi-Language',
    description: 'Convert and translate recipes in 7 languages including English, French, German, and more.',
  },
  {
    key: 'deviceSpecific',
    icon: '📱',
    title: 'Device Specific',
    description: 'Optimized conversions for TM5, TM6, and the upcoming TM7 with device-specific features.',
  },
  {
    key: 'imageGeneration',
    icon: '🖼️',
    title: 'Image Generation',
    description: 'Generate beautiful recipe images when the original does not have one.',
  },
  {
    key: 'nutritionInfo',
    icon: '📊',
    title: 'Nutrition Info',
    description: 'Automatic nutritional calculation for every recipe you convert.',
  },
];

const pricingTiers = [
  {
    key: 'free',
    name: 'Free',
    description: 'Perfect for trying out',
    price: 'Free',
    features: [
      '5 conversions per month',
      'Basic recipe storage (25 recipes)',
      'Standard image generation',
      'Community support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    description: 'For serious home cooks',
    price: '$39.99',
    features: [
      'Unlimited conversions',
      'Unlimited recipe storage',
      'HD image generation',
      'Priority support',
      'Export capabilities',
      'Advanced filters',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    key: 'family',
    name: 'Family',
    description: 'Share with loved ones',
    price: '$59.99',
    features: [
      'Everything in Pro',
      '5 family member accounts',
      'Shared recipe collections',
      'Meal planning calendar',
      'Shopping list sync',
      'Premium support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
];