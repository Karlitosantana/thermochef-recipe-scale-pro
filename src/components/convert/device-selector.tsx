'use client';

import { motion } from 'framer-motion';
import { useRecipeStore } from '@/store';
import { ThermomixModel } from '@/types';

const devices: { model: ThermomixModel; name: string; features: string[] }[] = [
  {
    model: 'TM5',
    name: 'Thermomix TM5',
    features: ['Max temp: 120°C', 'Manual cooking'],
  },
  {
    model: 'TM6',
    name: 'Thermomix TM6',
    features: ['Max temp: 160°C', 'Guided cooking', 'WiFi enabled'],
  },
  {
    model: 'TM7',
    name: 'Thermomix TM7',
    features: ['Max temp: 160°C', 'AI cooking assistant', 'Coming soon'],
  },
];

export function DeviceSelector() {
  const { userPreferences, updateUserPreferences } = useRecipeStore();

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
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
          <span className="text-lg">⚙️</span>
        </div>
        <h3 className="text-lg font-semibold text-white">Select Your Device</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        {devices.map((device: any, index) => (
          <motion.button
            key={device.model}
            onClick={() => updateUserPreferences({ thermomixModel: device.model })}
            className={`rounded-xl border-2 p-4 text-left transition-all group ${
              userPreferences.thermomixModel === device.model
                ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-gray-600/50 hover:border-emerald-500/30 hover:bg-gray-800/30'
            } ${device.model === 'TM7' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={device.model === 'TM7'}
            variants={itemVariants}
            whileHover={device.model !== 'TM7' ? { scale: 1.02 } : {}}
            whileTap={device.model !== 'TM7' ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-semibold ${
                userPreferences.thermomixModel === device.model 
                  ? 'text-white' 
                  : 'text-gray-300 group-hover:text-white'
              }`}>
                {device.name}
              </h4>
              {userPreferences.thermomixModel === device.model && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
              {device.model === 'TM7' && (
                <span className="text-xs text-orange-400 font-medium">Soon</span>
              )}
            </div>
            <ul className="space-y-1">
              {device.features.map((feature: string) => (
                <li 
                  key={feature} 
                  className={`text-xs flex items-center ${
                    userPreferences.thermomixModel === device.model 
                      ? 'text-gray-300' 
                      : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                >
                  <span className="w-1 h-1 bg-current rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}