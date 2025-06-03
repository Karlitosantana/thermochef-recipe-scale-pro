'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealSlot {
  id: string;
  date: Date;
  mealType: MealType;
  recipe?: {
    id: string;
    title: string;
    servings: number;
    prepTime: number;
    cookTime: number;
  };
  customMeal?: string;
  notes?: string;
}

export default function MealPlanningPage() {
  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlan, setMealPlan] = useState<MealSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<MealSlot | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const mealTypeIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍿',
  };

  useEffect(() => {
    // Load meal plan for current week
    loadMealPlan();
  }, [currentWeek]);

  const loadMealPlan = async () => {
    // Mock data for demo
    const mockPlan: MealSlot[] = [
      {
        id: '1',
        date: weekDays[0],
        mealType: 'breakfast',
        recipe: {
          id: '1',
          title: 'Overnight Oats',
          servings: 2,
          prepTime: 5,
          cookTime: 0,
        },
      },
      {
        id: '2',
        date: weekDays[0],
        mealType: 'lunch',
        recipe: {
          id: '2',
          title: 'Chicken Salad',
          servings: 4,
          prepTime: 15,
          cookTime: 20,
        },
      },
      {
        id: '3',
        date: weekDays[1],
        mealType: 'dinner',
        recipe: {
          id: '3',
          title: 'Pasta Carbonara',
          servings: 4,
          prepTime: 15,
          cookTime: 20,
        },
      },
    ];
    setMealPlan(mockPlan);
  };

  const getMealForSlot = (date: Date, mealType: MealType) => {
    return mealPlan.find(
      (meal) =>
        format(meal.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        meal.mealType === mealType
    );
  };

  const handleAddMeal = (date: Date, mealType: MealType) => {
    setSelectedSlot({
      id: `${format(date, 'yyyy-MM-dd')}-${mealType}`,
      date,
      mealType,
    });
    setIsAddingMeal(true);
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
        <h1 className="text-4xl font-bold text-white mb-2">
          {t('mealPlanning.title')}
        </h1>
        <p className="text-gray-300 text-lg">
          {t('mealPlanning.subtitle')}
        </p>
      </motion.div>

      {/* Week Navigation */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            {format(weekStart, 'MMMM d')} - {format(endOfWeek(weekStart), 'd, yyyy')}
          </h2>
        </div>

        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {t('mealPlanning.generateList')}
              </h3>
              <p className="text-xs text-gray-400">{t('mealPlanning.generateListDesc')}</p>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/30 hover:border-cyan-500/50 transition-all group">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎲</span>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {t('mealPlanning.suggest')}
              </h3>
              <p className="text-xs text-gray-400">{t('mealPlanning.suggestDesc')}</p>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all group">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                {t('mealPlanning.nutrition')}
              </h3>
              <p className="text-xs text-gray-400">{t('mealPlanning.nutritionDesc')}</p>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Meal Plan Grid */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
      >
        <div className="grid grid-cols-8 border-b border-gray-700/50">
          <div className="p-4 text-center">
            <span className="text-sm font-medium text-gray-400">{t('mealPlanning.mealTime')}</span>
          </div>
          {weekDays.map((day) => (
            <div key={day.toString()} className="p-4 text-center border-l border-gray-700/50">
              <div className="text-sm font-medium text-gray-300">
                {format(day, 'EEE')}
              </div>
              <div className="text-lg font-semibold text-white">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {mealTypes.map((mealType) => (
          <div key={mealType} className="grid grid-cols-8 border-t border-gray-700/50">
            <div className="p-4 flex items-center space-x-2 bg-gray-800/30">
              <span className="text-2xl">{mealTypeIcons[mealType]}</span>
              <span className="text-sm font-medium text-gray-300 capitalize">
                {t(`mealPlanning.${mealType}`)}
              </span>
            </div>
            {weekDays.map((day) => {
              const meal = getMealForSlot(day, mealType);
              return (
                <div
                  key={day.toString()}
                  className="p-3 border-l border-gray-700/50 min-h-[100px] hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => handleAddMeal(day, mealType)}
                >
                  {meal ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg p-2 border border-emerald-500/30"
                    >
                      <h4 className="text-xs font-semibold text-white truncate">
                        {meal.recipe?.title || meal.customMeal}
                      </h4>
                      {meal.recipe && (
                        <p className="text-xs text-gray-400 mt-1">
                          {meal.recipe.servings} servings
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center group">
                      <div className="text-gray-600 group-hover:text-gray-400 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-1">{t('mealPlanning.totalMeals')}</div>
          <div className="text-2xl font-bold text-white">{mealPlan.length}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-1">{t('mealPlanning.recipesUsed')}</div>
          <div className="text-2xl font-bold text-white">
            {mealPlan.filter((m) => m.recipe).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-1">{t('mealPlanning.prepTime')}</div>
          <div className="text-2xl font-bold text-white">
            {mealPlan.reduce((acc, m) => acc + (m.recipe?.prepTime || 0), 0)} min
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-1">{t('mealPlanning.cookTime')}</div>
          <div className="text-2xl font-bold text-white">
            {mealPlan.reduce((acc, m) => acc + (m.recipe?.cookTime || 0), 0)} min
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}