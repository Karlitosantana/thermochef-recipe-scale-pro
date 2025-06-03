'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ConvertedRecipe } from '@/types';
import { formatTime } from '@/lib/utils';

interface ConversionResultProps {
  recipe: ConvertedRecipe;
  onStartOver: () => void;
}

export function ConversionResult({ recipe, onStartOver }: ConversionResultProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const getStepSummary = (step: typeof recipe.thermomixSteps[0]) => {
    const parts = [];
    if (step.temperature) {
      parts.push(`${step.temperature}${typeof step.temperature === 'number' ? '°C' : ''}`);
    }
    parts.push(`Speed ${step.speed}`);
    parts.push(formatTime(step.time));
    if (step.reverse) parts.push('↺');
    if (step.attachment) parts.push(`+ ${step.attachment}`);
    return parts.join(' • ');
  };

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
      {/* Success Banner */}
      <motion.div 
        className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
        variants={itemVariants}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <motion.h2 
              className="text-3xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Conversion Complete! 🎉
            </motion.h2>
            <p className="text-gray-300">
              Your recipe has been converted for <span className="font-semibold text-emerald-400">{recipe.deviceModel}</span>
            </p>
          </div>
          <motion.span 
            className="rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {recipe.difficulty}
          </motion.span>
        </div>
        
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
            <span className="text-emerald-400">⏱️</span>
            <span className="text-sm text-white font-medium">Total: {formatTime(recipe.estimatedTime)}</span>
          </div>
          <div className="flex items-center gap-2 bg-cyan-500/10 px-3 py-2 rounded-lg border border-cyan-500/20">
            <span className="text-cyan-400">🍽️</span>
            <span className="text-sm text-white font-medium">{recipe.servings} servings</span>
          </div>
        </div>
      </motion.div>

      {/* Thermomix Steps */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">🔄</span>
          </div>
          <h3 className="text-xl font-semibold text-white">Thermomix Steps</h3>
        </div>
        
        <div className="space-y-4">
          {recipe.thermomixSteps.map((step: any, index: number) => (
            <motion.div
              key={index}
              className="rounded-xl border border-gray-600/50 p-4 bg-gray-800/30 hover:border-emerald-500/30 transition-all group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </div>
                    <p className="font-medium text-white leading-relaxed">{step.instruction}</p>
                  </div>
                  
                  <div className="mt-3 ml-11">
                    <code className="inline-flex items-center gap-2 rounded-lg bg-gray-700/50 border border-gray-600/50 px-3 py-2 text-sm font-mono text-gray-300">
                      {getStepSummary(step)}
                    </code>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => copyToClipboard(step.instruction, index)}
                  className="ml-4 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all"
                  title="Copy step"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copiedStep === index ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-400"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    '📋'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex gap-4"
        variants={itemVariants}
      >
        <motion.button
          onClick={onStartOver}
          className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-xl text-white font-medium transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Convert Another
        </motion.button>
        <motion.button 
          className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>💾</span>
          <span>Save to My Recipes</span>
        </motion.button>
        <motion.button 
          className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-xl text-white font-medium transition-all flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🖨️</span>
          <span>Print</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}