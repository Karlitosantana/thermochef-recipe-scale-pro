'use client';

import { motion } from 'framer-motion';
import { RecipeData } from '@/types';

interface RecipePreviewProps {
  recipe: RecipeData;
  onConvert: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function RecipePreview({ recipe, onConvert, onBack, isLoading }: RecipePreviewProps) {
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

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Recipe Header */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-white mb-3">{recipe.title}</h2>
        {recipe.description && (
          <p className="text-gray-300 leading-relaxed">{recipe.description}</p>
        )}
        
        <div className="mt-6 flex flex-wrap gap-4">
          {recipe.prepTime && (
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
              <span className="text-emerald-400">⏱️</span>
              <span className="text-sm text-white font-medium">Prep: {recipe.prepTime} min</span>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20">
              <span className="text-orange-400">🔥</span>
              <span className="text-sm text-white font-medium">Cook: {recipe.cookTime} min</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-cyan-500/10 px-3 py-2 rounded-lg border border-cyan-500/20">
            <span className="text-cyan-400">🍽️</span>
            <span className="text-sm text-white font-medium">Servings: {recipe.servings}</span>
          </div>
        </div>
      </motion.div>

      {/* Ingredients */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">🥬</span>
          </div>
          <h3 className="text-xl font-semibold text-white">Ingredients</h3>
        </div>
        <ul className="space-y-3">
          {recipe.ingredients.map((ingredient, index) => (
            <motion.li 
              key={index} 
              className="flex items-start group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-gray-300 leading-relaxed">
                <span className="font-medium text-white">
                  {ingredient.amount} {ingredient.unit}
                </span>{' '}
                {ingredient.name}
                {ingredient.notes && (
                  <span className="text-gray-400"> ({ingredient.notes})</span>
                )}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-white">Instructions</h3>
        </div>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction, index) => (
            <motion.li 
              key={index} 
              className="flex items-start group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-lg">
                {index + 1}
              </div>
              <span className="text-gray-300 leading-relaxed pt-1">{instruction}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex gap-4"
        variants={itemVariants}
      >
        <motion.button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-xl text-white font-medium transition-all"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={onConvert}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <motion.div
                className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Converting...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Convert to Thermomix</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}