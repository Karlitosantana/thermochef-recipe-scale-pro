'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/nextjs';

interface UserSettings {
  language: string;
  currency: string;
  defaultDevice: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  measurementSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'cs', name: 'Čeština' },
];

const currencies = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'CAD', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', name: 'Australian Dollar (A$)' },
  { code: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'PLN', name: 'Polish Zloty (zł)' },
  { code: 'CZK', name: 'Czech Koruna (Kč)' },
];

const devices = [
  { id: 'TM6', name: 'Thermomix TM6' },
  { id: 'TM5', name: 'Thermomix TM5' },
  { id: 'TM7', name: 'Thermomix TM7' },
];

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    currency: 'USD',
    defaultDevice: 'TM6',
    emailNotifications: true,
    weeklyDigest: false,
    measurementSystem: 'metric',
    theme: 'dark',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (response.ok) {
        const userSettings = await response.json();
        setSettings(userSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        
        // Apply language change
        if (settings.language !== i18n.language) {
          i18n.changeLanguage(settings.language);
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300 text-lg">
          Customize your ThermoChef experience
        </p>
      </motion.div>

      {/* Localization Settings */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Localization</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Measurement System
            </label>
            <select
              value={settings.measurementSystem}
              onChange={(e) => handleSettingChange('measurementSystem', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="metric">Metric (kg, g, L, ml)</option>
              <option value="imperial">Imperial (lbs, oz, cups, fl oz)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Default Device
            </label>
            <select
              value={settings.defaultDevice}
              onChange={(e) => handleSettingChange('defaultDevice', e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['light', 'dark', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleSettingChange('theme', theme)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.theme === theme
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🔄'}
                  </div>
                  <div className="text-sm font-medium text-white capitalize">
                    {theme}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Email Notifications</h3>
              <p className="text-xs text-gray-400">
                Receive updates about your recipes and account
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Weekly Digest</h3>
              <p className="text-xs text-gray-400">
                Get a summary of your cooking activity
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('weeklyDigest', !settings.weeklyDigest)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weeklyDigest ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <button
          onClick={saveSettings}
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
            'Save Settings'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}