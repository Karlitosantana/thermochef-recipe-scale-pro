'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={`inline-block ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-full h-full border-2 border-current border-t-transparent rounded-full" />
    </motion.div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <h2 className="text-xl font-semibold text-white mb-2">Loading ThermoChef</h2>
        <p className="text-gray-400">Please wait while we prepare your cooking experience...</p>
      </motion.div>
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4" />
        <div className="h-3 bg-gray-700/50 rounded w-1/2 mb-3" />
        <div className="h-3 bg-gray-700/50 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-700/50 rounded w-1/3" />
      </div>
    </div>
  );
}

export function RecipeGridLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          <div className="animate-pulse">
            <div className="h-48 bg-gray-700/50" />
            <div className="p-4">
              <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-700/50 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-700/50 rounded w-2/3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b border-gray-700/50 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-700/50 rounded" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-gray-700/50 p-4 last:border-b-0">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-3 bg-gray-700/50 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ButtonLoading({ children, loading, ...props }: { 
  children: React.ReactNode; 
  loading: boolean; 
  [key: string]: any;
}) {
  return (
    <button disabled={loading} {...props}>
      <div className="flex items-center justify-center space-x-2">
        {loading && <LoadingSpinner size="sm" className="text-current" />}
        <span>{children}</span>
      </div>
    </button>
  );
}

export function FullscreenLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center"
      >
        <LoadingSpinner size="lg" className="text-emerald-500 mx-auto mb-4" />
        <p className="text-white font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
}