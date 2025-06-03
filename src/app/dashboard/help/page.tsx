'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I convert a recipe for my Thermomix?',
    answer: 'Simply paste the recipe URL or text into our converter tool. Our AI will analyze the recipe and provide optimized instructions for your specific Thermomix model, including cooking times, temperatures, and speed settings.',
  },
  {
    category: 'Getting Started',
    question: 'Which Thermomix models are supported?',
    answer: 'We support TM5, TM6, and TM7. Each model has specific optimizations for temperature ranges, bowl capacity, and cooking functions.',
  },
  {
    category: 'Features',
    question: 'What\'s included in the Pro plan?',
    answer: 'Pro plan includes unlimited recipe conversions, unlimited recipe storage, HD image generation, priority email support, export capabilities, and advanced search filters.',
  },
  {
    category: 'Features',
    question: 'Can I share recipes with family members?',
    answer: 'Yes! Family plan subscribers can share recipes with up to 5 family member accounts, create shared collections, and sync shopping lists.',
  },
  {
    category: 'Technical',
    question: 'Why is my recipe conversion taking so long?',
    answer: 'Complex recipes may take 30-60 seconds to process. Our AI analyzes ingredients, cooking methods, and optimizes for your specific device. Premium subscribers get priority processing.',
  },
  {
    category: 'Technical',
    question: 'Can I export my recipes?',
    answer: 'Yes! Pro and Family subscribers can export recipes as PDF files or print-friendly formats. You can also export shopping lists.',
  },
  {
    category: 'Account',
    question: 'How do I cancel my subscription?',
    answer: 'Go to Settings > Subscription and click "Manage Billing". You can cancel anytime and your subscription will remain active until the end of your billing period.',
  },
  {
    category: 'Account',
    question: 'Can I change my plan?',
    answer: 'Yes! You can upgrade or downgrade your plan anytime in the Subscription settings. Changes take effect at your next billing cycle.',
  },
];

const categories = ['All', 'Getting Started', 'Features', 'Technical', 'Account'];

export default function HelpPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSent(true);
        setContactForm({ subject: '', message: '', priority: 'normal' });
        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

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

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-white mb-2">Help & Support</h1>
        <p className="text-gray-300 text-lg">
          Find answers to common questions or get in touch with our support team
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="text-lg font-semibold text-white">User Guide</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Learn how to get the most out of ThermoChef with our comprehensive guide.
          </p>
          <button className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
            Read Guide →
          </button>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Video Tutorials</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Watch step-by-step tutorials on recipe conversion and advanced features.
          </p>
          <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm">
            Watch Videos →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Community</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Join our community forum to share recipes and get cooking tips.
          </p>
          <button className="text-purple-400 hover:text-purple-300 font-medium text-sm">
            Join Community →
          </button>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-700/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 mb-2">
                    {faq.category}
                  </span>
                  <h3 className="font-medium text-white">{faq.question}</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFAQ === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-gray-800/20 border-t border-gray-700/50"
                >
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No FAQs found matching your search.</p>
          </div>
        )}
      </motion.div>

      {/* Contact Form */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Contact Support</h2>
        <p className="text-gray-300 mb-6">
          Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
        </p>

        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={contactForm.priority}
                onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              required
              rows={6}
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Please provide as much detail as possible about your issue..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                sent
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600'
              }`}
            >
              {sending ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Sending...
                </>
              ) : sent ? (
                <>
                  <span className="mr-2">✓</span>
                  Message Sent!
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}