'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRecipeStore } from '@/store';
import { RecipeUrlInput } from '@/components/convert/recipe-url-input';
import { RecipePreview } from '@/components/convert/recipe-preview';
import { ConversionResult } from '@/components/convert/conversion-result';
import { DeviceSelector } from '@/components/convert/device-selector';

export default function ConvertPage() {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'preview' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    currentRecipe,
    convertedRecipe,
    setCurrentRecipe,
    setConvertedRecipe,
    userPreferences,
  } = useRecipeStore();

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to parse recipe');
      }

      const recipeData = await response.json();
      setCurrentRecipe(recipeData);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!currentRecipe) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/convert-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe: currentRecipe,
          deviceModel: userPreferences.thermomixModel,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.limitReached) {
          router.push('/dashboard/subscription');
          return;
        }
        throw new Error(data.error || 'Failed to convert recipe');
      }

      const { recipe: convertedRecipe } = await response.json();
      setConvertedRecipe(convertedRecipe);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep('input');
    setCurrentRecipe(null);
    setConvertedRecipe(null);
    setError(null);
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
      className="mx-auto max-w-4xl space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-white mb-2">Convert Recipe</h1>
        <p className="text-gray-300 text-lg">
          Transform any recipe from the web into Thermomix instructions.
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold ${
                step === 'input' 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'bg-gray-700/50 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              1
            </motion.div>
            <span className={`ml-3 text-sm font-medium ${
              step === 'input' ? 'text-white' : 'text-gray-400'
            }`}>Enter URL</span>
          </div>
          
          <div className="h-px flex-1 bg-gray-600/30 mx-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: '0%' }}
              animate={{ width: step !== 'input' ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex items-center">
            <motion.div 
              className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold ${
                step === 'preview' 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25' 
                  : step === 'result' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              2
            </motion.div>
            <span className={`ml-3 text-sm font-medium ${
              step === 'preview' ? 'text-white' : step === 'result' ? 'text-emerald-400' : 'text-gray-400'
            }`}>Preview Recipe</span>
          </div>
          
          <div className="h-px flex-1 bg-gray-600/30 mx-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: '0%' }}
              animate={{ width: step === 'result' ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex items-center">
            <motion.div 
              className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold ${
                step === 'result' 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'bg-gray-700/50 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              3
            </motion.div>
            <span className={`ml-3 text-sm font-medium ${
              step === 'result' ? 'text-white' : 'text-gray-400'
            }`}>Get Result</span>
          </div>
        </div>
      </motion.div>

      {/* Device Selector */}
      <motion.div variants={itemVariants}>
        <DeviceSelector />
      </motion.div>

      {/* Main Content */}
      {error && (
        <motion.div 
          className="bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/50"
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <p className="text-red-200 font-medium">{error}</p>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        {step === 'input' && (
          <RecipeUrlInput
            onSubmit={handleUrlSubmit}
            isLoading={isLoading}
          />
        )}

        {step === 'preview' && currentRecipe && (
          <RecipePreview
            recipe={currentRecipe}
            onConvert={handleConvert}
            onBack={() => setStep('input')}
            isLoading={isLoading}
          />
        )}

        {step === 'result' && convertedRecipe && (
          <ConversionResult
            recipe={convertedRecipe}
            onStartOver={handleStartOver}
          />
        )}
      </motion.div>
    </motion.div>
  );
}