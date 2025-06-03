'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ViewToggleProps {
  currentView: 'grid' | 'list';
}

export function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setView = (view: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`/dashboard/recipes?${params.toString()}`);
  };

  return (
    <div className="flex rounded-lg border border-text-dark/20 p-1">
      <button
        onClick={() => setView('grid')}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
          currentView === 'grid'
            ? 'bg-accent text-primary'
            : 'text-text-dark hover:text-text'
        }`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Grid
      </button>
      
      <button
        onClick={() => setView('list')}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
          currentView === 'list'
            ? 'bg-accent text-primary'
            : 'text-text-dark hover:text-text'
        }`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        List
      </button>
    </div>
  );
}