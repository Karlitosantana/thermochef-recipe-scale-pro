'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  cookingLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  favoriteDevices: string[];
  cookingGoals: string[];
  allergens: string[];
}

const cookingLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Just getting started' },
  { id: 'intermediate', name: 'Intermediate', description: 'Comfortable with basics' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced home cook' },
  { id: 'expert', name: 'Expert', description: 'Professional level skills' },
];

const availableDevices = [
  { id: 'TM6', name: 'Thermomix TM6' },
  { id: 'TM5', name: 'Thermomix TM5' },
  { id: 'TM7', name: 'Thermomix TM7' },
  { id: 'Other', name: 'Other Kitchen Tools' },
];

const commonGoals = [
  'Eat healthier',
  'Save time cooking',
  'Learn new cuisines',
  'Cook for family',
  'Meal prep',
  'Bake more often',
  'Reduce food waste',
  'Entertain guests',
];

const commonAllergens = [
  'Gluten',
  'Dairy',
  'Nuts',
  'Soy',
  'Eggs',
  'Shellfish',
  'Fish',
  'Sesame',
];

export default function ProfilePage() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    cookingLevel: 'beginner',
    favoriteDevices: ['TM6'],
    cookingGoals: [],
    allergens: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.fullName || user.firstName || '',
      }));
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userProfile = await response.json();
        setProfile((prev) => ({ ...prev, ...userProfile }));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'favoriteDevices' | 'cookingGoals' | 'allergens', item: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
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
        <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-300 text-lg">
          Tell us about yourself to get personalized recipe recommendations
        </p>
      </motion.div>

      {/* Basic Information */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="City, Country"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Tell us about your cooking journey..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profile.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://your-website.com"
            />
          </div>
        </div>
      </motion.div>

      {/* Cooking Level */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Cooking Level</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cookingLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleInputChange('cookingLevel', level.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                profile.cookingLevel === level.id
                  ? 'border-emerald-500 bg-emerald-500/20'
                  : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
              }`}
            >
              <h3 className="font-semibold text-white">{level.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{level.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Favorite Devices */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Favorite Devices</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableDevices.map((device) => (
            <button
              key={device.id}
              onClick={() => toggleArrayItem('favoriteDevices', device.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                profile.favoriteDevices.includes(device.id)
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-sm font-medium">{device.name}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cooking Goals */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Cooking Goals</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonGoals.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleArrayItem('cookingGoals', goal)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                profile.cookingGoals.includes(goal)
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                  : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-sm font-medium">{goal}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Dietary Restrictions */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Allergens & Dietary Restrictions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonAllergens.map((allergen) => (
            <button
              key={allergen}
              onClick={() => toggleArrayItem('allergens', allergen)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                profile.allergens.includes(allergen)
                  ? 'border-red-500 bg-red-500/20 text-red-400'
                  : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-sm font-medium">{allergen}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600'
          }`}
        >
          {saving ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Saving...
            </>
          ) : saved ? (
            <>
              <span className="mr-2">✓</span>
              Saved!
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}