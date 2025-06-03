'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RecipeUrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function RecipeUrlInput({ onSubmit, isLoading }: RecipeUrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-3">
            Recipe URL
          </label>
          <motion.input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
            className="w-full rounded-xl bg-gray-800/50 border border-gray-600/50 px-4 py-3 text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-sm"
            required
            disabled={isLoading}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <p className="mt-3 text-sm text-gray-400">
            Paste any recipe URL from your favorite cooking website
          </p>
        </div>

        <motion.button
          type="submit"
          className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={isLoading || !url.trim()}
          whileHover={{ scale: isLoading || !url.trim() ? 1 : 1.02 }}
          whileTap={{ scale: isLoading || !url.trim() ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <motion.div
                className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Parsing Recipe...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Parse Recipe</span>
            </>
          )}
        </motion.button>
      </form>

      <motion.div 
        className="mt-8 border-t border-gray-600/30 pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">🌐</span>
          </div>
          <h3 className="text-sm font-medium text-white">Supported Websites</h3>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          We support most recipe websites including AllRecipes, Food Network, 
          BBC Good Food, Serious Eats, and many more. If a website doesn't work, 
          let us know!
        </p>
      </motion.div>
    </motion.div>
  );
}